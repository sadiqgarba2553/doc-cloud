import { Mark, mergeAttributes } from '@tiptap/core';

export interface SuggestionOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    suggestion: {
      setSuggestion: (attributes: {
        id: string;
        type: 'insert' | 'delete';
        author: string;
        avatarColor?: string;
        createdAt?: string;
      }) => ReturnType;
      unsetSuggestion: () => ReturnType;
    };
  }
}

export const SuggestionMark = Mark.create<SuggestionOptions>({
  name: 'suggestion',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-suggestion-id'),
        renderHTML: attributes => ({
          'data-suggestion-id': attributes.id,
        }),
      },
      type: {
        default: 'insert',
        parseHTML: element => element.getAttribute('data-suggestion-type') || 'insert',
        renderHTML: attributes => ({
          'data-suggestion-type': attributes.type,
        }),
      },
      author: {
        default: 'Anonymous',
        parseHTML: element => element.getAttribute('data-suggestion-author') || 'Anonymous',
        renderHTML: attributes => ({
          'data-suggestion-author': attributes.author,
        }),
      },
      avatarColor: {
        default: '#10b981',
        parseHTML: element => element.getAttribute('data-author-color') || '#10b981',
        renderHTML: attributes => ({
          'data-author-color': attributes.avatarColor,
        }),
      },
      createdAt: {
        default: () => new Date().toISOString(),
        parseHTML: element => element.getAttribute('data-created-at'),
        renderHTML: attributes => ({
          'data-created-at': attributes.createdAt,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-suggestion-id]',
      },
      {
        tag: 'ins.doc-suggestion',
        getAttrs: () => ({ type: 'insert' }),
      },
      {
        tag: 'del.doc-suggestion',
        getAttrs: () => ({ type: 'delete' }),
      },
    ];
  },

  renderHTML({ mark, HTMLAttributes }) {
    const isInsert = mark.attrs.type === 'insert';
    const tag = isInsert ? 'ins' : 'del';
    const classes = isInsert
      ? 'doc-suggestion-insert bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 underline decoration-emerald-500 underline-offset-2 px-0.5 rounded cursor-pointer'
      : 'doc-suggestion-delete bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 line-through decoration-rose-500 px-0.5 rounded cursor-pointer opacity-70';

    return [
      tag,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `doc-suggestion ${classes}`,
        title: `Suggested by ${mark.attrs.author}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setSuggestion:
        attributes =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      unsetSuggestion:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
