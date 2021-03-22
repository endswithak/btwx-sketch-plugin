// interface CheckIfMaskOptions {
//   layer: srm.RelevantLayer | null;
//   sketch: srm.Sketch;
// }

// const checkIfMask = ({ layer, sketch }: CheckIfMaskOptions): Promise<srm.RelevantLayer | null> => {
//   return new Promise((resolve, reject) => {
//     if (layer && layer.sketchObject.hasClippingMask()) {
//       const maskIndex = layer.index;
//       const maskParent = layer.parent;
//       const duplicate = layer.duplicate();
//       duplicate.sketchObject.setHasClippingMask(false);
//       // create new group to mimic mask behavior
//       const maskGroup = new sketch.Group({
//         name: 'btwix.mask',
//         frame: layer.frame,
//         layers: [duplicate]
//       });
//       // splice in mask group, splice out old mask
//       maskParent.layers.splice(maskIndex, 1, maskGroup);
//       // loop through mask parent layers,
//       // any layer with an index higher than the mask will be masked
//       // push masked layers to maskGroup
//       maskGroup.parent.layers.forEach((maskedLayer: srm.SketchLayer, index: number) => {
//         if (index > maskIndex) {
//           maskedLayer.frame.x = maskedLayer.frame.x - maskGroup.frame.x;
//           maskedLayer.frame.y = maskedLayer.frame.y - maskGroup.frame.y;
//           maskGroup.layers.push(maskedLayer);
//         }
//       });
//       resolve(maskGroup);
//     } else {
//       resolve(layer);
//     }
//   });
// };

// interface CheckIfShapePathOptions {
//   layer: srm.RelevantLayer | null;
//   sketch: srm.Sketch;
// }

// const checkIfShapePath = ({ layer, sketch }: CheckIfShapePathOptions): Promise<srm.RelevantLayer | null> => {
//   return new Promise((resolve, reject) => {
//     if (layer && layer.type === 'ShapePath') {
//       const duplicate = layer.duplicate();
//       duplicate.transform.rotation = 0;
//       const svgPath = (duplicate as srm.ShapePath).getSVGPath();
//       const flatPath = sketch.ShapePath.fromSVGPath(svgPath);
//       (layer as srm.ShapePath).points = flatPath.points;
//       duplicate.remove();
//     }
//     resolve(layer);
//   });
// };

// interface CheckIfShapeOptions {
//   layer: srm.RelevantLayer | null;
//   sketch: srm.Sketch;
//   page: srm.Page;
// }

// const checkIfShape = ({ layer, sketch, page }: CheckIfShapeOptions): Promise<srm.RelevantLayer | null> => {
//   return new Promise((resolve, reject) => {
//     if (layer && layer.type === 'Shape') {
//       const promises: Promise<any>[] = [];
//       if (layer.sketchObject.canFlatten()) {
//         layer.sketchObject.flatten();
//       }
//       (layer as srm.Shape).layers.forEach((child) => {
//         switch(child.type) {
//           case 'Shape':
//             promises.push(checkIfShape({layer: child, sketch, page}));
//           case 'ShapePath':
//             promises.push(checkIfShapePath({layer: child, sketch}));
//             break;
//         }
//       });
//       if (promises.length > 0) {
//         Promise.all(promises).then(() => {
//           resolve(layer);
//         });
//       } else {
//         resolve(layer);
//       }
//     } else {
//       resolve(layer);
//     }
//   });
// };

interface CheckIfShapeOptions {
  layer: srm.RelevantLayer | null;
  sketch: srm.Sketch;
  page: srm.Page;
}

const checkIfShape = ({ layer, sketch, page }: CheckIfShapeOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.type === 'Shape') {
      if (layer.sketchObject.canFlatten()) {
        layer.sketchObject.flatten();
      }
      // const duplicate = layer.duplicate();
      // duplicate.parent = page;
      // duplicate.style.blur = {type: 'Gaussian', enabled: false};
      // duplicate.style.opacity = 1;
      // duplicate.style.shadows = [];
      // duplicate.style.innerShadows = [];
      // duplicate.style.borders = [];
      // duplicate.style.fills = [];
      // const buffer = sketch.export(duplicate, {
      //   formats: 'svg',
      //   output: false
      // });
      // const flatShapeGroup = sketch.createLayerFromData(buffer, 'svg');
      // const flatShape = flatShapeGroup.layers[0];
      // flatShape.frame = layer.frame;
      // flatShape.style = layer.style;
      // layer.parent.layers.splice(layer.index, 1, flatShape);
      // duplicate.remove();
    }
    resolve(layer);
  });
};

interface CheckIfRelevantOptions {
  layer: srm.ArtboardLayer;
}

const checkIfRelevant = ({ layer }: CheckIfRelevantOptions): Promise<srm.RelevantLayer | srm.SymbolInstance | null> => {
  return new Promise((resolve, reject) => {
    switch(layer.type) {
      case 'Group':
      case 'Shape':
      case 'Image':
      case 'ShapePath':
      case 'Text':
      case 'SymbolInstance':
        resolve(layer as srm.RelevantLayer | srm.SymbolInstance);
        break;
      case 'HotSpot':
      case 'Slice':
        layer.remove();
        resolve(null);
        break;
    }
  });
};

interface CheckIfHiddenOptions {
  layer: srm.RelevantLayer | srm.SymbolInstance | null;
}

const checkIfHidden = ({ layer }: CheckIfHiddenOptions): Promise<srm.RelevantLayer | srm.SymbolInstance | null> => {
  return new Promise((resolve, reject) => {
    const isHidden = layer && (<srm.RelevantLayer | srm.SymbolInstance>layer).hidden;
    if (isHidden) {
      (layer as srm.RelevantLayer | srm.SymbolInstance).remove();
      resolve(null);
    } else {
      resolve(layer);
    }
  });
};

interface CheckIfSymbolOptions {
  layer: srm.RelevantLayer | srm.SymbolInstance | null;
}

const checkIfSymbol = ({ layer }: CheckIfSymbolOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.type === 'SymbolInstance') {
      const detachedSymbol = (<srm.SymbolInstance>layer).detach({
        recursively: true
      });
      if ((detachedSymbol as srm.Group).layers.length === 0) {
        (detachedSymbol as srm.Group).remove();
        resolve(null);
      } else {
        resolve(detachedSymbol);
      }
    } else {
      resolve(layer as srm.RelevantLayer);
    }
  });
};

interface CheckIfTextOptions {
  layer: srm.RelevantLayer | null;
}

const checkIfText = ({ layer }: CheckIfTextOptions): Promise<srm.RelevantLayer | null> => {
  return new Promise((resolve, reject) => {
    if (layer && layer.type === 'Text') {
      if (!layer.style.lineHeight) {
        // @ts-ignore
        layer.style.lineHeight = layer.style.getDefaultLineHeight();
      }
      (layer as any).adjustToFit();
      // layer.sketchObject.adjustFrameToFit();
      resolve(layer as srm.RelevantLayer);
    } else {
      resolve(layer as srm.RelevantLayer);
    }
  });
};

// interface RoundFrameDimensionsOptions {
//   layer: srm.RelevantLayer | null;
// }

// const roundFrameDimensions = ({ layer }: RoundFrameDimensionsOptions): Promise<srm.RelevantLayer | null> => {
//   return new Promise((resolve, reject) => {
//     if (layer) {
//       layer.frame.x = parseInt(layer.frame.x.toFixed(2));
//       layer.frame.y = parseInt(layer.frame.y.toFixed(2));
//       layer.frame.width = parseInt(layer.frame.width.toFixed(2));
//       layer.frame.height = parseInt(layer.frame.height.toFixed(2));
//     }
//     resolve(layer);
//   });
// };

interface ProcessLayerOptions {
  layer: srm.ArtboardLayer;
  sketch: srm.Sketch;
  page: srm.Page;
}

const processLayer = ({ layer, sketch, page }: ProcessLayerOptions): Promise<srm.RelevantLayer> => {
  return new Promise((resolve, reject) => {
    checkIfRelevant({
      layer: layer
    })
    .then((layerS1) => {
      return checkIfHidden({
        layer: layerS1 as srm.RelevantLayer | srm.SymbolInstance | null
      });
    })
    // .then((layerS3) => {
    //   return checkIfMask({
    //     layer: layerS3 as srm.RelevantLayer | null,
    //     sketch: sketch
    //   });
    // })
    // .then((layerS4) => {
    //   return checkIfShapePath({
    //     layer: layerS4 as srm.RelevantLayer | null,
    //     sketch: sketch
    //   });
    // })
    .then((layerS5) => {
      return checkIfShape({
        layer: layerS5 as srm.RelevantLayer | null,
        sketch: sketch,
        page: page
      });
    })
    .then((layerS6) => {
      return checkIfText({
        layer: layerS6 as srm.RelevantLayer | null
      });
    })
    // .then((layerS7) => {
    //   return roundFrameDimensions({
    //     layer: layerS7 as srm.RelevantLayer | null
    //   });
    // })
    .then((layerS2) => {
      return checkIfSymbol({
        layer: layerS2 as srm.RelevantLayer | null
      });
    })
    .then((layerS8) => {
      if (layerS8 && layerS8.type === 'Group') {
        if ((layerS8 as srm.Group).layers.length === 0) {
          (layerS8 as srm.Group).remove();
          resolve();
        } else {
          const groupParent = (layerS8 as srm.Group).parent;
          const groupName = (layerS8 as srm.Group).name;
          (layerS8 as srm.Group).sketchObject.ungroup();
          const newGroup = new sketch.Group({
            name: groupName,
            parent: groupParent,
            layers: (layerS8 as srm.Group).layers
          });
          processLayers({
            layers: (layerS8 as srm.Group).layers,
            sketch: sketch,
            page: page
          })
          .then(() => {
            if (newGroup.layers.length === 0) {
              (newGroup as srm.Group).remove();
            }
            resolve();
          });
        }
      } else {
        resolve();
      }
    });
  });
};

interface ProcessLayersOptions {
  layers: srm.ArtboardLayer[];
  sketch: srm.Sketch;
  page: srm.Page;
}

const processLayers = ({ layers, sketch, page }: ProcessLayersOptions): Promise<srm.RelevantLayer[]> => {
  const promises: Promise<srm.RelevantLayer>[] = [];
  layers.forEach((layer: srm.ArtboardLayer) => {
    promises.push(processLayer({
      layer: layer,
      sketch: sketch,
      page: page
    }));
  });
  return Promise.all(promises);
};

interface GetArtboardOptions {
  artboard: srm.Artboard;
  sketch: srm.Sketch;
  page: srm.Page;
}

const getArtboard = ({ artboard, sketch, page }: GetArtboardOptions): Promise<srm.Artboard> => {
  return new Promise((resolve, reject) => {
    processLayers({
      layers: artboard.layers,
      sketch: sketch,
      page: page
    })
    .then(() => {
      resolve();
    });
  });
};

export default getArtboard;