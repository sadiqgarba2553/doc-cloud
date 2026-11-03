import { Node, mergeAttributes } from '@tiptap/core';

export interface FootnoteOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    footnote: {
      insertFootnote: (text: string) => ReturnType;
    };
  }
}

export const Footnote = Node.create<FootnoteOptions>({
  name: 'footnote',
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      index: {
        default: 1,
        parseHTML: element => parseInt(element.getAttribute('data-footnote-index') || '1', 10),
        renderHTML: attributes => ({
          'data-footnote-index': attributes.index,
        }),
      },
      text: {
        default: '',
        parseHTML: element => element.getAttribute('data-footnote-text') || '',
        renderHTML: attributes => ({
          'data-footnote-text': attributes.text,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'sup[data-type="footnote"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'sup',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'footnote',
        class: 'doc-footnote-ref text-sky-600 dark:text-sky-400 font-semibold cursor-pointer px-0.5 hover:underline',
        title: node.attrs.text || 'Footnote',
      }),
      `[${node.attrs.index}]`,
    ];
  },

  addCommands() {
    return {
      insertFootnote:
        text =>
        ({ chain, state }) => {
          // Count existing footnotes in document
          let count = 0;
          state.doc.descendants(node => {
            if (node.type.name === 'footnote') {
              count++;
            }
          });
          return chain()
            .insertContent({
              type: this.name,
              attrs: {
                index: count + 1,
                text,
              },
            })
            .run();
        },
    };
  },
});
