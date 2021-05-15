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
      layer.style.paragraphSpacing = 0;
      resolve(layer as srm.RelevantLayer);
    } else {
      resolve(layer as srm.RelevantLayer);
    }
  });
};

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
          const groupIndex = (layerS8 as srm.Group).index;
          (layerS8 as srm.Group).sketchObject.ungroup();
          const newGroup = new sketch.Group({
            name: groupName,
            parent: groupParent,
            layers: (layerS8 as srm.Group).layers
          });
          newGroup.index = groupIndex;
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