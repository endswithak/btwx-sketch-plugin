import { processLayers } from './assets';

interface ProcessGroupLayerAssetsOpts {
  page: srm.Page;
  layer: srm.Group;
  sketch: srm.Sketch;
}

const processGroupLayerAssets = ({ page, layer, sketch }: ProcessGroupLayerAssetsOpts): Promise<{ [id: string]: btwix.DocumentImage; }> => {
  return new Promise((resolve, reject) => {
    let layerImages: { [id: string]: btwix.DocumentImage; } = {};
    processLayers({
      page: page,
      layers: (layer as srm.Group).layers as srm.RelevantLayer[],
      sketch: sketch
    })
    .then((groupLayerImages) => {
      layerImages = { ...layerImages, ...groupLayerImages };
    })
    .finally(() => {
      resolve(layerImages);
    });
  });
};

export default processGroupLayerAssets;