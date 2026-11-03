import TurndownService from 'turndown';

export function exportToMarkdown(htmlContent: string): string {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
  });

  // Keep table formatting clean
  turndownService.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td']);

  return turndownService.turndown(htmlContent);
}
