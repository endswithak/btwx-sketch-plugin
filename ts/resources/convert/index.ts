/* eslint-disable @typescript-eslint/no-use-before-define */
import { convertPosition, convertMask, convertIgnoreUnderlyingMask } from './generalUtils';
import { convertFill } from './fillUtils';
import { convertStroke, convertStrokeOptions } from './strokeUtils';
// import { getImage, getImageId } from './imageUtils';
import { convertShadow } from './shadowUtils';
// import { getShapeGroupChildren } from './shapeGroupUtils';
import { TWEEN_PROPS_MAP, DEFAULT_STROKE_STYLE, DEFAULT_SHADOW_STYLE, DEFAULT_BLUR_STYLE, DEFAULT_STROKE_OPTIONS_STYLE, DEFAULT_BLEND_MODE, DEFAULT_OPACITY, DEFAULT_FILL_STYLE } from './constants';
// import * as textUtils from './textUtils';

interface ConvertLayers {
  sketchLayers: (srm.RelevantLayer | srm.Artboard)[];
  images: {
    [id: string]: btwix.DocumentImage;
  };
  sketch: srm.Sketch;
  artboardItem: any;
  scope: string[];
}

export const convertLayers = ({ sketchLayers, images, sketch, artboardItem, scope }: ConvertLayers): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    let layers: btwix.Layer[] = [];
    let masked = false;
    let underlyingMask: any = null;
    let xOffset = 0;
    const promises: Promise<btwix.Layer[]>[] = [];
    sketchLayers.forEach((sketchLayer, index) => {
      promises.push(convertLayer({sketchLayer, images, sketch, masked, underlyingMask, artboardItem, scope, xOffset}));
      if (sketchLayer.type === 'Artboard') {
        xOffset += (sketchLayer.frame.width + ((index + 1) * 100));
      }
      if (convertMask(sketchLayer as any)) {
        underlyingMask = sketchLayer.id;
        masked = true;
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
  masked: boolean;
  underlyingMask: string;
  artboardItem: any;
  scope: string[];
  xOffset?: number;
}

export const convertArtboard = ({ sketchLayer, images, sketch, masked, underlyingMask, artboardItem, scope, xOffset }: ConvertLayer): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    const ignoreUnderlyingMask = convertIgnoreUnderlyingMask(sketchLayer as any);
    const item = {
      type: 'Artboard',
      id: sketchLayer.id,
      name: sketchLayer.name,
      artboard: sketchLayer.id,
      parent: 'root',
      children: (sketchLayer as srm.Artboard).layers.map((layer) => {
        return layer.id
      }),
      scope: ['root'],
      frame: {
        x: xOffset,
        y: 0,
        width: sketchLayer.frame.width,
        height: sketchLayer.frame.height,
        innerWidth: sketchLayer.frame.width,
        innerHeight: sketchLayer.frame.height
      },
      underlyingMask: null,
      ignoreUnderlyingMask: null,
      masked: false,
      showChildren: false,
      selected: false,
      hover: false,
      events: [],
      originArtboardForEvents: [],
      destinationArtboardForEvents: [],
      tweens: {
        allIds: [],
        asOrigin: [],
        asDestination: [],
        byProp: TWEEN_PROPS_MAP
      },
      style: {
        fill: convertFill(sketchLayer as srm.Artboard),
        stroke: {
          ...DEFAULT_STROKE_STYLE,
          enabled: false
        },
        shadow: {
          ...DEFAULT_SHADOW_STYLE,
          enabled: false
        },
        strokeOptions: DEFAULT_STROKE_OPTIONS_STYLE,
        blendMode: DEFAULT_BLEND_MODE,
        opacity: DEFAULT_OPACITY,
        blur: {
          ...DEFAULT_BLUR_STYLE,
          enabled: false
        }
      },
      transform: {
        rotation: 0,
        verticalFlip: false,
        horizontalFlip: false
      }
    };
    convertLayers({
      sketchLayers: (sketchLayer as srm.Artboard).layers as srm.RelevantLayer[],
      artboardItem: item,
      scope: ['root', (sketchLayer as srm.Artboard).id],
      images,
      sketch
    }).then((layers) => {
      resolve(
        [
          item,
          ...layers
        ] as btwix.Layer[]
      );
    });
  });
}

// export const convertShapeGroup = ({ sketchLayer, images, sketch, masked, underlyingMask, artboardItem, scope }: ConvertLayer): Promise<btwix.Shape[]> => {
//   return new Promise((resolve, reject) => {
//     const position = convertPosition(sketchLayer as srm.Shape);
//     const ignoreUnderlyingMask = convertIgnoreUnderlyingMask(sketchLayer as srm.Shape);
//     const isMask = convertMask(sketchLayer as srm.Shape);
//     resolve(
//       [
//         {
//           id: sketchLayer.id,
//           type: 'Shape',
//           shapeType: 'Custom',
//           name: sketchLayer.name,
//           artboard: artboardItem.id,
//           parent: sketchLayer.parent.id,
//           scope: scope,
//           ignoreUnderlyingMask: ignoreUnderlyingMask,
//           underlyingMask: underlyingMask,
//           masked: masked && !ignoreUnderlyingMask && underlyingMask !== sketchLayer.id,
//           mask: isMask,
//           selected: false,
//           hover: false,
//           events: [],
//           tweens: {
//             allIds: [],
//             asOrigin: [],
//             asDestination: [],
//             byProp: TWEEN_PROPS_MAP
//           },
//           frame: {
//             x: position.x - artboardItem.frame.x,
//             y: position.y - artboardItem.frame.y,
//             width: sketchLayer.frame.width,
//             height: sketchLayer.frame.height,
//             innerWidth: sketchLayer.frame.width,
//             innerHeight: sketchLayer.frame.height
//           },
//           style: {
//             fill: convertFill(sketchLayer as srm.Shape),
//             stroke: convertStroke(sketchLayer as srm.Shape),
//             strokeOptions: convertStrokeOptions(sketchLayer as srm.Shape),
//             shadow: convertShadow(sketchLayer as srm.Shape),
//             blendMode: (sketchLayer as srm.Shape).style.blendingMode.toLowerCase() as btwix.BlendMode,
//             opacity: (sketchLayer as srm.Shape).style.opacity,
//             blur: {
//               enabled: (sketchLayer as srm.Shape).style.blur.enabled && (sketchLayer as srm.Shape).style.blur.blurType === 'Gaussian',
//               blur: (sketchLayer as srm.Shape).style.blur.radius
//             }
//           },
//           transform: {
//             rotation: (sketchLayer as srm.Shape).transform.rotation,
//             verticalFlip: (sketchLayer as srm.Shape).transform.flippedVertically,
//             horizontalFlip: (sketchLayer as srm.Shape).transform.flippedHorizontally
//           },
//           sketchLayer: {
//             ...sketchLayer.toJSON(),
//             layers: getShapeGroupChildren(sketchLayer as srm.Shape)
//           }
//         } as any
//       ]
//     );
//   });
// }

export const convertShapePath = ({ sketchLayer, images, sketch, masked, underlyingMask, artboardItem, scope }: ConvertLayer): Promise<btwix.Shape[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.ShapePath);
    const ignoreUnderlyingMask = convertIgnoreUnderlyingMask(sketchLayer as srm.ShapePath);
    const isMask = convertMask(sketchLayer as srm.ShapePath);
    resolve(
      [
        {
          type: 'Shape',
          id: sketchLayer.id,
          name: sketchLayer.name,
          artboard: artboardItem.id,
          parent: sketchLayer.parent.id,
          children: null,
          scope: scope,
          frame: {
            x: position.x - (artboardItem.frame.width / 2),
            y: position.y - (artboardItem.frame.height / 2),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          underlyingMask: underlyingMask,
          ignoreUnderlyingMask: ignoreUnderlyingMask,
          masked: masked && !ignoreUnderlyingMask && underlyingMask !== sketchLayer.id,
          mask: isMask,
          showChildren: false,
          selected: false,
          hover: false,
          events: [],
          tweens: {
            allIds: [],
            asOrigin: [],
            asDestination: [],
            byProp: TWEEN_PROPS_MAP
          },
          style: {
            fill: convertFill(sketchLayer as srm.ShapePath),
            stroke: convertStroke(sketchLayer as srm.ShapePath),
            strokeOptions: convertStrokeOptions(sketchLayer as srm.ShapePath),
            shadow: convertShadow(sketchLayer as srm.ShapePath),
            blendMode: (sketchLayer as srm.ShapePath).style.blendingMode.toLowerCase() as btwix.BlendMode,
            opacity: (sketchLayer as srm.ShapePath).style.opacity,
            blur: {
              enabled: (sketchLayer as srm.ShapePath).style.blur.enabled && (sketchLayer as srm.ShapePath).style.blur.blurType === 'Gaussian',
              blur: (sketchLayer as srm.ShapePath).style.blur.radius
            }
          },
          transform: {
            rotation: (sketchLayer as srm.ShapePath).transform.rotation * -1,
            verticalFlip: (sketchLayer as srm.ShapePath).transform.flippedVertically,
            horizontalFlip: (sketchLayer as srm.ShapePath).transform.flippedHorizontally
          },
          shapeType: 'Custom',
          pathData: (sketchLayer as srm.ShapePath).getSVGPath(),
          closed: (sketchLayer as srm.ShapePath).closed
        } as any
      ]
    );
  });
}

export const convertGroup = ({ sketchLayer, images, sketch, masked, underlyingMask, artboardItem, scope }: ConvertLayer): Promise<btwix.Layer[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Group);
    const ignoreUnderlyingMask = convertIgnoreUnderlyingMask(sketchLayer as srm.Group);
    convertLayers({
      sketchLayers: (sketchLayer as srm.Group).layers as srm.RelevantLayer[],
      artboardItem: artboardItem,
      scope: [...scope, (sketchLayer as srm.Group).id],
      images,
      sketch
    }).then((layers) => {
      resolve(
        [
          {
            type: 'Group',
            id: sketchLayer.id,
            name: sketchLayer.name,
            artboard: artboardItem.id,
            parent: sketchLayer.parent.id,
            children: (sketchLayer as srm.Group).layers.map((layer) => {
              return layer.id
            }),
            scope: scope,
            frame: {
              x: position.x - (artboardItem.frame.width / 2),
              y: position.y - (artboardItem.frame.height / 2),
              width: sketchLayer.frame.width,
              height: sketchLayer.frame.height,
              innerWidth: sketchLayer.frame.width,
              innerHeight: sketchLayer.frame.height
            },
            underlyingMask: underlyingMask,
            ignoreUnderlyingMask: ignoreUnderlyingMask,
            masked: masked && !ignoreUnderlyingMask,
            showChildren: false,
            selected: false,
            hover: false,
            events: [],
            tweens: {
              allIds: [],
              asOrigin: [],
              asDestination: [],
              byProp: TWEEN_PROPS_MAP
            },
            style: {
              fill: {
                ...DEFAULT_FILL_STYLE,
                enabled: false
              },
              stroke: {
                ...DEFAULT_STROKE_STYLE,
                enabled: false
              },
              shadow: {
                ...DEFAULT_SHADOW_STYLE,
                enabled: false
              },
              strokeOptions: DEFAULT_STROKE_OPTIONS_STYLE,
              blendMode: DEFAULT_BLEND_MODE,
              opacity: DEFAULT_OPACITY,
              blur: {
                ...DEFAULT_BLUR_STYLE,
                enabled: false
              }
            },
            transform: {
              rotation: 0,
              verticalFlip: false,
              horizontalFlip: false
            }
          } as any,
          ...layers
        ] as btwix.Layer[]
      );
    });
  });
}

export const convertText = ({ sketchLayer, images, sketch, masked, underlyingMask, artboardItem, scope }: ConvertLayer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Text);
    const ignoreUnderlyingMask = convertIgnoreUnderlyingMask(sketchLayer as srm.Text);
    const sketchRatio = (sketchLayer as srm.Text).style.fontWeight / 12;
    const domScale = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    const fontWeight = domScale[Math.floor(sketchRatio * domScale.length)];
    const point = (() => {
      const firstLine = (sketchLayer as srm.Text).fragments[0];
      const y = (((sketchLayer as srm.Text).frame.y + firstLine.rect.y + firstLine.rect.height) - firstLine.baselineOffset) - (artboardItem.frame.height / 2);
      switch((sketchLayer as srm.Text).style.alignment) {
        case 'justified':
        case 'left':
          return {
            x: Math.round(((sketchLayer as srm.Text).frame.x + firstLine.rect.x) - (artboardItem.frame.width / 2)),
            y: y
          }
        case 'center':
          return {
            x: position.x - (artboardItem.frame.width / 2),
            y: y
          }
        case 'right':
          return {
            x: Math.round(((sketchLayer as srm.Text).frame.x + (sketchLayer as srm.Text).frame.width) - (artboardItem.frame.width / 2)),
            y: y
          }
      }
    })();
    resolve(
      [
        {
          type: 'Text',
          id: sketchLayer.id,
          name: sketchLayer.name,
          artboard: artboardItem.id,
          parent: sketchLayer.parent.id,
          children: null,
          scope: scope,
          frame: {
            x: position.x - (artboardItem.frame.width / 2),
            y: position.y - (artboardItem.frame.height / 2),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          underlyingMask: underlyingMask,
          ignoreUnderlyingMask: ignoreUnderlyingMask,
          masked: masked && !ignoreUnderlyingMask,
          showChildren: false,
          selected: false,
          hover: false,
          events: [],
          tweens: {
            allIds: [],
            asOrigin: [],
            asDestination: [],
            byProp: TWEEN_PROPS_MAP
          },
          style: {
            fill: convertFill(sketchLayer as srm.Text),
            stroke: convertStroke(sketchLayer as srm.Text),
            strokeOptions: convertStrokeOptions(sketchLayer as srm.Text),
            shadow: convertShadow(sketchLayer as srm.Text),
            blendMode: (sketchLayer as srm.Text).style.blendingMode.toLowerCase() as btwix.BlendMode,
            opacity: (sketchLayer as srm.Text).style.opacity,
            blur: {
              enabled: (sketchLayer as srm.Text).style.blur.enabled && (sketchLayer as srm.Text).style.blur.blurType === 'Gaussian',
              blur: (sketchLayer as srm.Text).style.blur.radius
            }
          },
          textStyle: {
            fontSize: (sketchLayer as srm.Text).style.fontSize,
            leading: (sketchLayer as srm.Text).style.lineHeight,
            fontWeight: fontWeight,
            fontFamily: (sketchLayer as srm.Text).style.fontFamily,
            justification: (sketchLayer as srm.Text).style.alignment === 'justified' ? 'left' : (sketchLayer as srm.Text).style.alignment,
            letterSpacing: (sketchLayer as srm.Text).style.kerning,
            textTransform: (sketchLayer as srm.Text).style.textTransform,
            oblique:(sketchLayer as srm.Text).style.fontStyle === 'italic' ? 14 : 0,
          },
          transform: {
            rotation: (sketchLayer as srm.Text).transform.rotation * -1,
            verticalFlip: (sketchLayer as srm.Text).transform.flippedVertically,
            horizontalFlip: (sketchLayer as srm.Text).transform.flippedHorizontally
          },
          point: point,
          text: (sketchLayer as srm.Text).fragments.reduce((result, current, index) => {
            const prevFrage = (sketchLayer as srm.Text).fragments[index === 0 ? 0 : index - 1];
            result = result + current.text;
            if (index < (sketchLayer as srm.Text).fragments.length - 1 && !prevFrage.text.includes(`\n`)) {
              result = result + `\n`;
            }
            return result;
          }, ''),
          lines: (sketchLayer as srm.Text).fragments.map((fragment) => ({
            text: fragment.text,
            width: Math.round(fragment.rect.width)
          }))
        }
      ]
    );
  });
}

export const convertImage = ({ sketchLayer, images, sketch, masked, underlyingMask, artboardItem, scope }: ConvertLayer): Promise<btwix.Image[]> => {
  return new Promise((resolve, reject) => {
    const position = convertPosition(sketchLayer as srm.Image);
    const ignoreUnderlyingMask = convertIgnoreUnderlyingMask(sketchLayer as srm.Image);
    resolve(
      [
        {
          type: 'Image',
          id: sketchLayer.id,
          name: sketchLayer.name,
          artboard: artboardItem.id,
          parent: sketchLayer.parent.id,
          children: null,
          scope: scope,
          frame: {
            x: position.x - (artboardItem.frame.width / 2),
            y: position.y - (artboardItem.frame.height / 2),
            width: sketchLayer.frame.width,
            height: sketchLayer.frame.height,
            innerWidth: sketchLayer.frame.width,
            innerHeight: sketchLayer.frame.height
          },
          underlyingMask: underlyingMask,
          ignoreUnderlyingMask: ignoreUnderlyingMask,
          masked: masked && !ignoreUnderlyingMask,
          showChildren: false,
          selected: false,
          hover: false,
          events: [],
          tweens: {
            allIds: [],
            asOrigin: [],
            asDestination: [],
            byProp: TWEEN_PROPS_MAP
          },
          style: {
            fill: {
              ...DEFAULT_FILL_STYLE,
              enabled: false
            },
            stroke: convertStroke(sketchLayer as srm.Image),
            strokeOptions: convertStrokeOptions(sketchLayer as srm.Image),
            shadow: convertShadow(sketchLayer as srm.Image),
            blendMode: (sketchLayer as srm.Image).style.blendingMode.toLowerCase() as btwix.BlendMode,
            opacity: (sketchLayer as srm.Image).style.opacity,
            blur: {
              enabled: (sketchLayer as srm.Image).style.blur.enabled && (sketchLayer as srm.Image).style.blur.blurType === 'Gaussian',
              blur: (sketchLayer as srm.Image).style.blur.radius
            }
          },
          transform: {
            rotation: (sketchLayer as srm.Image).transform.rotation * -1,
            verticalFlip: (sketchLayer as srm.Image).transform.flippedVertically,
            horizontalFlip: (sketchLayer as srm.Image).transform.flippedHorizontally
          },
          imageId: (sketchLayer as srm.Image).image.id,
          originalDimensions: {
            width: (sketchLayer as srm.Image).frame.width,
            height: (sketchLayer as srm.Image).frame.height
          }
        } as any
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
      // case 'Shape': {
      //   convertShapeGroup(props).then((layers) => {
      //     resolve(layers);
      //   });
      //   break;
      // }
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
      artboardItem: null,
      scope: [],
      images,
      sketch
    }).then((btwixLayers) => {
      const convertedLayers = btwixLayers.reduce((result: btwix.ClipboardLayers, current) => {
        result.allIds = [...result.allIds, current.id];
        result.compiledIds = [...result.compiledIds, current.id];
        result.byId = { ...result.byId, [current.id]: current };
        switch(current.type) {
          case 'Artboard':
            result.allArtboardIds = [...result.allArtboardIds, current.id];
            result.main = [...result.main, current.id];
            break;
          case 'Group':
            result.allGroupIds = [...result.allGroupIds, current.id];
            break;
          case 'Image':
            result.allImageIds = [...result.allImageIds, current.id];
            result.compiledIds = [...result.compiledIds, (current as btwix.Image).imageId];
            break;
          case 'Shape':
            result.allShapeIds = [...result.allShapeIds, current.id];
            result.shapeIcons = { ...result.shapeIcons, [current.id]: (current as btwix.Shape).pathData };
            break;
          case 'Text':
            result.allTextIds = [...result.allTextIds, current.id];
            break;
        }
        return result;
      }, {
        type: 'layers',
        main: [],
        compiledIds: [],
        events: { allIds: [], byId: {} },
        tweens: { allIds: [], byId: {} },
        topScopeChildren: [],
        topScopeArtboards: { allIds: [], byId: {} },
        allIds: [],
        allArtboardIds: [],
        allGroupIds: [],
        allShapeIds: [],
        allTextIds: [],
        allImageIds: [],
        byId: {},
        shapeIcons: {},
        images: images,
        bounds: {}
      });
      convertedLayers.bounds = convertedLayers.allArtboardIds.reduce((result, current, index) => {
        const artboardItem = convertedLayers.byId[current] as btwix.Artboard;
        if (artboardItem.frame.height > result.height) {
          result.height = artboardItem.frame.height;
        }
        result.width += (artboardItem.frame.width + (index !== convertedLayers.allArtboardIds.length - 1 ? 100 : 0));
        if (index === convertedLayers.allArtboardIds.length - 1) {
          result.x = (result.width / 2) - convertedLayers.byId[convertedLayers.allArtboardIds[0]].frame.width / 2;
        }
        return result;
      }, {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      });
      resolve(convertedLayers);
    });
  })
}

export default convert;