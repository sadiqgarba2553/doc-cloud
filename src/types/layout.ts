export type PaperFormat = 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5' | 'Executive' | 'Custom';
export type Orientation = 'portrait' | 'landscape';
export type SectionBreakType = 'nextPage' | 'continuous' | 'evenPage' | 'oddPage';

export interface PageDimensions {
  widthMm: number;
  heightMm: number;
  widthPx: number; // at 96 DPI (1 inch = 96 px = 25.4 mm)
  heightPx: number;
}

export interface PageMargins {
  topMm: number;
  bottomMm: number;
  leftMm: number;
  rightMm: number;
  // in px for canvas layout
  topPx: number;
  bottomPx: number;
  leftPx: number;
  rightPx: number;
}

export interface MarginPreset {
  name: string;
  description: string;
  top: number; // in mm
  bottom: number; // in mm
  left: number; // in mm
  right: number; // in mm
}

export interface DocumentSection {
  id: string;
  name?: string;
  startPos: number;
  type: SectionBreakType;
  settings?: Partial<PageSettings>;
}

export interface PageSettings {
  format: PaperFormat;
  orientation: Orientation;
  customWidthMm?: number;
  customHeightMm?: number;
  margins: PageMargins;
  marginPreset: 'normal' | 'narrow' | 'moderate' | 'wide' | 'custom';
  pageless?: boolean;
  differentFirstPage: boolean;
  differentOddEven: boolean;
  headerDistanceMm: number;
  footerDistanceMm: number;
  columns: 1 | 2 | 3;
  columnGapMm: number;
  watermark?: {
    enabled: boolean;
    text: string;
    opacity: number;
    color: string;
    angle: number; // e.g. -45 deg
    fontSizePt: number;
  };
  lineNumbers: boolean;
}

export interface HeaderFooterContent {
  headerLeft: string;
  headerCenter: string;
  headerRight: string;
  footerLeft: string;
  footerCenter: string;
  footerRight: string;
  firstPageHeaderLeft?: string;
  firstPageHeaderCenter?: string;
  firstPageHeaderRight?: string;
  firstPageFooterLeft?: string;
  firstPageFooterCenter?: string;
  firstPageFooterRight?: string;
  evenPageHeaderCenter?: string;
  evenPageFooterCenter?: string;
}
