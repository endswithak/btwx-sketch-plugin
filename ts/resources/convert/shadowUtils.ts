import { convertColor } from './generalUtils';
import { DEFAULT_SHADOW_STYLE } from './constants';

export const convertShadow = (layer: srm.RelevantLayer): any => {
  const shadow = layer.style.shadows[0];
  if (shadow) {
    return {
      fillType: 'color',
      enabled: shadow.enabled,
      color: convertColor(shadow.color),
      offset: {
        x: shadow.x,
        y: shadow.y
      },
      blur: shadow.blur
    }
  } else {
    if (layer.type === 'Text') {
      return {
        ...DEFAULT_SHADOW_STYLE,
        enabled: false
      }
    } else {
      return DEFAULT_SHADOW_STYLE;
    }
  }
};