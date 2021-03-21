import { convertColor, convertGradientDestination, convertGradientOrigin, convertGradientStops, convertGradientType } from './generalUtils';
import { DEFAULT_FILL_FILL_TYPE, DEFAULT_GRADIENT_STYLE, DEFAULT_FILL_STYLE } from './constants';

export const convertFillType = (sketchFillType: srm.FillType): any => {
  switch(sketchFillType) {
    case 'Color':
      return 'color';
    case 'Gradient':
      return 'gradient';
    // case 4:
    //   return 'pattern';
  }
};

export const convertFill = (layer: srm.RelevantLayer | srm.Artboard): any => {
  if (layer.type === 'Artboard') {
    return {
      enabled: true,
      color: convertColor((layer as srm.Artboard).background.color),
      fillType: DEFAULT_FILL_FILL_TYPE,
      gradient: DEFAULT_GRADIENT_STYLE
    }
  } else {
    const fill = (layer as srm.RelevantLayer).style.fills.find(fill => fill.fillType === 'Color' || fill.fillType === 'Gradient');
    if (!fill) {
      if (layer.type === 'Text') {
        return {
          enabled: true,
          color: convertColor((layer as srm.RelevantLayer).style.textColor),
          fillType: DEFAULT_FILL_FILL_TYPE,
          gradient: DEFAULT_GRADIENT_STYLE
        }
      } else {
        return {
          ...DEFAULT_FILL_STYLE,
          enabled: false
        };
      }
    } else {
      return {
        enabled: fill.enabled,
        color: convertColor(fill.color),
        fillType: convertFillType(fill.fillType),
        gradient: {
          activeStopIndex: 0,
          gradientType: convertGradientType(fill.gradient.gradientType),
          origin: convertGradientOrigin(fill.gradient.from),
          destination: convertGradientDestination(fill.gradient.to),
          stops: convertGradientStops(fill.gradient.stops)
        }
      }
    }
  }
};