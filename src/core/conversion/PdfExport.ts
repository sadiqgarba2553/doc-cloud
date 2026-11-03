import { PageSettings, HeaderFooterContent } from '../../types/layout';
import { exportToHtmlDocument } from './HtmlExport';

export function triggerPrintDocument(
  htmlContent: string,
  settings: PageSettings,
  headerFooter?: HeaderFooterContent,
  title: string = 'Document'
) {
  const completeHtml = exportToHtmlDocument(htmlContent, settings, headerFooter, title);

  // Create an invisible iframe to isolate print styles without breaking current UI
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(completeHtml);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 250);
}
