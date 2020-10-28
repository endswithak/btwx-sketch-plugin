import tinyColor from 'tinycolor2';

export const convertWindingRule = (windingRule: number): any => {
  switch(windingRule) {
    case 0:
      return 'nonzero';
    case 1:
      return 'evenodd';
  }
};

export const convertBooleanOperation = (operation: number): any => {
  switch(operation) {
    case -1:
      return 'exclude';
    case 0:
      return 'unite';
    case 1:
      return 'subtract';
    case 2:
      return 'intersect';
    case 3:
      return 'exclude';
  }
};

export const convertPosition = (layer: srm.RelevantLayer): srm.Point => ({
  x: layer.frame.x + (layer.frame.width / 2),
  y: layer.frame.y + (layer.frame.height / 2)
});

export const convertMask = (layer: srm.RelevantLayer): boolean => {
  const isMask = layer.sketchObject.hasClippingMask();
  switch(isMask) {
    case 0:
      return false;
    case 1:
      return true;
    default:
      return false;
  }
};

export const convertIgnoreUnderlyingMask = (layer: srm.RelevantLayer): boolean => {
  const isMask = layer.sketchObject.shouldBreakMaskChain();
  switch(isMask) {
    case 0:
      return false;
    case 1:
      return true;
    default:
      return false;
  }
};

export const convertColor = (sketchColor: string): any => {
  const color = tinyColor(sketchColor);
  const hsl = color.toHsl();
  const hsv = color.toHsv();
  return {
    h: hsl.h,
    s: hsl.s,
    l: hsl.l,
    v: hsv.v,
    a: hsl.a
  }
};

export const convertGradientOrigin = (sketchGradientOrigin: srm.Point): srm.Point => {
  return {
    x: sketchGradientOrigin.x - 0.5,
    y: sketchGradientOrigin.y - 0.5
  }
};

export const convertGradientDestination = (sketchGradientDestination: srm.Point): srm.Point => {
  return {
    x: sketchGradientDestination.x - 0.5,
    y: sketchGradientDestination.y - 0.5
  }
};

export const convertGradientType = (sketchGradientType: srm.GradientType): string => {
  switch(sketchGradientType) {
    case 'Angular':
    case 'Linear':
      return 'linear';
    case 'Radial':
      return 'radial';
  }
};

export const convertGradientStops = (sketchGradientStops: any): btwix.GradientStop[] => {
  return sketchGradientStops.reduce((result: btwix.GradientStop[], current: any) => {
    result = [...result, {
      position: current.position,
      color: convertColor(current.color)
    }];
    return result;
  }, []);
};