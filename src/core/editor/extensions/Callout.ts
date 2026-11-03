import { Node, mergeAttributes } from '@tiptap/core';

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes?: { type?: string; color?: string }) => ReturnType;
      toggleCallout: (attributes?: { type?: string; color?: string }) => ReturnType;
    };
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: element => element.getAttribute('data-callout-type') || 'info',
        renderHTML: attributes => ({
          'data-callout-type': attributes.type,
        }),
      },
      color: {
        default: 'blue',
        parseHTML: element => element.getAttribute('data-color') || 'blue',
        renderHTML: attributes => ({
          'data-color': attributes.color,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
      {
        tag: 'aside.doc-callout',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const type = node.attrs.type || 'info';
    
    // Theme mappings
    const typeStyles: Record<string, string> = {
      info: 'bg-blue-50 border-blue-500 text-blue-950 dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-200',
      warning: 'bg-amber-50 border-amber-500 text-amber-950 dark:bg-amber-950/40 dark:border-amber-500 dark:text-amber-200',
      success: 'bg-emerald-50 border-emerald-500 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-200',
      note: 'bg-purple-50 border-purple-500 text-purple-950 dark:bg-purple-950/40 dark:border-purple-500 dark:text-purple-200',
      quote: 'bg-slate-50 border-slate-500 text-slate-900 dark:bg-slate-900/60 dark:border-slate-500 dark:text-slate-200',
    };

    const styleClass = typeStyles[type] || typeStyles.info;

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'callout',
        class: `doc-callout my-4 p-4 rounded-lg border-l-4 shadow-sm ${styleClass}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setCallout:
        attributes =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attributes);
        },
      toggleCallout:
        attributes =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, attributes);
        },
    };
  },
});
