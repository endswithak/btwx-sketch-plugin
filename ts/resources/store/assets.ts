import processImageLayerAssets from './imageAssets';
import processShapeLayerAssets from './shapeAssets';
import processGroupLayerAssets from './groupAssets';
import processTextLayerAssets from './textAssets';

export const bufferToBase64 = (buffer: Buffer | ArrayBuffer) => {
  return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
};

interface TextWithBoundingOpts {
  page: srm.Page;
  layer: srm.Text;
  sketch: srm.Sketch;
}

export const textWithBounding = ({layer, page, sketch}: TextWithBoundingOpts): Promise<srm.Group> => {
  return new Promise((resolve, reject) => {
    const duplicate = layer.duplicate();
    const textGroup: srm.Group = new sketch.Group({
      name: 'text-group',
      parent: page,
    });
    const textGroupBg: srm.ShapePath = new sketch.ShapePath({
      name: 'text-group-bg',
      parent: page
    });
    clearLayerStyles({
      layer: duplicate,
      page: page
    })
    .then(() => {
      duplicate.name = 'text';
      duplicate.style.textColor = '#ffffffff';
      textGroup.frame = duplicate.frame;
      textGroupBg.frame = duplicate.frame;
      textGroupBg.style.fills = [{fillType: 'Color', color: '#ffffffff'}] as srm.Fill[];
      textGroupBg.style.opacity = 0.01;
      textGroup.layers = [textGroupBg, duplicate];
      resolve(textGroup);
    });
  })
}

interface CreateLayerTemplateOptions {
  layer: srm.RelevantLayer;
  page: srm.Page;
  sketch: srm.Sketch;
}

const createLayerTemplate = ({ layer, page, sketch }: CreateLayerTemplateOptions): Promise<srm.RelevantLayer> => {
  return new Promise((resolve, reject) => {
    switch(layer.type) {
      case 'Shape':
      case 'ShapePath': {
        const duplicate: any = layer.duplicate();
        clearLayerStyles({
          layer: duplicate,
          page: page
        })
        .then(() => {
          resolve(duplicate);
        });
        break;
      }
      case 'Image': {
        const imageMock = new sketch.ShapePath({
          frame: layer.frame,
          parent: page
        });
        clearLayerStyles({
          layer: imageMock,
          page: page
        })
        .then(() => {
          resolve(imageMock);
        });
        break;
      }
      case 'Text': {
        textWithBounding({
          layer: layer as srm.Text,
          page: page,
          sketch: sketch
        })
        .then((textGroup) => {
          resolve(textGroup);
        });
        break;
      }
    }
  });
}

interface ClearLayerStylesOptions {
  layer: srm.RelevantLayer;
  page: srm.Page;
}

export const clearLayerStyles = ({ layer, page }: ClearLayerStylesOptions): Promise<srm.RelevantLayer> => {
  return new Promise((resolve, reject) => {
    const { style, transform } = layer;
    if (layer.type === 'Text') {
      style.textColor = '#000000ff';
      layer.sketchObject.setTextBehaviour(0);
    }
    // @ts-ignore
    layer.parent = page;
    style.opacity = 1;
    style.borders = [];
    style.fills = [];
    style.shadows = [];
    style.innerShadows = [];
    style.blur = {
      blurType: 'Gaussian',
      radius: 0,
      motionAngle: 0,
      center: {x: 0, y: 0},
      enabled: false
    };
    transform.flippedHorizontally = false;
    transform.flippedVertically = false;
    transform.rotation = 0;
    resolve(layer);
  });
};

interface GenerateImageAssetOptions {
  layer: srm.SketchLayer;
  sketch: srm.Sketch;
  id: string;
  prefix?: string;
  scale?: string;
}

export const generateImageAsset = ({ layer, sketch, id, prefix, scale }: GenerateImageAssetOptions): Promise<btwx.DocumentImage> => {
  return new Promise((resolve, reject) => {
    const buffer = sketch.export(layer, {
      formats: 'png',
      // scales: '2',
      output: false,
      ['save-for-web']: true
    });
    const bufferImg: srm.Image = new sketch.Image({
      image: buffer
    });
    const base64 = bufferImg.image.nsdata.base64EncodedStringWithOptions(0);
    resolve({
      id: prefix ? `${prefix}${id}` : id,
      base64: `data:image/png;base64, ${base64}`
    });
  })
};

interface CreateFillImageOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  fill: srm.Fill;
  fillIndex: number;
  sketch: srm.Sketch;
}

const createFillImage = ({ page, layer, fill, fillIndex, sketch }: CreateFillImageOptions): Promise<btwx.DocumentImage> => {
  return new Promise((resolve, reject) => {
    let temp: srm.RelevantLayer;
    createLayerTemplate({
      layer: layer,
      page: page,
      sketch: sketch
    })
    .then((layerTemplate) => {
      temp = layerTemplate;
      temp.style.fills = [fill];
      return generateImageAsset({
        layer: temp,
        sketch: sketch,
        id: layer.id,
        prefix: `[fill-${fillIndex}]`
      });
    })
    .then((imageAsset) => {
      temp.remove();
      resolve(imageAsset);
    });
  });
};

interface ProcessLayerFillOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  fill: srm.Fill;
  fillIndex: number;
  sketch: srm.Sketch;
}

const processLayerFill = ({ page, layer, fill, fillIndex, sketch }: ProcessLayerFillOptions): Promise<btwx.DocumentImage | null> => {
  return new Promise((resolve, reject) => {
    switch(fill.fillType) {
      case 'Pattern':
        createFillImage({
          page: page,
          layer: layer,
          fill: fill,
          fillIndex: fillIndex,
          sketch: sketch
        })
        .then((layerImage) => {
          resolve(layerImage);
        });
        break;
      case 'Color':
      case 'Gradient':
        resolve(null);
        break;
    }
  });
};

interface ProcessLayerFillsOptions {
  page: srm.Page;
  layer: srm.Shape | srm.ShapePath | srm.Image | srm.Text;
  sketch: srm.Sketch;
  fills: srm.Fill[];
}

export const processLayerFills = ({ page, layer, sketch, fills }: ProcessLayerFillsOptions): Promise<(btwx.DocumentImage | null)[]> => {
  let promises: Promise<btwx.DocumentImage | null>[] = [];
  fills.forEach((fill: srm.Fill, fillIndex: number) => {
    if (fill.enabled) {
      promises.push(processLayerFill({
        page: page,
        layer: layer,
        fill: fill,
        fillIndex: fillIndex,
        sketch: sketch
      }));
    }
  });
  return Promise.all(promises);
};

interface ProcessLayerOptions {
  page: srm.Page;
  layer: srm.RelevantLayer;
  sketch: srm.Sketch;
}

const processLayer = ({ page, layer, sketch }: ProcessLayerOptions): Promise<{ [id: string]: btwx.DocumentImage; }> => {
  return new Promise((resolve, reject) => {
    let layerImages: { [id: string]: btwx.DocumentImage; } = {};
    switch(layer.type) {
      case 'Image':
        processImageLayerAssets({
          page: page,
          layer: layer as srm.Image,
          sketch: sketch
        })
        .then((imageLayerImages) => {
          layerImages = { ...layerImages, ...imageLayerImages };
        })
        .finally(() => {
          resolve(layerImages);
        });
        break;
      case 'Shape':
      case 'ShapePath':
        processShapeLayerAssets({
          page: page,
          layer: layer as srm.Shape | srm.ShapePath,
          sketch: sketch
        })
        .then((shapeLayerImages) => {
          layerImages = { ...layerImages, ...shapeLayerImages };
        })
        .finally(() => {
          resolve(layerImages);
        });
        break;
      case 'Text':
        processTextLayerAssets({
          page: page,
          layer: layer as srm.Text,
          sketch: sketch
        })
        .then((textLayerImages) => {
          layerImages = { ...layerImages, ...textLayerImages };
        })
        .finally(() => {
          resolve(layerImages);
        });
        break;
      case 'Group':
        processGroupLayerAssets({
          page: page,
          layer: layer as srm.Group,
          sketch: sketch
        })
        .then((groupLayerImages) => {
          layerImages = { ...layerImages, ...groupLayerImages };
        })
        .finally(() => {
          resolve(layerImages);
        });
        break;
      default:
        resolve(layerImages);
    }
  });
};

interface ProcessLayersOptions {
  page: srm.Page;
  layers: srm.RelevantLayer[];
  sketch: srm.Sketch;
}

export const processLayers = ({ page, layers, sketch }: ProcessLayersOptions): Promise<{ [id: string]: btwx.DocumentImage; }> => {
  return new Promise((resolve, reject) => {
    const promises: Promise<{ [id: string]: btwx.DocumentImage; }>[] = [];
    layers.forEach((layer: srm.RelevantLayer) => {
      promises.push(processLayer({
        page: page,
        layer: layer,
        sketch: sketch
      }));
    });
    Promise.all(promises).then((images) => {
      resolve(images.reduce((result, current) => {
        return { ...result, ...current };
      }, {}))
    });
  })
};

interface GetAssetsOptions {
  page: srm.Page;
  artboard: srm.Artboard;
  sketch: srm.Sketch;
}

export const getAssets = ({ page, artboard, sketch }: GetAssetsOptions): Promise<{ [id: string]: btwx.DocumentImage; }> => {
  return new Promise((resolve, reject) => {
    processLayers({
      page: page,
      layers: artboard.layers as srm.RelevantLayer[],
      sketch: sketch
    })
    .then((layerImages) => {
      resolve(layerImages);
    });
  });
};

export default getAssets;