import { Node, mergeAttributes } from '@tiptap/core';
import katex from 'katex';

export interface MathBlockOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mathBlock: {
      setMathBlock: (attributes: { latex: string; displayMode?: boolean }) => ReturnType;
    };
  }
}

export const MathBlock = Node.create<MathBlockOptions>({
  name: 'mathBlock',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      latex: {
        default: 'E = mc^2',
        parseHTML: element => element.getAttribute('data-latex') || 'E = mc^2',
        renderHTML: attributes => ({
          'data-latex': attributes.latex,
        }),
      },
      displayMode: {
        default: true,
        parseHTML: element => element.getAttribute('data-display-mode') !== 'false',
        renderHTML: attributes => ({
          'data-display-mode': attributes.displayMode,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="math-block"]',
      },
      {
        tag: 'span[data-type="math-inline"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const latex = node.attrs.latex || '';
    let renderedHtml = '';
    try {
      renderedHtml = katex.renderToString(latex, {
        displayMode: node.attrs.displayMode ?? true,
        throwOnError: false,
      });
    } catch (e) {
      renderedHtml = `<span class="text-rose-500 font-mono text-xs">LaTeX Error: ${latex}</span>`;
    }

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'math-block',
        class: 'doc-math-block my-4 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex justify-center items-center cursor-pointer hover:border-sky-400 transition-colors',
      }),
      ['span', { class: 'math-rendered' }, latex],
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.className = 'doc-math-block';
      dom.setAttribute('data-type', 'math-block');
      const render = (value: typeof node) => {
        dom.setAttribute('data-latex', value.attrs.latex);
        katex.render(value.attrs.latex, dom, { displayMode: value.attrs.displayMode, throwOnError: false });
      };
      render(node);
      return { dom, update(next) { if (next.type !== node.type) return false; render(next); return true; } };
    };
  },

  addCommands() {
    return {
      setMathBlock:
        attributes =>
        ({ chain }) => {
          return chain().insertContent({ type: this.name, attrs: attributes }).run();
        },
    };
  },
});
