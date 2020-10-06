import { convertColor, convertGradientDestination, convertGradientOrigin, convertGradientType, convertGradientStops } from './generalUtils';
import { convertFillType } from './fillUtils';
import { DEFAULT_STROKE_STYLE, DEFAULT_STROKE_OPTIONS_STYLE } from './constants';

export const convertStroke = (layer: srm.RelevantLayer): any => {
  const stroke = layer.style.borders.find(border => border.fillType === 'Color' || border.fillType === 'Gradient');
  if (!stroke) {
    return {
      ...DEFAULT_STROKE_STYLE,
      enabled: false
    }
  } else {
    return {
      enabled: stroke.enabled,
      width: stroke.thickness,
      color: convertColor(stroke.color),
      fillType: convertFillType(stroke.fillType),
      gradient: {
        activeStopIndex: 0,
        gradientType: convertGradientType(stroke.gradient.gradientType),
        origin: convertGradientOrigin(stroke.gradient.from),
        destination: convertGradientDestination(stroke.gradient.to),
        stops: convertGradientStops(stroke.gradient.stops)
      }
    }
  }
};

export const convertStrokeCap = (sketchStrokeCap: srm.LineEnd): string => {
  switch(sketchStrokeCap) {
    case 'Butt':
      return 'butt';
    case 'Round':
      return 'round';
    case 'Projecting':
      return 'square';
  }
};

export const convertStrokeJoin = (sketchStrokeJoin: srm.LineJoin): string => {
  switch(sketchStrokeJoin) {
    case 'Miter':
      return 'miter';
    case 'Round':
      return 'round';
    case 'Bevel':
      return 'bevel';
  }
};

export const convertStrokeDashArray = (sketchStrokeJoin: number[]): number[] => {
  const width = sketchStrokeJoin[0] ? sketchStrokeJoin[0] : 0;
  const gap = sketchStrokeJoin[1] ? sketchStrokeJoin[1] : 0;
  return [width, gap];
};

export const convertStrokeOptions = (layer: srm.RelevantLayer): any => ({
  cap: convertStrokeCap(layer.style.borderOptions.lineEnd),
  join: convertStrokeJoin(layer.style.borderOptions.lineJoin),
  dashArray: convertStrokeDashArray(layer.style.borderOptions.dashPattern),
  dashOffset: 0
});