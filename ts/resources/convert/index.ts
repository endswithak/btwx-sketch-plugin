/* eslint-disable @typescript-eslint/no-use-before-define */
import { convertPosition } from './generalUtils';
import { convertFill } from './fillUtils';
import { convertStroke, convertStrokeOptions } from './strokeUtils';
// import { getImage, getImageId } from './imageUtils';
import { convertShadow } from './shadowUtils';
import { getShapeGroupChildren } from './shapeGroupUtils';
// import * as textUtils from './textUtils';

interface ConvertLayers {
  sketchLayers: (srm.RelevantLayer | srm.Artboard)[];
  images: {
    [id: string]: btwix.DocumentImage;
  };
  sketch: srm.Sketch;
  parentFrame: any;
}

export const convertLayers = ({ sketchLayers, images, sketch, parentFrame }: ConvertLayers): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    let layers: btwix.Layer[] = [];
    let xOffset = 0;
    let masked = false;
    const promises: Promise<btwix.Layer[]>[] = [];
    sketchLayers.forEach((sketchLayer, index) => {
      if (sketchLayer.sketchObject.hasClippingMask() && sketchLayer.parent.type === 'Group') {
        masked = true;
      }
      // if (sketchLayer.sketchObject.shouldBreakMaskChain()) {
      //   masked = false;
      // }
      promises.push(convertLayer({sketchLayer, images, sketch, xOffset, masked, parentFrame}));
      if (sketchLayer.type === 'Artboard') {
        xOffset += (sketchLayer.frame.width + 48);
      }
    });
    Promise.all(promises).then((result) => {
      result.forEach((promise) => {
        layers = [...layers, ...promise];
      });
      resolve(layers);
    });
  });
}

interface ConvertLayer {
  sketchLayer: srm.RelevantLayer | srm.Artboard;
  images: {
    [id: string]: btwix.DocumentImage;
  };
  sketch: srm.Sketch;
  xOffset: number;
  masked: boolean;
  parentFrame: any;
}

export const convertArtboard = ({ sketchLayer, images, sketch, xOffset, masked, parentFrame }: ConvertLayer): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    convertLayers({
      sketchLayers: (sketchLayer as srm.Artboard).layers as srm.RelevantLayer[],
      parentFrame: {
        width: sketchLayer.frame.width,
        height: sketchLayer.frame.height,
        x: xOffset,
        y: 0,
      },
      images,
      sketch
    }).then((layers) => {
      resolve(
        [
          {
            id: sketchLayer.id,
            type: 'Artboard',
            name: sketchLayer.name,
            parent: 'page',
            frame: {
              x: xOffset,
              y: 0,
              width: sketchLayer.frame.width,
              height: sketchLayer.frame.height,
              innerWidth: sketchLayer.frame.width,
              innerHeight: sketchLayer.frame.height
            }
          },
          ...layers
        ] as btwix.Layer[]
      );
    });
  });
}

export const convertShapeGroup = ({ sketchLayer, images, sketch, masked, parentFrame }: ConvertLayer): Promise<btwix.Shape[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Shape);
    resolve(
      [
        {
          id: sketchLayer.id,
          type: 'ShapeGroup',
          name: sketchLayer.name,
          parent: sketchLayer.parent.id,
          masked: masked,
          mask: sketchLayer.sketchObject.hasClippingMask() && sketchLayer.index === 0 && sketchLayer.parent.type === 'Group',
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          style: {
            fill: convertFill(sketchLayer as srm.Shape),
            stroke: convertStroke(sketchLayer as srm.Shape),
            strokeOptions: convertStrokeOptions(sketchLayer as srm.Shape),
            shadow: convertShadow(sketchLayer as srm.Shape),
            blendMode: (sketchLayer as srm.Shape).style.blendingMode.toLowerCase() as btwix.BlendMode,
            opacity: (sketchLayer as srm.Shape).style.opacity
          },
          transform: {
            rotation: (sketchLayer as srm.Shape).transform.rotation,
            verticalFlip: (sketchLayer as srm.Shape).transform.flippedVertically,
            horizontalFlip: (sketchLayer as srm.Shape).transform.flippedHorizontally
          },
          sketchLayer: {
            ...sketchLayer.toJSON(),
            layers: getShapeGroupChildren(sketchLayer as srm.Shape)
          }
        } as any
      ]
    );
  });
}

export const convertShapePath = ({ sketchLayer, images, sketch, masked, parentFrame }: ConvertLayer): Promise<btwix.Shape[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.ShapePath);
    resolve(
      [
        {
          id: sketchLayer.id,
          type: 'Shape',
          shapeType: 'Custom',
          name: sketchLayer.name,
          parent: sketchLayer.parent.id,
          masked: masked,
          mask: sketchLayer.sketchObject.hasClippingMask() && sketchLayer.index === 0 && sketchLayer.parent.type === 'Group',
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          pathData: (sketchLayer as srm.ShapePath).getSVGPath(),
          style: {
            fill: convertFill(sketchLayer as srm.ShapePath),
            stroke: convertStroke(sketchLayer as srm.ShapePath),
            strokeOptions: convertStrokeOptions(sketchLayer as srm.ShapePath),
            shadow: convertShadow(sketchLayer as srm.ShapePath),
            blendMode: (sketchLayer as srm.ShapePath).style.blendingMode.toLowerCase() as btwix.BlendMode,
            opacity: (sketchLayer as srm.ShapePath).style.opacity
          },
          transform: {
            rotation: (sketchLayer as srm.ShapePath).transform.rotation,
            verticalFlip: (sketchLayer as srm.ShapePath).transform.flippedVertically,
            horizontalFlip: (sketchLayer as srm.ShapePath).transform.flippedHorizontally
          },
          closed: (sketchLayer as srm.ShapePath).closed
        } as any
      ]
    );
  });
}

export const convertGroup = ({ sketchLayer, images, sketch, masked, parentFrame }: ConvertLayer): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Group);
    const hasLayers = (sketchLayer as srm.Group).layers[0];
    const clipped = hasLayers && (sketchLayer as srm.Group).layers[0].sketchObject.hasClippingMask();
    convertLayers({
      sketchLayers: (sketchLayer as srm.Group).layers as srm.RelevantLayer[],
      parentFrame: {
        width: sketchLayer.frame.width,
        height: sketchLayer.frame.height,
        x: position.x + (parentFrame.x - (parentFrame.width / 2)),
        y: position.y + (parentFrame.y - (parentFrame.height / 2))
      },
      images,
      sketch
    }).then((layers) => {
      resolve(
        [
          {
            type: 'Group',
            id: sketchLayer.id,
            name: sketchLayer.name,
            parent: sketchLayer.parent.id,
            masked: masked,
            clipped: clipped,
            frame: {
              x: position.x + (parentFrame.x - (parentFrame.width / 2)),
              y: position.y + (parentFrame.y - (parentFrame.height / 2)),
              width: sketchLayer.frame.width,
              height: sketchLayer.frame.height,
              innerWidth: sketchLayer.frame.width,
              innerHeight: sketchLayer.frame.height
            }
          } as btwix.Group,
          ...layers
        ] as btwix.Layer[]
      );
    });
  });
}

export const convertText = ({ sketchLayer, images, sketch, parentFrame }: ConvertLayer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Image);
    const sketchRatio = (sketchLayer as srm.Text).style.fontWeight / 12;
    const domScale = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    const fontWeight = domScale[Math.floor(sketchRatio * domScale.length)];
    resolve(
      [
        {
          type: 'Text',
          id: sketchLayer.id,
          name: sketchLayer.name,
          parent: sketchLayer.parent.id,
          text: (sketchLayer as srm.Text).fragments.reduce((result, current, index) => {
            const prevFrage = (sketchLayer as srm.Text).fragments[index === 0 ? 0 : index - 1];
            result = result + current.text;
            if (index < (sketchLayer as srm.Text).fragments.length - 1 && !prevFrage.text.includes(`\n`)) {
              result = result + `\n`;
            }
            return result;
          }, ''),
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          style: {
            fill: convertFill(sketchLayer as srm.Text),
            stroke: convertStroke(sketchLayer as srm.Text),
            strokeOptions: convertStrokeOptions(sketchLayer as srm.Text),
            shadow: convertShadow(sketchLayer as srm.Text),
            blendMode: (sketchLayer as srm.Text).style.blendingMode.toLowerCase() as btwix.BlendMode,
            opacity: (sketchLayer as srm.Text).style.opacity
          },
          textStyle: {
            fontSize: (sketchLayer as srm.Text).style.fontSize,
            leading: (sketchLayer as srm.Text).style.lineHeight,
            fontWeight: fontWeight,
            fontFamily: (sketchLayer as srm.Text).style.fontFamily,
            justification: (sketchLayer as srm.Text).style.alignment
          },
          transform: {
            rotation: (sketchLayer as srm.Text).transform.rotation * -1,
            verticalFlip: (sketchLayer as srm.Text).transform.flippedVertically,
            horizontalFlip: (sketchLayer as srm.Text).transform.flippedHorizontally
          }
        }
      ]
    );
  });
}

export const convertImage = ({ sketchLayer, images, sketch, masked, parentFrame }: ConvertLayer): Promise<btwix.Image[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Image);
    resolve(
      [
        {
          type: 'Image',
          id: sketchLayer.id,
          imageId: (sketchLayer as srm.Image).image.id,
          name: sketchLayer.name,
          parent: sketchLayer.parent.id,
          masked: masked,
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          style: {
            shadow: convertShadow(sketchLayer as srm.Image),
            blendMode: (sketchLayer as srm.Image).style.blendingMode.toLowerCase() as btwix.BlendMode,
            opacity: (sketchLayer as srm.Image).style.opacity
          },
          transform: {
            rotation: (sketchLayer as srm.Image).transform.rotation * -1,
            verticalFlip: (sketchLayer as srm.Image).transform.flippedVertically,
            horizontalFlip: (sketchLayer as srm.Image).transform.flippedHorizontally
          }
        } as btwix.Image
      ]
    );
  });
}

export const convertLayer = (props: ConvertLayer): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    switch(props.sketchLayer.type) {
      case 'Artboard': {
        convertArtboard(props).then((layers) => {
          resolve(layers);
        });
        break;
      }
      case 'Shape': {
        convertShapeGroup(props).then((layers) => {
          resolve(layers);
        });
        break;
      }
      case 'ShapePath': {
        convertShapePath(props).then((layers) => {
          resolve(layers);
        });
        break;
      }
      case 'Group': {
        convertGroup(props).then((layers) => {
          resolve(layers);
        });
        break;
      }
      case 'Text': {
        convertText(props).then((layers) => {
          resolve(layers);
        });
      }
        break;
      case 'Image': {
        convertImage(props).then((layers) => {
          resolve(layers);
        });
        break;
      }
      default:
        resolve([]);
    }
  });
}

interface Convert {
  artboards: srm.Artboard[];
  images: {
    [id: string]: btwix.DocumentImage;
  };
  sketch: srm.Sketch;
}

const convert = (data: Convert): Promise<btwix.ClipboardLayers> => {
  return new Promise((resolve, reject) => {
    const { artboards, images, sketch } = data;
    convertLayers({
      sketchLayers: artboards,
      parentFrame: {
        width: 0,
        height: 0,
        x: 0,
        y: 0
      },
      images,
      sketch
    }).then((btwixLayers) => {
      const convertedLayers = btwixLayers.reduce((result: btwix.ClipboardLayers, current) => {
        if (current.type === 'Artboard') {
          result.main = [...result.main, current.id];
        }
        result.allIds = [...result.allIds, current.id];
        result.byId = { ...result.byId, [current.id]: current };
        return result;
      }, { type: 'layers', main: [], allIds: [], byId: {}, images: images });
      resolve(convertedLayers);
    });
  })
}

export default convert;