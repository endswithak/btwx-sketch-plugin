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
  parentId: string;
  parentName: string;
  parentFrame: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  masked: boolean;
  mask: boolean;
  images: {
    [id: string]: btwix.DocumentImage;
  };
  sketch: srm.Sketch;
}

export const convertLayers = ({ sketchLayers, parentId, parentFrame, images, sketch, masked, mask, parentName }: ConvertLayers): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    let layers: btwix.Layer[] = [];
    let xOffset = 0;
    const promises: Promise<btwix.Layer[]>[] = [];
    sketchLayers.forEach((sketchLayer, index) => {
      promises.push(convertLayer({sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName, xOffset}));
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
  parentId: string;
  parentName: string;
  parentFrame: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  masked: boolean;
  mask: boolean;
  images: {
    [id: string]: btwix.DocumentImage;
  };
  sketch: srm.Sketch;
  xOffset: number;
}

export const convertArtboard = ({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName, xOffset }: ConvertLayer): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    convertLayers({
      sketchLayers: (sketchLayer as srm.Artboard).layers as srm.RelevantLayer[],
      parentId: sketchLayer.id,
      parentName: sketchLayer.name,
      parentFrame: {
        width: sketchLayer.frame.width,
        height: sketchLayer.frame.height,
        x: (parentFrame.x - (parentFrame.width / 2)) + xOffset,
        y: parentFrame.y - (parentFrame.height / 2),
      },
      images,
      sketch,
      masked,
      mask
    }).then((layers) => {
      resolve(
        [
          {
            id: sketchLayer.id,
            type: 'Artboard',
            name: sketchLayer.name,
            parent: parentId,
            frame: {
              x: (parentFrame.x - (parentFrame.width / 2)) + xOffset,
              y: parentFrame.y - (parentFrame.height / 2),
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

export const convertShapeGroup = ({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName }: ConvertLayer): Promise<btwix.Shape[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Shape);
    resolve(
      [
        {
          id: sketchLayer.id,
          type: 'ShapeGroup',
          name: sketchLayer.name,
          parent: parentId,
          masked: parentName === 'btwix.mask',
          mask: parentName === 'btwix.mask' && sketchLayer.index === 0,
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

export const convertShapePath = ({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName }: ConvertLayer): Promise<btwix.Shape[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.ShapePath);
    resolve(
      [
        {
          id: sketchLayer.id,
          type: 'Shape',
          shapeType: 'Custom',
          name: sketchLayer.name,
          parent: parentId,
          masked: parentName === 'btwix.mask',
          mask: parentName === 'btwix.mask' && sketchLayer.index === 0,
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

export const convertGroup = ({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName }: ConvertLayer): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Group);
    convertLayers({
      sketchLayers: (sketchLayer as srm.Group).layers as srm.RelevantLayer[],
      parentId: sketchLayer.id,
      parentName: sketchLayer.name,
      parentFrame: {
        width: sketchLayer.frame.width,
        height: sketchLayer.frame.height,
        x: position.x + (parentFrame.x - (parentFrame.width / 2)),
        y: position.y + (parentFrame.y - (parentFrame.height / 2))
      },
      images,
      sketch,
      masked,
      mask
    }).then((layers) => {
      resolve(
        [
          {
            type: 'Group',
            name: sketchLayer.name,
            parent: parentId,
            id: sketchLayer.id,
            clipped: sketchLayer.name === 'btwix.mask',
            masked: parentName === 'btwix.mask',
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

// export const convertText = ({ sketchLayer, parentId, parentFrame, images, sketch }: ConvertLayer): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const position = convertPosition(sketchLayer);
//     const textContainer = new paperMain.Group({insert: false});
//     const fontAttrs = textUtils.getFontAttributes({
//       textStyle: sketchLayer.style.textStyle
//     });
//     const override = textUtils.getOverrideString({
//       overrides: overrides,
//       symbolPath: symbolPath
//     });
//     const textContent = textUtils.getTextTransformString({
//       str: override ? override.value as string : sketchLayer.attributedString.string,
//       textTransform: fontAttrs.textTransform
//     });
//     const textAttrs = {
//       point: textUtils.getTextPoint({
//         justfication: fontAttrs.alignment,
//         width: sketchLayer.frame.width
//       }),
//       content: textContent,
//       parent: textContainer,
//       fillColor: fontAttrs.color,
//       fontWeight: `${fontAttrs.fontStyle} ${fontAttrs.fontWeight}`,
//       fontStretch: fontAttrs.fontStretch,
//       fontFamily: fontAttrs.fontFamily,
//       justification: fontAttrs.alignment,
//       fontSize: fontAttrs.fontSize,
//       leading: fontAttrs.lineHeight,
//       letterSpacing: fontAttrs.letterSpacing
//     }
//     textUtils.drawText({
//       layer: sketchLayer,
//       textOptions: textAttrs,
//       layerOptions: {
//         parent: textContainer
//       }
//     });
//     const paperLayer = textContainer.getItem({ class: 'PointText' }) || textContainer.getItem({ class: 'AreaText' }) as paper.TextItem;
//     resolve(
//       [
//         {
//           type: 'Text',
//           id: sketchLayer.do_objectID,
//           name: sketchLayer.name,
//           parent: parentId,
//           text: textContent,
//           frame: {
//             x: position.x + (parentFrame.x - (parentFrame.width / 2)),
//             y: position.y + (parentFrame.y - (parentFrame.height / 2)),
//             width: paperLayer.bounds.width,
//             height: paperLayer.bounds.height,
//             innerWidth: paperLayer.bounds.width,
//             innerHeight: paperLayer.bounds.height
//           },
//           style: {
//             fill: convertFill(sketchLayer),
//             stroke: convertStroke(sketchLayer),
//             strokeOptions: convertStrokeOptions(sketchLayer),
//             shadow: convertShadow(sketchLayer),
//             blendMode: convertBlendMode(sketchLayer),
//             opacity: sketchLayer.style.contextSettings.opacity
//           },
//           textStyle: {
//             fontSize: textAttrs.fontSize,
//             lineHeight: textAttrs.leading,
//             fontWeight: textAttrs.fontWeight,
//             fontFamily: textAttrs.fontFamily,
//             justfication: textAttrs.justification
//           },
//           transform: {
//             rotation: sketchLayer.rotation * -1,
//             verticalFlip: sketchLayer.isFlippedVertical,
//             horizontalFlip: sketchLayer.isFlippedHorizontal
//           },
//           paperLayer
//         }
//       ]
//     );
//   });
// }

export const convertImage = ({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName }: ConvertLayer): Promise<btwix.Image[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Image);
    resolve(
      [
        {
          type: 'Image',
          id: sketchLayer.id,
          name: sketchLayer.name,
          parent: parentId,
          masked: parentName === 'btwix.mask',
          frame: {
            x: position.x + (parentFrame.x - (parentFrame.width / 2)),
            y: position.y + (parentFrame.y - (parentFrame.height / 2)),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          transform: {
            rotation: (sketchLayer as srm.Image).transform.rotation * -1,
            verticalFlip: (sketchLayer as srm.Image).transform.flippedVertically,
            horizontalFlip: (sketchLayer as srm.Image).transform.flippedHorizontally
          },
          style: {
            shadow: convertShadow(sketchLayer as srm.Image),
            blendMode: (sketchLayer as srm.Image).style.blendingMode.toLowerCase() as btwix.BlendMode,
            opacity: (sketchLayer as srm.Image).style.opacity
          },
          imageId: (sketchLayer as srm.Image).image.id
        }
      ]
    );
  });
}

export const convertLayer = ({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName, xOffset }: ConvertLayer): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    switch(sketchLayer.type) {
      case 'Artboard': {
        convertArtboard({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName, xOffset }).then((layers) => {
          resolve(layers);
        });
        break;
      }
      case 'Shape': {
        convertShapeGroup({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName, xOffset }).then((layers) => {
          resolve(layers);
        });
        break;
      }
      case 'ShapePath': {
        convertShapePath({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName, xOffset }).then((layers) => {
          resolve(layers);
        });
        break;
      }
      case 'Group': {
        convertGroup({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName, xOffset }).then((layers) => {
          resolve(layers);
        });
        break;
      }
      // case 'Text': {
      //   convertText({ sketchLayer, parentId, parentFrame, images, sketch }).then((layers) => {
      //     resolve(layers);
      //   });
      // }
      //   break;
      case 'Image': {
        convertImage({ sketchLayer, parentId, parentFrame, images, sketch, masked, mask, parentName, xOffset }).then((layers) => {
          resolve(layers);
        });
        break;
      }
      default:
        resolve([]);
        // throw Error(`Unknown layer type ${sketchLayer.type}`);
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
      parentId: 'page',
      parentFrame: {
        width: 0,
        height: 0,
        x: 0,
        y: 0
      },
      parentName: 'page',
      masked: false,
      mask: false,
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