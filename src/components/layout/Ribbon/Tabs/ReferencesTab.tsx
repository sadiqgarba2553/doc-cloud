import React from 'react';
import { Editor } from '@tiptap/react';
import { ListTree, BookOpen, Quote, Bookmark } from 'lucide-react';
import { RibbonButton } from '../RibbonButton';

interface ReferencesTabProps {
  editor: Editor | null;
  onOpenFootnoteModal: () => void;
}

export const ReferencesTab: React.FC<ReferencesTabProps> = ({
  editor,
  onOpenFootnoteModal,
}) => {
  if (!editor) return null;

  const insertTableOfContents = () => {
    // Generate TOC from headings in doc
    const headings: { level: number; text: string }[] = [];
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'heading') {
        headings.push({ level: node.attrs.level, text: node.textContent });
      }
    });

    if (headings.length === 0) {
      alert('No headings found in document! Add Heading 1, 2, or 3 styles to generate a Table of Contents.');
      return;
    }

    const tocHtml = `
      <div class="doc-toc my-4 p-4 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <h3 class="font-bold text-sm uppercase tracking-wider text-sky-700 dark:text-sky-300 mb-2">Table of Contents</h3>
        <ul class="list-none space-y-1 pl-0">
          ${headings
            .map(
              (h) => `
            <li class="text-xs text-surface-700 dark:text-surface-300" style="padding-left: ${(h.level - 1) * 16}px">
              • ${h.text}
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
    `;

    editor.chain().focus().insertContent(tocHtml).run();
  };

  return (
    <div className="flex items-center space-x-2 py-1 px-1 overflow-x-auto text-surface-700 dark:text-surface-300">
      {/* Table of Contents */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<ListTree className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="Table of Contents"
          variant="large"
          onClick={insertTableOfContents}
          title="Generate Table of Contents from Document Headings"
        />
      </div>

      {/* Footnotes */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          label="Insert Footnote"
          variant="large"
          onClick={onOpenFootnoteModal}
          title="Insert Footnote (Alt+Ctrl+F)"
        />
      </div>

      {/* Citations */}
      <div className="flex items-center space-x-1">
        <RibbonButton
          icon={<Quote className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          label="Insert Citation"
          variant="large"
          onClick={() => {
            const cite = prompt('Enter Citation (e.g. [Knuth 1984, p. 45]):');
            if (cite) {
              editor.chain().focus().insertContent(` <em>(${cite})</em> `).run();
            }
          }}
          title="Insert Bibliographic Citation"
        />
      </div>
    </div>
  );
};
