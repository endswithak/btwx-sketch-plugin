declare namespace btwix {

  type ResizeHandle = 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'leftCenter' | 'rightCenter';

  type LineHandle = 'from' | 'to';

  type GradientHandle = 'origin' | 'destination';

  type GradientProp = 'fill' | 'stroke';

  type ResizeType = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'ew' | 'ns' | 'nesw' | 'nwses';

  type ZoomType = 'in' | 'out';

  type ToolType = 'Shape' | 'Selection' | 'Artboard' | 'Text' | 'Drag' | 'AreaSelect' | 'Resize' | 'Line' | 'Gradient' | 'Translate' | 'Zoom';

  type Orientation = 'Portrait' | 'Landscape';

  type TweenEventType = 'mousedown' | 'mouseup' | 'mousedrag' | 'click' | 'rightclick' | 'doubleclick' | 'mousemove' | 'mouseenter' | 'mouseleave';

  type UIElement = 'SelectionFrame' | 'HoverFrame' | 'DragFrame' | 'GradientFrame' | 'ActiveArtboardFrame' | 'TweenEventsFrame';

  type CubicBezier = 'linear' | 'power1' | 'power2' | 'power3' | 'power4' | 'back' | 'elastic' | 'bounce' | 'rough' | 'slow' | 'steps' | 'circ' | 'expo' | 'sine' | 'custom';

  type CubicBezierType = 'in' | 'inOut' | 'out';

  type ContextMenu = 'LayerEdit' | 'TweenEvent' | 'TweenEventDestination' | 'ArtboardCustomPreset' | 'TweenDrawerEvent' | 'Input';

  type ColorFormat = 'rgb' | 'hsl';

  type TweenProp = 'image' | 'shape' | 'fill' | 'fillGradientOriginX' | 'fillGradientOriginY' | 'fillGradientDestinationX' | 'fillGradientDestinationY' | 'x' | 'y' | 'radius' | 'rotation' | 'width' | 'height' | 'stroke' | 'strokeGradientOriginX' | 'strokeGradientOriginY' | 'strokeGradientDestinationX' | 'strokeGradientDestinationY' | 'dashOffset' | 'dashArrayWidth' | 'dashArrayGap' | 'strokeWidth' | 'shadowColor' | 'shadowOffsetX' | 'shadowOffsetY' | 'shadowBlur' | 'opacity' | 'fontSize' | 'lineHeight' | 'fromX' | 'fromY' | 'toX' | 'toY';

  type TweenPropMap = { [K in TweenProp]: boolean; }

  type LayerType = 'Group' | 'Shape' | 'Page' | 'Artboard' | 'Text' | 'Image';

  type BlendMode = 'normal' | 'darken' | 'multiply' | 'color-burn' | 'lighten' | 'screen' | 'color-dodge' | 'overlay' | 'soft-light' | 'hard-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | 'add' | 'subtract' | 'average' | 'pin-light' | 'negation' | 'source-over' | 'source-in' | 'source-out' | 'source-atop' | 'destination-over' | 'destination-in' | 'destination-out' | 'destination-atop' | 'lighter' | 'darker' | 'copy' | 'xor';

  type ColorEditorProp = 'fillColor' | 'strokeColor' | 'shadowColor';

  type StrokeCap = 'round' | 'square' | 'butt';

  type StrokeJoin = 'miter' | 'round' | 'bevel';

  type Jusftification = 'left' | 'center' | 'right';

  type FontWeight = 'normal' | 'italic' | 'bold' | 'bold italic';

  type AppleiPhoneDevice = 'iPhone 8' | 'iPhone 8 Plus' | 'iPhone SE' | 'iPhone 11 Pro' | 'iPhone 11' | 'iPhone 11 Pro Max';

  type AppleiPadDevice = '7.9" iPad mini' | '10.2" iPad' | '10.5" iPad Air' | '11" iPad Pro' | '12.9" iPad Pro';

  type AppleWatchDevice = 'Apple Watch 38mm' | 'Apple Watch 40mm' | 'Apple Watch 42mm' | 'Apple Watch 44mm';

  type AppleTVDevice = 'Apple TV';

  type AppleMacDevice = 'Touch Bar';

  type AppleDeviceType = AppleiPhoneDevice | AppleiPadDevice | AppleWatchDevice | AppleTVDevice | AppleMacDevice;

  type AppleDeviceCategory = 'iPhone' | 'iPad' | 'Mac' | 'Apple TV' | 'Apple Watch';

  type AndroidMobileDevice = 'Android' | 'Pixel 2' | 'Pixel 2 XL' | 'Pixel 3' | 'Pixel 3 XL' | 'Galaxy S10e' | 'Galaxy S10' | 'Galaxy S10+';

  type AndroidTabletDevice = 'Nexus 7' | 'Nexus 9' | 'Nexus 10';

  type AndroidChromebookDevice = 'Pixel State' | 'Pixelbook';

  type AndroidDeviceType = AndroidMobileDevice | AndroidTabletDevice | AndroidChromebookDevice;

  type AndroidDeviceCategory = 'Common Mobile' | 'Common Tablet' | 'Chromebook';

  type ResponsiveWebMobileDevice = 'Mobile';

  type ResponsiveWebTabletDevice = 'Tablet';

  type ResponsiveWebDesktopDevice = 'Desktop' | 'Desktop HD';

  type ResponsiveWebDeviceType = ResponsiveWebMobileDevice | ResponsiveWebTabletDevice | ResponsiveWebDesktopDevice;

  type ResponsiveWebDeviceCategory = 'Mobile' | 'Tablet' | 'Desktop';

  type DeviceType = AppleDevice | AndroidDevice | ResponsiveWebDevice;

  type DeviceCategoryType = AppleDeviceCategory | AndroidDeviceCategory | ResponsiveWebDeviceCategory | 'Custom';

  type DevicePlatformType = 'Apple' | 'Android' | 'Responsive Web' | 'Custom';

  type DeviceOrientationType = 'Landscape' | 'Portrait';

  type BooleanOperation = 'unite' | 'intersect' | 'subtract' | 'exclude' | 'divide';

  type TweenEventSort = 'none' | 'layer-asc' | 'layer-dsc' | 'event-asc' | 'event-dsc' | 'artboard-asc' | 'artboard-dsc' | 'destinationArtboard-asc' | 'destinationArtboard-dsc';

  type FillStrokeTween = 'colorToColor' | 'nullToColor' | 'colorToNull' | 'gradientToGradient' | 'gradientToColor' | 'colorToGradient' | 'gradientToNull' | 'nullToGradient';

  interface HitResult {
    type: 'Layer' | 'UIElement' | 'Empty';
    event: paper.ToolEvent;
    layerProps: {
      layerItem: Layer;
      nearestScopeAncestor: Layer;
      deepSelectItem: Layer;
    };
    uiElementProps: {
      elementId: UIElement;
      interactive: boolean;
      interactiveType: string;
    };
  }

  interface Icon {
    name: string;
    fill: string;
    opacity: string;
  }

  interface Color {
    h: number;
    s: number;
    l: number;
    v: number;
    a: number;
  }

  interface PaperGradientFill extends paper.Color {
    origin: paper.Point;
    destination: paper.Point;
    gradient: paper.Gradient;
  }

  interface Device {
    type: DeviceType;
    category: DevicePlatformType;
    width: number;
    height: number;
  }

  interface DeviceCategory {
    type: DeviceCategoryType;
    devices: em.Device[];
  }

  interface DevicePlatform {
    type: DevicePlatformType;
    categories: em.DeviceCategory[];
  }

  interface Style {
    fill: Fill;
    stroke: Stroke;
    strokeOptions: StrokeOptions;
    shadow: Shadow;
    opacity: number;
    blendMode: BlendMode;
  }

  interface TextStyle {
    fontSize: number;
    leading: number;
    fontWeight: FontWeight;
    fontFamily: string;
    justification: Jusftification;
  }

  type FillType = 'color' | 'gradient';

  interface Fill {
    fillType: FillType;
    enabled: boolean;
    color: em.Color;
    gradient: Gradient;
  }

  type GradientType = 'linear' | 'radial';

  interface Gradient {
    gradientType: GradientType;
    origin: Point;
    destination: Point;
    activeStopIndex: number;
    stops: GradientStop[];
  }

  interface GradientStop {
    position: number;
    color: em.Color;
  }

  interface Stroke {
    fillType: FillType;
    enabled: boolean;
    color: em.Color;
    width: number;
    gradient: Gradient;
  }

  interface StrokeOptions {
    cap: StrokeCap;
    join: StrokeJoin;
    dashArray: number[];
    dashOffset: number;
  }

  interface Shadow {
    fillType: FillType;
    enabled: boolean;
    color: em.Color;
    blur: number;
    offset: Point;
  }

  interface Layer {
    type: LayerType;
    id: string;
    name: string;
    frame: em.Frame;
    parent: string;
    selected: boolean;
    children: string[] | null;
    tweenEvents: string[];
    tweens: string[];
    style: Style;
    transform: Transform;
    masked: boolean;
    mask: boolean;
  }

  type ClipboardType = 'layers' | 'style' | 'sketch-layers';

  interface ClipboardLayers {
    type: ClipboardType;
    main: string[];
    allIds: string[];
    byId: {
      [id: string]: Layer;
    };
    images: {
      [id: string]: DocumentImage;
    };
  }

  interface ClipboardStyle {
    type: ClipboardType;
    style: em.Style;
    textStyle: em.TextStyle;
  }

  interface Group extends Layer {
    type: 'Group';
    children: string[];
    showChildren: boolean;
    clipped: boolean;
  }

  interface Artboard extends Layer {
    type: 'Artboard';
    children: string[];
    showChildren: boolean;
  }

  interface Page extends Layer {
    type: 'Page';
    children: string[];
  }

  interface Text extends Layer {
    type: 'Text';
    text: string;
    children: null;
    textStyle: TextStyle;
  }

  interface Shape extends Layer {
    type: 'Shape';
    shapeType: ShapeType;
    children: null;
    pathData: string;
    sides?: number;
    points?: number;
    radius?: number;
    from?: Point;
    to?: Point;
  }

  interface CurvePoint {
    point: Point;
    handleIn: Point;
    handleOut: Point;
  }

  interface Polygon extends Shape {
    sides: number;
  }

  interface Star extends Shape {
    points: number;
    radius: number;
  }

  interface Rounded extends Shape {
    radius: number;
  }

  interface Line extends Shape {
    from: Point;
    to: Point;
  }

  interface Image extends Layer {
    type: 'Image';
    imageId: string;
    children: null;
  }

  interface DocumentImage {
    id: string;
    buffer: Buffer;
  }

  interface TweenEvent {
    id: string;
    name: string;
    layer: string;
    event: TweenEventType;
    artboard: string;
    destinationArtboard: string;
    tweens: string[];
  }

  interface Tween {
    id: string;
    prop: TweenProp;
    layer: string;
    destinationLayer: string;
    event: string;
    ease: CubicBezier;
    power: CubicBezierType;
    duration: number;
    delay: number;
    frozen: boolean;
  }

  type Dropzone = 'Top' | 'Center' | 'Bottom';

  interface Frame {
    x: number;
    y: number;
    width: number;
    height: number;
    innerWidth: number;
    innerHeight: number;
  }

  interface Transform {
    rotation: number;
    horizontalFlip: boolean;
    verticalFlip: boolean;
  }

  interface ArtboardPreset {
    id: string;
    category: 'Custom';
    type: string;
    width: number;
    height: number;
  }

  interface Palette {
    primary: string;
    primaryHover: string;
    accent: string;
    accentHover: string;
    recording: string;
    recordingHover: string;
  }

  interface BackgroundScale {
    z6: string;
    z5: string;
    z4: string;
    z3: string;
    z2: string;
    z1: string;
    z0: string;
  }

  interface TextScale {
    base: string;
    light: string;
    lighter: string;
    lightest: string;
    onPrimary: string;
    onAccent: string;
  }

  type ThemeName = 'light' | 'dark';

  interface Theme {
    name: ThemeName;
    palette: Palette;
    background: BackgroundScale;
    backgroundInverse: BackgroundScale;
    text: TextScale;
    unit: number;
  }

  type ShapeType = 'Rectangle' | 'Ellipse' | 'Rounded' | 'Polygon' | 'Star' | 'Line' | 'Custom';

  interface SnapPoint {
    id: string;
    axis: 'x' | 'y';
    side: 'left' | 'right' | 'center' | 'top' | 'bottom';
    point: number;
    breakThreshold?: number;
    boundsSide?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  }

  interface SnapBound {
    side: 'left' | 'right' | 'center' | 'top' | 'bottom';
    point: number;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface DocumentWindows {
    [id: number]: DocumentWindow;
  }

  interface DocumentWindow {
    document: number;
    preview: number;
  }
}

declare namespace srm {
  ////////////////////////////////////////////////////////
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Sketch Models
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ////////////////////////////////////////////////////////

  type Sketch = any;
  type Buffer = any;

  // Models / Document

  interface Document {
    id: string;
    pages: Page[];
    selectedPage: Page;
    selectedLayers: Selection;
    path: string;
    sharedLayerStyles: SharedStyle[];
    sharedTextStyles: SharedStyle[];
    colors: ColorAsset[];
    gradients: GradientAsset[];
    colorSpace: ColorSpace;
  }

  // Models / Document / ColorSpace

  type ColorSpace = 'Unmanaged' | 'sRGB' | 'P3';

  // Models / Library

  interface Library {
    readonly id: string;
    readonly name: string;
    readonly valid: boolean;
    enabled: boolean;
    readonly libraryType: LibraryType;
    readonly lastModifiedAt: Date;
  }

  // Models / Library / LibraryType

  type LibraryType = 'Internal' | 'User' | 'Remote';

  // Models / ImportableObject

  interface ImportableObject {
    id: string;
    name: string;
    objectType: ImportableObjectType;
    library: Library;
  }

  // Models / ImportableObject / ImportableObjectType

  type ImportableObjectType = 'Symbol' | 'LayerStyle' | 'TextStyle';

  // Models / Style

  interface Style {
    opacity: number;
    blendingMode: BlendingMode;
    blur: Blur;
    fills: Fill[];
    borders: Border[];
    borderOptions: BorderOptions;
    shadows: Shadow[];
    innerShadows: Shadow[];
    alignment: Alignment;
    verticalAlignment: VerticalAlignment;
    kerning: number | null;
    lineHeight: number | null;
    paragraphSpacing: number;
    textColor: string;
    fontSize: number;
    textTransform: TextTransform;
    fontFamily: string;
    fontWeight: FontWeight;
    fontStyle: FontStyle;
    fontVariant: FontVariant;
    fontStretch: FontStretch;
    textUnderline: TextUnderline;
    textStrikethrough: TextStrikethrough;
    fontAxes: FontAxes[];
  }

  // Models / Style / BlendingMode

  type BlendingMode = 'Normal' | 'Darken' | 'Multiply' | 'ColorBurn' | 'Lighten' | 'Screen' | 'ColorDodge' | 'Overlay' | 'SoftLight' | 'HardLight' | 'Difference' | 'Exclusion' | 'Hue' | 'Saturation' | 'Color' | 'Luminosity';

  // Models / Style / Blur

  interface Blur {
    blurType: BlurType;
    radius: number;
    motionAngle: number;
    center: BlurCenter;
    enabled: boolean;
  }

  // Models / Style / Blur / BlurType

  type BlurType = 'Gaussian' | 'Motion' | 'Zoom' | 'Background';

  // Models / Style / Blur / BlurCenter

  interface BlurCenter {
    x: number;
    y: number;
  }

  // Models / Style / Border

  interface Border {
    fillType: FillType;
    color: string;
    gradient: Gradient;
    enabled: boolean;
    position: BorderPosition;
    thickness: number;
    sketchObject?: any;
  }

  // Models / Style / Border / BorderPosition

  type BorderPosition = 'Center' | 'Inside' | 'Outside';

  // Models / Style / BorderOptions

  interface BorderOptions {
    startArrowhead: ArrowHead;
    endArrowhead: ArrowHead;
    dashPattern: number[];
    lineEnd: LineEnd;
    lineJoin: LineJoin;
  }

  // Models / Style / BorderOptions / ArrowHead

  type ArrowHead = 'None' | 'OpenArrow' | 'FilledArrow' | 'Line' | 'OpenCircle' | 'FilledCircle' | 'OpenSquare' | 'FilledSquare';

  // Models / Style / BorderOptions / LineEnd

  type LineEnd = 'Butt' | 'Round' | 'Projecting';

  // Models / Style / BorderOptions / LineJoin

  type LineJoin = 'Miter' | 'Round' | 'Bevel';

  // Models / Style / Fill

  interface Fill {
    fillType: FillType;
    color: string;
    gradient: Gradient;
    pattern: Pattern;
    enabled: boolean;
    sketchObject?: any;
  }

  // Models / Style / Fill / FillType

  type FillType = 'Color' | 'Gradient' | 'Pattern';

  // Models / Style / Fill / Gradient

  interface Gradient {
    gradientType: GradientType;
    from: Point;
    to: Point;
    aspectRatio: number;
    stops: GradientStop[];
  }

  // Models / Style / Fill / Gradient / GradientType

  type GradientType = 'Linear' | 'Radial' | 'Angular';

  // Models / Style / Fill / Gradient / GradientStop

  interface GradientStop {
    position: number;
    color: string;
  }

  // Models / Style / Fill / Pattern

  interface Pattern {
    patternType: PatternFillType;
    image: ImageData | null;
    tileScale: number;
  }

  // Models / Style / Fill / Pattern / PatternFillType

  type PatternFillType = 'Tile' | 'Fill' | 'Stretch' | 'Fit';

  // Models / Style / Shadow

  interface Shadow {
    color: string;
    blur: number;
    x: number;
    y: number;
    spread: number;
    enabled: boolean;
  }

  // Models / Style / Alignment

  type Alignment = 'left' | 'right' | 'center' | 'justified';

  // Models / Style / VerticalAlignment

  type VerticalAlignment = 'top' | 'center' | 'bottom';

  // Models / Style / TextTransform

  type TextTransform = 'none' | 'uppercase' | 'lowercase';

  // Models / Style / FontWeight

  type FontWeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

  // Models / Style / FontStyle

  type FontStyle = 'italic' | undefined;

  // Models / Style / FontVariant

  type FontVariant = 'small-caps' | undefined;

  // Models / Style / FontStretch

  type FontStretch = 'compressed' | 'condensed' | 'narrow' | 'expanded' | 'poster' | undefined;

  // Models / Style / TextUnderline

  type TextUnderline = 'single' | 'thick' | 'double' | 'dot' | 'dash' | 'dash-dot' | 'dash-dot-dot';

  // Models / Style / TextStrikethrough

  type TextStrikethrough = 'single' | 'thick' | 'double' | 'dot' | 'dash' | 'dash-dot' | 'dash-dot-dot';

  // Models / Style / FontAxes

  interface FontAxes {
    id: string;
    min: number;
    max: number;
    value: number;
  }

  // Models / SharedStyle

  interface SharedStyle {
    id: string;
    styleType: StyleType;
    name: string;
    style: Style;
  }

  // Models / SharedStyle / StyleType

  type StyleType = 'Text' | 'Layer' | 'Unknown';

  // Models / Override

  interface Override {
    path: string;
    property: string;
    id: string;
    symbolOverride: boolean;
    value: string | ImageData;
    isDefault: boolean;
    affectedLayer: Text | Image | SymbolInstance;
    editable: boolean;
    selected: boolean | undefined;
  }

  // Models / Flow

  interface Flow {
    target: Artboard | BackTarget;
    targetId: string | BackTarget;
    animationType: AnimationType;
  }

  // Models / Flow / BackTarget

  type BackTarget = any;

  // Models / Flow / AnimationType

  type AnimationType = 'none' | 'slideFromLeft' | 'slideFromRight' | 'slideFromBottom' | 'slideFromTop';

  // Models / ExportFormat

  interface ExportFormat {
    fileFormat: FileFormat;
    prefix: string | undefined;
    suffix: string | undefined;
    size: string;
  }

  // Models / ExportFormat / FileFormat

  type FileFormat = 'jpg' | 'png' | 'tiff' | 'eps' | 'pdf' | 'webp' | 'svg';

  // Models / Selection

  interface Selection {
    layers: Layer[];
    readonly length: number;
    readonly isEmpty: boolean;
  }

  // Models / Point

  interface Point {
    x: number;
    y: number;
  }

  // Models / CurvePoint

  interface CurvePoint {
    point: Point;
    curveFrom: Point;
    curveTo: Point;
    cornerRadius: number;
    pointType: PointType;
  }

  // Models / CurvePoint / PointType

  type PointType = 'Undefined' | 'Straight' | 'Mirrored' | 'Asymmetric' | 'Disconnected';

  // Models / Rectangle

  interface Rectangle {
    x: number;
    y: number;
    height: number;
    width: number;
    changeBasis(basis: any): any;
  }

  // Models / ColorAsset

  interface ColorAsset {
    name: string;
    color: string;
  }

  // Models / GradientAsset

  interface GradientAsset {
    name: string;
    gradient: Gradient;
  }

  // Models / SmartLayout

  type SmartLayout = 'LeftToRight' | 'HorizontallyCenter' | 'RightToLeft' | 'TopToBottom' | 'VerticallyCenter' | 'BottomToTop';

  ////////////////////////////////////////////////////////
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Sketch Layers
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ////////////////////////////////////////////////////////

  type SketchLayer = Group | Page | Artboard | Shape | Image | ShapePath | Text | SymbolInstance | HotSpot | Slice;
  type PageLayer = Group | Artboard | Shape | Image | ShapePath | Text | SymbolInstance | HotSpot | Slice;
  type ArtboardLayer = Group | Shape | Image | ShapePath | Text | SymbolInstance | HotSpot | Slice;
  type RelevantLayer = Group | Shape | Image | ShapePath | Text;

  // Layers / Layer

  interface Layer {
    id: string;
    name: string;
    parent: Group;
    locked: boolean;
    hidden: boolean;
    frame: Rectangle;
    selected: boolean;
    flow: Flow;
    exportFormats: ExportFormat[];
    transform: Transform;
    index: number;
    type: string;
    sketchObject: any;
    duplicate(): any;
    remove(): any;
    toJSON(): any;
  }

  // Layers / Layer / Transform

  interface Transform {
    rotation: number;
    flippedHorizontally: boolean;
    flippedVertically: boolean;
  }

  // Layers / Group

  interface Group extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    layers: Layer[];
    smartLayout: SmartLayout;
  }

  // Layers / Page

  type Page = Omit<Group, 'flow' | 'locked' | 'hidden' | 'exportFormats' | 'transform' | 'style' | 'sharedStyle' | 'sharedStyleId' | 'smartLayout'>;

  // Layers / Artboard

  interface Artboard extends Omit<Group, 'flow' | 'locked' | 'hidden' | 'transform' | 'style' | 'sharedStyle' | 'sharedStyleId' | 'smartLayout' | 'parent'> {
    parent: Page;
    flowStartPoint: boolean;
    background: Background;
  }

  // Layers / Artboard / Background

  interface Background {
    enabled: boolean;
    includedInExport: boolean;
    color: string;
  }

  // Layers / Shape

  interface Shape extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    layers: ShapePath[];
  }

  // Layers / Image

  interface Image extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    image: ImageData;
  }

  // Layers / Image / ImageData

  interface ImageData {
    id: string;
    nsimage: NSImage;
    nsdata: NSData;
  }

  // Layers / Image / ImageData / NSImage

  type NSImage = any;

  // Layers / Image / ImageData / NSData

  type NSData = any;

  // Layers / ShapePath

  interface ShapePath extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    shapeType: ShapeType;
    points: CurvePoint[];
    closed: boolean;
    getSVGPath(): string;
  }

  // Layers / ShapePath / ShapeType

  type ShapeType = 'Rectangle' | 'Oval' | 'Triangle' | 'Polygon' | 'Star' | 'Custom';

  // Layers / Text

  interface Text extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    text: string;
    lineSpacing: LineSpacing;
    fixedWidth: boolean;
    fragments: {
      range: any,
      text: string;
      baselineOffset: number;
      rect: Rectangle;
    }[];
  }

  // Layers / Text / LineSpacing

  type LineSpacing = 'constantBaseline' | 'variable';

  // Layers / SymbolMaster

  interface SymbolMaster extends Layer {
    layers: Layer[];
    symbolId: string;
    overrides: Override[];
  }

  // Layers / SymbolMaster / Background

  interface SymbolMasterBackground extends Background {
    includedInInstance: boolean;
  }

  // Layers / SymbolInstance

  interface SymbolInstance extends Layer {
    style: Style;
    sharedStyle: SharedStyle;
    sharedStyleId: string | null;
    master: SymbolMaster;
    overrides: Override[];
    detach(options?: {recursively: boolean}): Group;
  }

  // Layers / HotSpot

  type HotSpot = Omit<Layer, 'exportFormats' | 'transform'>;

  // Layers / Slice

  type Slice = Omit<Layer, 'transform'>;

  ////////////////////////////////////////////////////////
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // App
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ////////////////////////////////////////////////////////

  type AppLayer = Artboard | Image | Shape | ShapePath | Text | Group;
  type AppArtboardLayer = Image | Shape | ShapePath | Text | Group;

  interface Origin {
    top: number;
    right: number;
    bottom: number;
    left: number;
    yCenter: number;
    xCenter: number;
  }

  interface GroupShadows {
    groupId: string,
    shadows: srm.Shadow[];
  }

  interface ShapePartial extends ShapePath {
    type: 'ShapePartial';
    shape: Shape;
    holes: ShapePartialHole[];
  }

  interface ShapePartialHole extends ShapePath {
    type: 'ShapePartialHole';
    shape: Shape;
    shapePath: ShapePath;
  }

  interface FontDir {
    location: string;
    contents: string[];
  }

  interface SvgAsset {
    id: string;
    src: string;
  }

  interface ImgAsset {
    id: string;
    src: {
      [`1x`]: string;
      [`2x`]: string;
    };
  }

  interface base64Image {
    id: string;
    buffer: any;
  }

  interface ArtboardAssets {
    images: srm.ImgAsset[];
    svgs: srm.SvgAsset[];
    fonts: string[];
  }

  interface Note {
    id: string;
    notes: string[];
  }

  type Theme = 'light' | 'dark';

  interface Store {
    artboard: srm.Artboard;
    images: srm.ImgAsset[];
    svgs: srm.SvgAsset[];
    notes: Note[];
    fonts: string[];
    artboardBase64: string;
  }

  interface AppStore {
    artboards: srm.Artboard[];
    images: {
      [id: string]: btwix.DocumentImage;
    };
  }

  interface ProcessedArtboard {
    artboard: srm.Artboard;
    images: {
      [id: string]: btwix.DocumentImage;
    };
  }

  namespace css {
    namespace value {
      type Top = string;
      type Right = string;
      type Left = string;
      type Bottom = string;
      type Width = string;
      type Height = string;
      type Opacity = number;
      type BorderRadius = string;
      type BoxShadow = string;
      type Filter = string;
      type Background = string;
      type BackgroundImage = string;
      type BackgroundSize = string;
      type BackgroundRepeat = string;
      type BackgroundPosition = string;
      type Fill = string;
      type StrokeWidth = number | string;
      type Stroke = string
      type StrokeLineJoin = string;
      type StrokeDashArray = string;
      type StrokeLineCap = string;
      type D = string;
      type Transform = string;
      type TextTransform = 'uppercase' | 'lowercase';
      type WebkitTextStrokeColor = string;
      type MozTextStrokeColor = string;
      type WebkitTextStrokeWidth = string;
      type MozTextStrokeWidth = string;
      type TextShadow = string;
      type TextDecoration = 'line-through' | 'underline';
      type LetterSpacing = string;
      type FontFamily = string;
      type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
      type FontSize = string;
      type FontStretch = 'extra-condensed' | 'condensed' | 'semi-condensed' | 'expanded' | 'extra-expanded';
      type Color = string;
      type LineHeight = string;
      type PaddingBottom = string;
      type TextAlign = 'left' | 'right' | 'center' | 'justify';
      type FontStyle = 'italic';
      type JustifyContent = 'flex-start' | 'center' | 'flex-end';
      type Overflow = 'visible' | 'hidden';
      type Mask = string;
      type WebkitMaskBoxImage = string;
    }

    interface Left {
      left: srm.css.value.Left
    }

    interface Top {
      top: srm.css.value.Top
    }

    interface Width {
      width: srm.css.value.Width;
    }

    interface Height {
      height: srm.css.value.Height;
    }

    interface Opacity {
      opacity: srm.css.value.Opacity;
    }

    interface BorderRadius {
      borderRadius: srm.css.value.BorderRadius;
    }

    interface BoxShadow {
      boxShadow: srm.css.value.BoxShadow;
    }

    interface Background {
      background: srm.css.value.Background;
    }

    interface BackgroundImage {
      backgroundImage: srm.css.value.BackgroundImage;
      backgroundSize: srm.css.value.BackgroundSize;
      backgroundRepeat: srm.css.value.BackgroundRepeat;
      backgroundPosition: srm.css.value.BackgroundPosition;
    }

    interface GaussianBlur {
      filter: srm.css.value.Filter;
    }

    interface Fill {
      fill: srm.css.value.Fill;
    }

    interface StrokeWidth {
      strokeWidth: srm.css.value.StrokeWidth;
    }

    interface Stroke {
      stroke: srm.css.value.Stroke;
    }

    interface StrokeLineJoin {
      strokeLinejoin: srm.css.value.StrokeLineJoin;
    }

    interface StrokeDashArray {
      strokeDasharray: srm.css.value.StrokeDashArray;
    }

    interface StrokeLineCap {
      strokeLinecap: srm.css.value.StrokeLineCap;
    }

    interface D {
      d: srm.css.value.D;
    }

    interface Transform {
      transform: srm.css.value.Transform;
    }

    interface TextTransform {
      textTransform: srm.css.value.TextTransform;
    }

    interface TextStrokeColor {
      WebkitTextStrokeColor: srm.css.value.WebkitTextStrokeColor;
      MozTextStrokeColor: srm.css.value.MozTextStrokeColor;
    }

    interface TextStrokeWidth {
      WebkitTextStrokeWidth: srm.css.value.WebkitTextStrokeWidth;
      MozTextStrokeWidth: srm.css.value.MozTextStrokeWidth;
    }

    interface TextStrokeWidth {
      WebkitTextStrokeWidth: srm.css.value.WebkitTextStrokeWidth;
      MozTextStrokeWidth: srm.css.value.MozTextStrokeWidth;
    }

    interface TextShadow {
      textShadow: srm.css.value.TextShadow;
    }

    interface TextDecoration {
      textDecoration: srm.css.value.TextDecoration;
    }

    interface LetterSpacing {
      letterSpacing: srm.css.value.LetterSpacing;
    }

    interface FontFamily {
      fontFamily: srm.css.value.FontFamily;
    }

    interface FontWeight {
      fontWeight: srm.css.value.FontWeight;
    }

    interface FontSize {
      fontSize: srm.css.value.FontSize;
    }

    interface FontStretch {
      fontStretch: srm.css.value.FontStretch;
    }

    interface Color {
      color: srm.css.value.Color;
    }

    interface LineHeight {
      lineHeight: srm.css.value.LineHeight;
    }

    interface PaddingBottom {
      paddingBottom: srm.css.value.PaddingBottom;
    }

    interface TextAlign {
      textAlign: srm.css.value.TextAlign;
    }

    interface FontStyle {
      fontStyle: srm.css.value.FontStyle;
    }

    interface JustifyContent {
      justifyContent: srm.css.value.JustifyContent;
    }

    interface JustifyContent {
      justifyContent: srm.css.value.JustifyContent;
    }

    interface Overflow {
      overflow: srm.css.value.Overflow;
    }

    interface Mask {
      mask: srm.css.value.Mask;
      WebkitMaskBoxImage: srm.css.value.WebkitMaskBoxImage;
    }
  }
}