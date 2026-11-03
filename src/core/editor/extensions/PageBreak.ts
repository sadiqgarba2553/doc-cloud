import { Node, mergeAttributes } from '@tiptap/core';

export interface PageBreakOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType;
    };
  }
}

export const PageBreak = Node.create<PageBreakOptions>({
  name: 'pageBreak',
  priority: 1000,
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="page-break"]',
      },
      {
        tag: 'hr.page-break',
      },
      {
        tag: 'div[style*="page-break-after"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'page-break',
        class: 'doc-page-break my-6 py-2 flex items-center justify-center select-none print:break-after-page',
      }),
      [
        'div',
        { class: 'w-full border-t border-dashed border-sky-400 dark:border-sky-500 relative flex justify-center items-center' },
        [
          'span',
          { class: 'absolute bg-white dark:bg-surface-900 px-3 py-0.5 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest rounded border border-sky-200 dark:border-sky-800' },
          'Page Break',
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain }) => {
          return chain().insertContent([{ type: this.name }, { type: 'paragraph' }]).run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.setPageBreak(),
    };
  },
});
