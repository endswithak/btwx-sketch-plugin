import { generateImageAsset, processLayerFills } from './assets';

interface ProcessLayerImageOptions {
  page: srm.Page;
  layer: srm.Image;
  sketch: srm.Sketch;
}

const processLayerImage = ({ page, layer, sketch }: ProcessLayerImageOptions): Promise<btwx.DocumentImage> => {
  return new Promise((resolve, reject) => {
    // create image layer from image data
    const imagePage = new sketch.Page({
      parent: page.parent
    });
    const imageWithWhitespace = new sketch.Artboard({
      layers: [
        new sketch.Image({
          image: (<srm.Image>layer).image,
          frame: {
            ...layer.frame,
            x: 0,
            y: 0
          }
        })
      ],
      frame: layer.frame,
      parent: imagePage
    });
    generateImageAsset({
      layer: imageWithWhitespace,
      sketch: sketch,
      id: (<srm.Image>layer).image.id
    })
    .then((imageAsset) => {
      // remove asset artboard from page
      imagePage.remove();
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

const processImageLayerAssets = ({ page, layer, sketch }: ProcessImageLayerAssetsOpts): Promise<{ [id: string]: btwx.DocumentImage; }> => {
  return new Promise((resolve, reject) => {
    const { style } = layer;
    const { fills } = style;
    const layerImages: { [id: string]: btwx.DocumentImage; } = {};
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