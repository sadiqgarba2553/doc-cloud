import { Mark, mergeAttributes } from '@tiptap/core';

export interface CommentOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      setComment: (commentId: string) => ReturnType;
      unsetComment: (commentId: string) => ReturnType;
    };
  }
}

export const CommentMark = Mark.create<CommentOptions>({
  name: 'comment',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-id'),
        renderHTML: attributes => ({
          'data-comment-id': attributes.commentId,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-comment-id]',
      },
      {
        tag: 'mark.doc-comment',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'mark',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'doc-comment bg-amber-200/60 dark:bg-amber-600/30 border-b-2 border-amber-400 dark:border-amber-500 cursor-pointer rounded-px px-0.5 transition-colors hover:bg-amber-300 dark:hover:bg-amber-600/50',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setComment:
        commentId =>
        ({ commands }) => {
          return commands.setMark(this.name, { commentId });
        },
      unsetComment:
        commentId =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
