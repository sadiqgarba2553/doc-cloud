import { Editor } from '@tiptap/core';
import { DOMSerializer } from '@tiptap/pm/model';
import { DocCloudFilePackage } from '../../types/document';
import { getPageDimensions } from '../layout/PageGeometry';
import { paginateBlocks } from '../layout/BlockPagination';
import { formatHeaderFooterMacro } from '../layout/PaginationEngine';

export const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));

export function createPrintLayout(editor: Editor, doc: DocCloudFilePackage, zoom: number) {
  const { settings: s } = doc;
  const dims = getPageDimensions(s.format, s.orientation, s.customWidthMm, s.customHeightMm);
  const blocks: { pos: number; height: number; pageBreak: boolean; html: string }[] = [];
  const serializer = DOMSerializer.fromSchema(editor.schema);

  editor.state.doc.forEach((node, pos) => {
    const element = editor.view.nodeDOM(pos) as HTMLElement;
    const style = getComputedStyle(element);
    const container = document.createElement('div');
    container.appendChild(serializer.serializeNode(node));
    blocks.push({
      pos,
      height:
        element.getBoundingClientRect().height / zoom +
        parseFloat(style.marginBottom || '0') +
        parseFloat(style.marginTop || '0'),
      pageBreak: node.type.name === 'pageBreak',
      html: container.innerHTML,
    });
  });

  const continuous = !!s.pageless || s.columns > 1;
  const layout = continuous ? { gaps: [], oversized: false } : paginateBlocks(
    blocks,
    dims.heightPx - s.margins.topPx - s.margins.bottomPx,
    s.margins.topPx + s.margins.bottomPx + 28
  );
  if (layout.oversized) {
    throw new Error('A paragraph or table is taller than a page. Split that block before printing for accurate output.');
  }

  const breakPositions = new Set(layout.gaps.map(gap => gap.pos));
  const groups: string[][] = [[]];
  for (const block of blocks) {
    if (breakPositions.has(block.pos)) groups.push([]);
    if (!block.pageBreak) groups[groups.length - 1].push(block.html);
  }

  const field = (text: string, page: number) =>
    escapeHtml(
      formatHeaderFooterMacro(
        s.differentFirstPage && page === 1 ? '' : text,
        page,
        groups.length,
        doc.metadata.title
      )
    );

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(
    doc.metadata.title
  )}</title><style>
  @page{size:${dims.widthMm}mm ${dims.heightMm}mm;margin:0}
  *{box-sizing:border-box}body{margin:0;color:#282d35;background:white;font:11pt/1.6 Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .print-page{position:relative;width:${dims.widthMm}mm;height:${dims.heightMm}mm;padding:${s.margins.topMm}mm ${
    s.margins.rightMm
  }mm ${s.margins.bottomMm}mm ${s.margins.leftMm}mm;break-after:page;overflow:hidden}.print-page:last-child{break-after:auto}
  .print-body{position:relative;display:flow-root;overflow-wrap:break-word;column-count:${s.columns};column-gap:${
    s.columnGapMm
  }mm}.print-body>*{margin-top:0;margin-bottom:14px}p{line-height:1.6;min-height:1.6em}h1{font:400 30pt/1.2 Georgia,serif;letter-spacing:-.6px;color:#20324a;margin-bottom:20px!important}h2{font-size:17pt;line-height:1.35;letter-spacing:-.3px;color:#263d59}h3{font-size:13pt;color:#263d59}
  table{border-collapse:collapse;width:100%;table-layout:fixed}td,th{border:1px solid #cbd5e1;padding:10px;text-align:left;vertical-align:top}th{background:#f1f4f8}td p,th p{margin:0}img{max-width:100%;height:auto}ul,ol{padding-left:24px}pre{white-space:pre-wrap}blockquote{border-left:3px solid #cbd5e1;padding-left:16px}.print-fields{position:absolute;left:${
    s.margins.leftMm
  }mm;right:${
    s.margins.rightMm
  }mm;display:flex;align-items:center;font:10px Arial;color:#858c97}.print-fields span{flex:1}.print-fields span:nth-child(2){text-align:center}.print-fields span:last-child{text-align:right}.print-header{top:0;height:${
    s.margins.topMm
  }mm}.print-footer{bottom:0;height:${s.margins.bottomMm}mm}ins{background:#e0f2e9;color:#1d6940}del{background:#fbe7e8;color:#a2313b}.watermark{position:absolute;top:43%;left:0;right:0;text-align:center;font-size:${
    s.watermark?.fontSizePt || 54
  }pt;transform:rotate(${s.watermark?.angle || -45}deg);opacity:${s.watermark?.opacity || 0.12};color:${
    s.watermark?.color || '#64748b'
  }}
  ${continuous ? `@page{margin:${s.margins.topMm}mm ${s.margins.rightMm}mm ${s.margins.bottomMm}mm ${s.margins.leftMm}mm}.print-page{width:auto;height:auto;padding:0;overflow:visible;break-after:auto}.print-fields,.watermark{display:none}.print-body{column-count:${s.columns};column-fill:balance}.print-body>*{break-inside:avoid}` : ''}
  </style></head><body>${groups
    .map(
      (html, i) =>
        `<section class="print-page"><header class="print-fields print-header">${[
          doc.headerFooter.headerLeft,
          doc.headerFooter.headerCenter,
          doc.headerFooter.headerRight,
        ]
          .map(text => `<span>${field(text, i + 1)}</span>`)
          .join('')}</header>${
          s.watermark?.enabled ? `<div class="watermark">${escapeHtml(s.watermark.text)}</div>` : ''
        }<div class="print-body">${html.join('')}</div><footer class="print-fields print-footer">${[
          doc.headerFooter.footerLeft,
          doc.headerFooter.footerCenter,
          doc.headerFooter.footerRight,
        ]
          .map(text => `<span>${field(text, i + 1)}</span>`)
          .join('')}</footer></section>`
    )
    .join('')}</body></html>`;
}

export async function printLayout(html: string) {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  iframe.title = 'Document print layout';
  document.body.appendChild(iframe);
  const target = iframe.contentDocument!;
  target.open();
  target.write(html);
  target.close();
  await Promise.all(Array.from(target.images).map(img => img.decode().catch(() => undefined)));
  await target.fonts.ready;
  iframe.contentWindow!.onafterprint = () => iframe.remove();
  iframe.contentWindow!.focus();
  iframe.contentWindow!.print();
}
