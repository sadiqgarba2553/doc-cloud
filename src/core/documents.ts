import DOMPurify from 'dompurify';
import { DocCloudFilePackage } from '../types/document';
import { getDefaultPageSettings } from './layout/PageGeometry';

export function createDocument(title = 'Untitled document', content: any = { type: 'doc', content: [{ type: 'paragraph' }] }): DocCloudFilePackage {
  const now = new Date().toISOString();
  return {
    formatVersion: '1.0.0',
    metadata: { id: crypto.randomUUID(), title, author: 'You', createdAt: now, updatedAt: now, version: '1.0.0', wordCount: 0, characterCount: 0, readingTimeMinutes: 0 },
    settings: { ...getDefaultPageSettings(), format: 'A4' },
    headerFooter: { headerLeft: '', headerCenter: '', headerRight: '', footerLeft: '', footerCenter: '', footerRight: '' },
    content, comments: [], suggestions: [], revisions: [], assets: {},
  };
}

export function sanitizeDocumentHtml(html: string) {
  return DOMPurify.sanitize(html, { ADD_ATTR: ['data-type', 'data-latex', 'data-display-mode', 'data-footnote-index', 'data-footnote-text'], FORBID_TAGS: ['style', 'iframe', 'form', 'input', 'button'], FORBID_ATTR: ['srcset'] });
}

export function plainTextContent(text: string) {
  return { type: 'doc', content: text.split(/\r?\n/).map(line => ({ type: 'paragraph', ...(line ? { content: [{ type: 'text', text: line }] } : {}) })) };
}

export function downloadFile(data: BlobPart, filename: string, type = 'application/octet-stream') {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
