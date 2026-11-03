import { PageSettings, PageDimensions } from '../../types/layout';
import { getPageDimensions } from './PageGeometry';

export interface PageLayoutMetrics {
  totalEstimatedPages: number;
  dimensions: PageDimensions;
  contentHeightPx: number;
  pageBodyHeightPx: number;
  pageBodyWidthPx: number;
}

export function calculatePageMetrics(
  settings: PageSettings,
  actualContentHeightPx: number
): PageLayoutMetrics {
  const dimensions = getPageDimensions(
    settings.format,
    settings.orientation,
    settings.customWidthMm,
    settings.customHeightMm
  );

  const pageBodyHeightPx = Math.max(
    200,
    dimensions.heightPx - (settings.margins.topPx + settings.margins.bottomPx)
  );

  const pageBodyWidthPx = Math.max(
    200,
    dimensions.widthPx - (settings.margins.leftPx + settings.margins.rightPx)
  );

  // Minimum 1 page, otherwise number of full body heights needed
  const totalEstimatedPages = Math.max(
    1,
    Math.ceil(actualContentHeightPx / pageBodyHeightPx)
  );

  return {
    totalEstimatedPages,
    dimensions,
    contentHeightPx: actualContentHeightPx,
    pageBodyHeightPx,
    pageBodyWidthPx,
  };
}

/**
 * Replaces page number macros like {page} and {pages} with the calculated page numbers.
 */
export function formatHeaderFooterMacro(
  template: string,
  currentPage: number,
  totalPages: number,
  docTitle: string
): string {
  if (!template) return '';
  return template
    .replace(/\{page\}/gi, String(currentPage))
    .replace(/\{pages\}/gi, String(totalPages))
    .replace(/\{title\}/gi, docTitle);
}
