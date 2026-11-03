import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';

import { PageBreak } from './extensions/PageBreak';
import { Callout } from './extensions/Callout';
import { MathBlock } from './extensions/MathBlock';
import { ResizableImage } from './extensions/ResizableImage';
import { Footnote } from './extensions/Footnote';
import { CommentMark } from './extensions/Comments';
import { SuggestionMark } from './extensions/TrackChanges';

export function getDocCloudExtensions() {
  return [
    StarterKit.configure({
      link: false,
      underline: false,
      undoRedo: {
        depth: 100,
        newGroupDelay: 500,
      },
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      dropcursor: {
        color: '#0284c7',
        width: 2,
      },
    }),
    Underline,
    Subscript,
    Superscript,
    TextStyle,
    FontFamily.configure({
      types: ['textStyle'],
    }),
    Color.configure({
      types: ['textStyle'],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'tableCell', 'tableHeader', 'callout'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'doc-table border-collapse w-full my-4 border border-slate-300 dark:border-slate-700',
      },
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: 'border-b border-slate-200 dark:border-slate-800',
      },
    }),
    TableHeader.configure({
      HTMLAttributes: {
        class: 'bg-slate-100 dark:bg-slate-800 font-semibold p-2.5 text-left border border-slate-300 dark:border-slate-700',
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: 'p-2.5 border border-slate-200 dark:border-slate-800 align-top',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-sky-600 dark:text-sky-400 underline cursor-pointer hover:text-sky-700',
      },
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    CharacterCount,
    PageBreak,
    Callout,
    MathBlock,
    ResizableImage,
    Footnote,
    CommentMark,
    SuggestionMark,
  ];
}
