import { TableOfContentsItem } from '../../types/document';

export interface HeadingItem {
  id: string;
  level: number;
  text: string;
}

/**
 * Extracts all headings (levels 1-6) from a ProseMirror document tree
 */
export function extractHeadingsFromContent(docContent: any): HeadingItem[] {
  const headings: HeadingItem[] = [];
  if (!docContent || !Array.isArray(docContent.content)) return headings;

  docContent.content.forEach((block: any, idx: number) => {
    if (block && block.type === 'heading') {
      const level = block.attrs?.level || 1;
      let text = '';
      if (Array.isArray(block.content)) {
        text = block.content
          .map((c: any) => (c.type === 'text' ? c.text || '' : ''))
          .join('');
      }
      if (text.trim()) {
        const id = `heading-${idx}-${text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        headings.push({ id, level, text: text.trim() });
      }
    }
  });

  return headings;
}

/**
 * Generates TableOfContentsItem array with hierarchical structure
 */
export function generateTocItems(docContent: any): TableOfContentsItem[] {
  const headings = extractHeadingsFromContent(docContent);
  return headings.map(h => ({
    id: h.id,
    level: h.level,
    text: h.text,
  }));
}

/**
 * Constructs a ProseMirror block representation for a styled Table of Contents
 */
export function buildTocBlockNode(tocItems: TableOfContentsItem[]): any {
  return {
    type: 'callout',
    attrs: { type: 'note' },
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'TABLE OF CONTENTS',
            marks: [{ type: 'bold' }],
          },
        ],
      },
      ...tocItems.map(item => {
        const indent = '    '.repeat(Math.max(0, item.level - 1));
        return {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `${indent}${item.level > 1 ? '• ' : ''}${item.text}`,
              marks: [{ type: 'italic' }],
            },
          ],
        };
      }),
    ],
  };
}
