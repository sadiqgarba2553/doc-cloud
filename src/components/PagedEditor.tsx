import { useEffect, useState } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { DocCloudFilePackage } from '../types/document';
import { getPageDimensions } from '../core/layout/PageGeometry';
import { paginateBlocks, LayoutBlock } from '../core/layout/BlockPagination';
import { formatHeaderFooterMacro } from '../core/layout/PaginationEngine';

const key = new PluginKey<DecorationSet>('doccloud-pagination');
const GAP = 28;

export function PagedEditor({ editor, doc, zoom, rulers, onPages }: { editor: Editor; doc: DocCloudFilePackage; zoom: number; rulers: boolean; onPages: (pages: number) => void }) {
  const [pages, setPages] = useState(1);
  const [oversized, setOversized] = useState(false);
  const s = doc.settings;
  const dims = getPageDimensions(s.format, s.orientation, s.customWidthMm, s.customHeightMm);
  const bodyHeight = dims.heightPx - s.margins.topPx - s.margins.bottomPx;
  const continuous = !!s.pageless || s.columns > 1;

  useEffect(() => {
    if (continuous) { setPages(1); onPages(1); setOversized(false); return; }
    editor.registerPlugin(new Plugin({
      key,
      state: { init: () => DecorationSet.empty, apply: (tr, value) => tr.getMeta(key) ?? value.map(tr.mapping, tr.doc) },
      props: { decorations: state => key.getState(state) },
    }));
    let frame = 0;
    let signature = '';
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (editor.isDestroyed) return;
        const blocks: LayoutBlock[] = [];
        editor.state.doc.forEach((node, pos) => {
          const element = editor.view.nodeDOM(pos) as HTMLElement | null;
          if (!element?.getBoundingClientRect) return;
          const style = getComputedStyle(element);
          blocks.push({ pos, height: element.getBoundingClientRect().height / zoom + parseFloat(style.marginBottom || '0') + parseFloat(style.marginTop || '0'), pageBreak: node.type.name === 'pageBreak' });
        });
        const result = paginateBlocks(blocks, bodyHeight, s.margins.topPx + s.margins.bottomPx + GAP);
        const nextSignature = JSON.stringify(result);
        if (signature === nextSignature) return;
        signature = nextSignature;
        const decorations = result.gaps.map(gap => Decoration.widget(gap.pos, () => {
          const spacer = document.createElement('div');
          spacer.className = 'pagination-gap';
          spacer.style.height = `${gap.height}px`;
          spacer.contentEditable = 'false';
          spacer.setAttribute('aria-hidden', 'true');
          return spacer;
        }, { side: -1, key: `${gap.pos}:${gap.height}` }));
        editor.view.dispatch(editor.state.tr.setMeta(key, DecorationSet.create(editor.state.doc, decorations)).setMeta('addToHistory', false));
        setPages(result.pages); onPages(result.pages); setOversized(result.oversized);
      });
    };
    const onTransaction = ({ transaction }: any) => { if (transaction.docChanged) measure(); };
    editor.on('transaction', onTransaction);
    const observer = new ResizeObserver(measure);
    observer.observe(editor.view.dom);
    editor.view.dom.addEventListener('load', measure, true);
    measure();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); editor.off('transaction', onTransaction);
      editor.view.dom.removeEventListener('load', measure, true); editor.unregisterPlugin(key);
    };
  }, [editor, doc.metadata.id, bodyHeight, s.margins.topPx, s.margins.bottomPx, zoom, onPages, continuous]);

  if (continuous) return <div className="document-scroll">
    {s.columns > 1 && <div className="layout-warning" role="status">Columns use a continuous preview. Physical page breaks are applied when printing.</div>}
    <div className="page-content continuous-paper" data-layout={s.pageless ? 'pageless' : 'columns'} style={{ background: 'white', margin: '0 auto', width: s.pageless ? '100%' : dims.widthPx * zoom, maxWidth: s.pageless ? 1100 : undefined, minHeight: '80vh', padding: 48, fontSize: `${zoom}em` }}>
      <EditorContent editor={editor} style={{ columnCount: s.columns, columnGap: `${s.columnGapMm}mm` }} />
    </div>
  </div>;

  const fullHeight = pages * dims.heightPx + (pages - 1) * GAP;
  return <div className="document-scroll">
    {oversized && <div className="layout-warning" role="status">A block is taller than a page. Split long paragraphs or tables for accurate page layout.</div>}
    <div className="paper-container" style={{ width: dims.widthPx * zoom, minHeight: fullHeight * zoom + 48 }}>
      <div className="paper-scale" style={{ width: dims.widthPx, transform: `scale(${zoom})` }}>
        {rulers && <div className="paper-ruler" aria-label="Page ruler">{Array.from({ length: Math.floor(dims.widthMm / 10) }, (_, i) => <span key={i}>{i + 1}</span>)}</div>}
        <div className="page-stack" style={{ height: fullHeight }}>
          {Array.from({ length: pages }, (_, i) => <div key={i} className="paper-sheet" data-page={i + 1} style={{ top: i * (dims.heightPx + GAP), height: dims.heightPx }}>
            <div className="paper-header" style={{ left: s.margins.leftPx, right: s.margins.rightPx, height: s.margins.topPx }}>
              {[doc.headerFooter.headerLeft, doc.headerFooter.headerCenter, doc.headerFooter.headerRight].map((text, n) => <span key={n}>{formatHeaderFooterMacro(s.differentFirstPage && i === 0 ? '' : text, i + 1, pages, doc.metadata.title)}</span>)}
            </div>
            {s.watermark?.enabled && <div className="paper-watermark" style={{ color: s.watermark.color, opacity: s.watermark.opacity, transform: `rotate(${s.watermark.angle}deg)`, fontSize: `${s.watermark.fontSizePt}pt` }}>{s.watermark.text}</div>}
            <div className="paper-footer" style={{ left: s.margins.leftPx, right: s.margins.rightPx, height: s.margins.bottomPx }}>
              {[doc.headerFooter.footerLeft, doc.headerFooter.footerCenter, doc.headerFooter.footerRight].map((text, n) => <span key={n}>{formatHeaderFooterMacro(s.differentFirstPage && i === 0 ? '' : text, i + 1, pages, doc.metadata.title)}</span>)}
            </div>
          </div>)}
          <div className={`page-content ${s.lineNumbers ? 'number-blocks' : ''}`} style={{ paddingTop: s.margins.topPx, paddingLeft: s.margins.leftPx, paddingRight: s.margins.rightPx }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  </div>;
}
