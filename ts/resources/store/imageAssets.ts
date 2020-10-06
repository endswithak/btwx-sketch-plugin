import { generateImageAsset, processLayerFills } from './assets';

interface ProcessLayerImageOptions {
  page: srm.Page;
  layer: srm.Image;
  sketch: srm.Sketch;
}

const processLayerImage = ({ page, layer, sketch }: ProcessLayerImageOptions): Promise<srm.base64Image> => {
  return new Promise((resolve, reject) => {
    // create image layer from image date
    const baseImage = new sketch.Image({
      image: (<srm.Image>layer).image,
      frame: layer.frame,
      parent: page
    });
    generateImageAsset({
      layer: baseImage,
      sketch: sketch,
      id: (<srm.Image>layer).image.id
    })
    .then((imageAsset) => {
      // remove asset artboard from page
      baseImage.remove();
      // return base64 image
      resolve(imageAsset);
    });
  });
};

interface ProcessImageLayerAssetsOpts {
  page: srm.Page;
  layer: srm.Image;
  sketch: srm.Sketch;
}

const processImageLayerAssets = ({ page, layer, sketch }: ProcessImageLayerAssetsOpts): Promise<{ [id: string]: btwix.DocumentImage; }> => {
  return new Promise((resolve, reject) => {
    const { style } = layer;
    const { fills } = style;
    const layerImages: { [id: string]: btwix.DocumentImage; } = {};
    processLayerImage({
      page: page,
      layer: layer as srm.Image,
      sketch: sketch
    })
    .then((layerImage) => {
      layerImages[layerImage.id] = layerImage;
      return processLayerFills({
        page: page,
        layer: layer as srm.Image,
        sketch: sketch,
        fills: fills
      });
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

export default processImageLayerAssets;