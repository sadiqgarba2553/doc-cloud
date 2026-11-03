import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Table as TableIcon,
  Image as ImageIcon,
  MessageSquare,
  Sigma,
  Link as LinkIcon,
  Minus,
  Sparkles,
  BookOpen,
  LayoutTemplate,
  AlertCircle,
  Scissors,
} from 'lucide-react';
import { RibbonButton } from '../RibbonButton';

interface InsertTabProps {
  editor: Editor | null;
  onOpenTableModal: () => void;
  onOpenEquationModal: () => void;
  onOpenLinkModal: () => void;
  onOpenSymbolModal: () => void;
  onOpenFootnoteModal: () => void;
  onImageInsertClick: () => void;
}

export const InsertTab: React.FC<InsertTabProps> = ({
  editor,
  onOpenTableModal,
  onOpenEquationModal,
  onOpenLinkModal,
  onOpenSymbolModal,
  onOpenFootnoteModal,
  onImageInsertClick,
}) => {
  if (!editor) return null;

  return (
    <div className="flex items-center space-x-2 py-1 px-1 overflow-x-auto text-surface-700 dark:text-surface-300">
      {/* Tables */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<TableIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="Table"
          variant="large"
          onClick={onOpenTableModal}
          title="Insert Table Grid"
        />
        <div className="flex flex-col space-y-0.5">
          <button
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="text-[10px] px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-left"
          >
            Quick 3x3 Table
          </button>
          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.can().deleteTable()}
            className="text-[10px] px-2 py-0.5 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left disabled:opacity-30 disabled:pointer-events-none"
          >
            Delete Table
          </button>
        </div>
      </div>

      {/* Illustrations & Media */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          label="Picture"
          variant="large"
          onClick={onImageInsertClick}
          title="Insert image from computer or clipboard"
        />
      </div>

      {/* Shapes & Callout Text Boxes */}
      <div className="flex flex-col space-y-0.5 border-r border-surface-200 dark:border-surface-800 pr-2">
        <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-1">Callouts</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => editor.chain().focus().toggleWrap('callout', { type: 'info' }).run()}
            className="px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-800"
            title="Info Callout Box"
          >
            Info
          </button>
          <button
            onClick={() => editor.chain().focus().toggleWrap('callout', { type: 'warning' }).run()}
            className="px-2 py-0.5 text-xs rounded bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800"
            title="Warning Callout Box"
          >
            Warning
          </button>
          <button
            onClick={() => editor.chain().focus().toggleWrap('callout', { type: 'success' }).run()}
            className="px-2 py-0.5 text-xs rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800"
            title="Success Callout Box"
          >
            Success
          </button>
        </div>
      </div>

      {/* Math Equations & Symbols */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<Sigma className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          label="Equation"
          variant="large"
          onClick={onOpenEquationModal}
          title="Insert LaTeX Mathematical Equation"
        />
        <RibbonButton
          icon={<Sparkles className="w-4 h-4 text-amber-500" />}
          label="Symbol"
          variant="large"
          onClick={onOpenSymbolModal}
          title="Insert Special Characters & Symbols"
        />
      </div>

      {/* Links & References */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<LinkIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="Link"
          variant="large"
          isActive={editor.isActive('link')}
          onClick={onOpenLinkModal}
          title="Insert Hyperlink (Ctrl/Cmd + K)"
        />
        <RibbonButton
          icon={<BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />}
          label="Footnote"
          variant="large"
          onClick={onOpenFootnoteModal}
          title="Insert Footnote Reference"
        />
      </div>

      {/* Breaks & Dividers */}
      <div className="flex items-center space-x-1">
        <RibbonButton
          icon={<Scissors className="w-4 h-4 text-rose-500 rotate-90" />}
          label="Page Break"
          variant="large"
          onClick={() => editor.chain().focus().setPageBreak().run()}
          title="Insert Hard Page Break (Ctrl/Cmd + Enter)"
        />
        <RibbonButton
          icon={<Minus className="w-4 h-4" />}
          label="Divider"
          variant="large"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Insert Horizontal Divider Line"
        />
      </div>
    </div>
  );
};
