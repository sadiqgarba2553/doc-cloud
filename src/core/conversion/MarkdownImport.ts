import { marked } from 'marked';

export function importFromMarkdown(markdownText: string): string {
  return marked.parse(markdownText, { async: false }) as string;
}
