import { clearLayerStyles, processLayerFills } from './assets';

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

interface ProcessTextLayerAssetsOpts {
  page: srm.Page;
  layer: srm.Text;
  sketch: srm.Sketch;
}

const processTextLayerAssets = ({ page, layer, sketch }: ProcessTextLayerAssetsOpts): Promise<{ [id: string]: btwx.DocumentImage; }> => {
  return new Promise((resolve, reject) => {
    const { style } = layer;
    const { fills } = style;
    const layerImages: { [id: string]: btwx.DocumentImage; } = {};
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

export default processTextLayerAssets;