import { processLayerFills } from './assets';

interface ProcessShapeLayerAssetsOpts {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath;
  sketch: srm.Sketch;
}

const processShapeLayerAssets = ({ page, layer, sketch }: ProcessShapeLayerAssetsOpts): Promise<{ [id: string]: btwix.DocumentImage; }> => {
  return new Promise((resolve, reject) => {
    const { style } = layer;
    const { fills } = style;
    const layerImages: { [id: string]: btwix.DocumentImage; } = {};
    processLayerFills({
      page: page,
      layer: layer,
      sketch: sketch,
      fills: fills
    })
    .then((fillImages) => {
      fillImages.forEach((img) => {
        if (img) {
          layerImages[img.id] = img;
        }
      });
    })
    .finally(() => {
      resolve(layerImages);
    });
  });
};

export default processShapeLayerAssets;