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

export const getShapeGroupChildren = (shapeGroup: srm.Shape) => {
  return shapeGroup.layers.reduce((result: any[], child: srm.Shape | srm.ShapePath) => {
    switch(child.type) {
      case 'ShapePath':
        result = [
          ...result,
          {
            ...child.toJSON(),
            pathData: (child as srm.ShapePath).getSVGPath(),
            booleanOperation: convertBooleanOperation(child.sketchObject.booleanOperation())
          }
        ];
        break;
      case 'Shape':
        result = [
          ...result,
          {
            ...child.toJSON(),
            layers: getShapeGroupChildren(child as srm.Shape),
            booleanOperation: convertBooleanOperation(child.sketchObject.booleanOperation())
          }
        ];
        break;
    }
    return result;
  }, []);
}