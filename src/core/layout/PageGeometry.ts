import { PageDimensions, PageMargins, PaperFormat, Orientation, MarginPreset } from '../../types/layout';

// 96 CSS pixels per inch, 25.4 millimeters per inch
export const MM_TO_PX = 96 / 25.4; // approx 3.779527559
export const INCH_TO_PX = 96;

export function mmToPx(mm: number): number {
  return Math.round(mm * MM_TO_PX * 10) / 10;
}

export function pxToMm(px: number): number {
  return Math.round((px / MM_TO_PX) * 10) / 10;
}

export function inchToMm(inch: number): number {
  return Math.round(inch * 25.4 * 10) / 10;
}

export const PAPER_SIZES_MM: Record<Exclude<PaperFormat, 'Custom'>, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  Letter: { width: 215.9, height: 279.4 },
  Legal: { width: 215.9, height: 355.6 },
  A3: { width: 297, height: 420 },
  A5: { width: 148, height: 210 },
  Executive: { width: 184.1, height: 266.7 },
};

export const MARGIN_PRESETS: Record<'normal' | 'narrow' | 'moderate' | 'wide', MarginPreset> = {
  normal: {
    name: 'Normal',
    description: 'Top 1", Bottom 1", Left 1", Right 1"',
    top: 25.4,
    bottom: 25.4,
    left: 25.4,
    right: 25.4,
  },
  narrow: {
    name: 'Narrow',
    description: 'Top 0.5", Bottom 0.5", Left 0.5", Right 0.5"',
    top: 12.7,
    bottom: 12.7,
    left: 12.7,
    right: 12.7,
  },
  moderate: {
    name: 'Moderate',
    description: 'Top 1", Bottom 1", Left 0.75", Right 0.75"',
    top: 25.4,
    bottom: 25.4,
    left: 19.05,
    right: 19.05,
  },
  wide: {
    name: 'Wide',
    description: 'Top 1", Bottom 1", Left 2", Right 2"',
    top: 25.4,
    bottom: 25.4,
    left: 50.8,
    right: 50.8,
  },
};

export function createPageMargins(topMm: number, bottomMm: number, leftMm: number, rightMm: number): PageMargins {
  return {
    topMm,
    bottomMm,
    leftMm,
    rightMm,
    topPx: mmToPx(topMm),
    bottomPx: mmToPx(bottomMm),
    leftPx: mmToPx(leftMm),
    rightPx: mmToPx(rightMm),
  };
}

export function getPageDimensions(
  format: PaperFormat,
  orientation: Orientation,
  customWidthMm?: number,
  customHeightMm?: number
): PageDimensions {
  let widthMm = 210;
  let heightMm = 297;

  if (format === 'Custom' && customWidthMm && customHeightMm) {
    widthMm = customWidthMm;
    heightMm = customHeightMm;
  } else if (format in PAPER_SIZES_MM) {
    const standard = PAPER_SIZES_MM[format as Exclude<PaperFormat, 'Custom'>];
    widthMm = standard.width;
    heightMm = standard.height;
  }

  // Handle orientation
  if (orientation === 'landscape') {
    const temp = widthMm;
    widthMm = Math.max(widthMm, heightMm);
    heightMm = Math.min(temp, heightMm);
  } else {
    const temp = widthMm;
    widthMm = Math.min(widthMm, heightMm);
    heightMm = Math.max(temp, heightMm);
  }

  return {
    widthMm,
    heightMm,
    widthPx: mmToPx(widthMm),
    heightPx: mmToPx(heightMm),
  };
}

export function getDefaultPageSettings() {
  const margins = createPageMargins(25.4, 25.4, 25.4, 25.4);
  return {
    format: 'Letter' as PaperFormat,
    orientation: 'portrait' as Orientation,
    margins,
    marginPreset: 'normal' as const,
    differentFirstPage: false,
    differentOddEven: false,
    headerDistanceMm: 12.7,
    footerDistanceMm: 12.7,
    columns: 1 as const,
    columnGapMm: 12.7,
    watermark: {
      enabled: false,
      text: 'CONFIDENTIAL',
      opacity: 0.12,
      color: '#64748b',
      angle: -45,
      fontSizePt: 54,
    },
    lineNumbers: false,
  };
}
