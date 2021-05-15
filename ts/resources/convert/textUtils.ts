
interface GetTextPoint {
  sketchLayer: srm.Text;
  artboardItem: btwix.Artboard;
}

export const getTextPoint = ({sketchLayer, artboardItem}: GetTextPoint) => {
  const current = (sketchLayer as srm.Text).fragments[0];
  const y = (((sketchLayer as srm.Text).frame.y + current.rect.y + current.rect.height) - current.baselineOffset) - (artboardItem.frame.height / 2);
  // const y = ((((sketchLayer as srm.Text).frame.y + current.rect.y + current.rect.height) - current.baselineOffset) - (artboardItem.frame.height / 2) - (0.25 * (sketchLayer as srm.Text).style.lineHeight as number));
  switch((sketchLayer as srm.Text).style.alignment) {
    case 'justified':
    case 'left':
      return {
        x: ((sketchLayer as srm.Text).frame.x + current.rect.x) - (artboardItem.frame.width / 2),
        y: y
      }
    case 'center':
      return {
        x: ((sketchLayer as srm.Text).frame.x + ((sketchLayer as srm.Text).frame.width / 2)) - (artboardItem.frame.width / 2),
        y: y
      }
    case 'right':
      return {
        x: ((sketchLayer as srm.Text).frame.x + (sketchLayer as srm.Text).frame.width) - (artboardItem.frame.width / 2),
        y: y
      }
  }
}

interface GetTextLines {
  sketchLayer: srm.Text;
  artboardItem: btwix.Artboard;
}

export const getTextLines = ({sketchLayer, artboardItem}: GetTextLines) => {
  const point = getTextPoint({sketchLayer, artboardItem});
  const lineHeight = (sketchLayer as srm.Text).style.lineHeight as number;
  // const current = (sketchLayer as srm.Text).fragments[0];
  // const pointY = (((sketchLayer as srm.Text).frame.y + current.rect.y + current.rect.height) - current.baselineOffset) - (artboardItem.frame.height / 2);
  const initialLineBottom = point.y + (0.25 * lineHeight);
  const initialLineY = initialLineBottom - (lineHeight / 2);
  return (sketchLayer as srm.Text).fragments.reduce((result, current, index) => {
    result = [...result, {
      text: current.text,
      frame: {
        x: ((sketchLayer as srm.Text).frame.x + current.rect.x + (current.rect.width / 2)) - (artboardItem.frame.width / 2),
        y: initialLineY + (lineHeight * index),
        width: current.rect.width,
        height: lineHeight
      },
      anchor: {
        x: point.x,
        y: point.y + (lineHeight * index)
      }
    }];
    return result;
  }, [] as {
    text: string;
    frame: {
      x: number;
      y: number;
      width: number;
      height: number;
    },
    anchor: {
      x: number;
      y: number
    }
  }[])
}

// interface GetTextContent {
//   sketchLayer: srm.Text;
// }

// export const getTextContent = ({sketchLayer}: GetTextContent) => {
//   return sketchLayer.fragments.reduce((result, current, index) => {
//     const prevFragment = sketchLayer.fragments[index === 0 ? 0 : index - 1];
//     result = `${result}${current.text}`;
//     if (index < sketchLayer.fragments.length - 1 && !prevFragment.text.includes(`\n`)) {
//       result = `${result}${`\n`}`;
//     }
//     return result;
//   }, '');
// }

interface GetTextParagraphs {
  sketchLayer: srm.Text;
}

export const getTextParagraphs = ({sketchLayer}: GetTextParagraphs): string[][] => {
  return sketchLayer.fragments.reduce((result: string[][], current, index) => {
    return [[...result[0], current.text.trim()]];
  }, [[]]);
}

interface GetTextResize {
  sketchLayer: srm.Text;
}

export const getTextResize = ({sketchLayer}: GetTextResize) => {
  const fixedWidth = sketchLayer.fixedWidth;
  const resizingConstraint = sketchLayer.sketchObject.resizingConstraint();
  if (resizingConstraint === 47 && !fixedWidth) {
    return 'autoWidth';
  } else if (resizingConstraint === 63 && fixedWidth) {
    return 'autoHeight';
  } else if (resizingConstraint === 63 && !fixedWidth) {
    return 'fixed';
  } else {
    return 'fixed';
  }
}