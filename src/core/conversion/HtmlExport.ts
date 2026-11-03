import { PageSettings, HeaderFooterContent } from '../../types/layout';
import { getPageDimensions } from '../layout/PageGeometry';
import { escapeHtml } from './PrintLayout';

export function exportToHtmlDocument(
  htmlBody: string,
  settings: PageSettings,
  headerFooter?: HeaderFooterContent,
  title: string = 'Document'
): string {
  const dims = getPageDimensions(
    settings.format,
    settings.orientation,
    settings.customWidthMm,
    settings.customHeightMm
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page {
      size: ${dims.widthMm}mm ${dims.heightMm}mm;
      margin: ${settings.margins.topMm}mm ${settings.margins.rightMm}mm ${settings.margins.bottomMm}mm ${settings.margins.leftMm}mm;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    .page-container {
      max-width: ${dims.widthMm}mm;
      margin: 0 auto;
      padding: ${settings.margins.topMm}mm ${settings.margins.rightMm}mm ${settings.margins.bottomMm}mm ${settings.margins.leftMm}mm;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #0f172a;
      font-weight: 700;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    h1 { font-size: 24pt; line-height: 1.2; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
    h2 { font-size: 18pt; line-height: 1.3; }
    h3 { font-size: 14pt; line-height: 1.4; }
    p { margin-top: 0; margin-bottom: 0.8em; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 600;
    }
    blockquote {
      border-left: 4px solid #0284c7;
      margin: 1.5em 0;
      padding-left: 1em;
      color: #475569;
      font-style: italic;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }
    @media print {
      .page-container { padding: 0; max-width: none; }
      [data-type="page-break"] { break-after: page; height: 0; margin: 0; padding: 0; visibility: hidden; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page-break { page-break-after: always; break-after: page; }
    }
  </style>
</head>
<body>
  <div class="page-container">
    ${htmlBody}
  </div>
</body>
</html>`;
}
