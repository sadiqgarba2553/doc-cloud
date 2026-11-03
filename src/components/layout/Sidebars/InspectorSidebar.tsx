import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Sliders,
  Table as TableIcon,
  Image as ImageIcon,
  Palette,
  X,
  Plus,
  Trash2,
  Combine,
  Split,
} from 'lucide-react';
import { PageSettings } from '../../../types/layout';

interface InspectorSidebarProps {
  editor: Editor | null;
  settings: PageSettings;
  isOpen: boolean;
  onClose: () => void;
  onOpenPageSetup: () => void;
}

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  editor,
  settings,
  isOpen,
  onClose,
  onOpenPageSetup,
}) => {
  if (!isOpen || !editor) return null;

  const isTableActive = editor.isActive('table');
  const isImageActive = editor.isActive('resizableImage');

  return (
    <aside className="w-64 bg-white dark:bg-surface-900 border-l border-surface-200 dark:border-surface-800 flex flex-col select-none z-10 transition-colors shadow-sm">
      {/* Header */}
      <div className="h-10 px-3 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-surface-800 dark:text-surface-200 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5 text-sky-600" />
          <span>Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500"
          title="Close Inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {isImageActive && <div className="space-y-3 p-3 rounded-lg border border-surface-200 dark:border-surface-800">
          <strong>Image properties</strong>
          <label className="block">Width (pixels)<input aria-label="Image width" type="number" min="24" max="2000" value={parseInt(editor.getAttributes('resizableImage').width) || 460} onChange={e => { const width = Number(e.target.value); if (width >= 24 && width <= 2000) editor.commands.updateAttributes('resizableImage', { width }); }} className="w-full border rounded p-1 bg-transparent" /></label>
          <label className="block">Alternative text<input aria-label="Image alternative text" value={editor.getAttributes('resizableImage').alt || ''} onChange={e => editor.commands.updateAttributes('resizableImage', { alt: e.target.value })} className="w-full border rounded p-1 bg-transparent" /></label>
          <label className="block">Caption<input aria-label="Image caption" value={editor.getAttributes('resizableImage').caption || ''} onChange={e => editor.commands.updateAttributes('resizableImage', { caption: e.target.value })} className="w-full border rounded p-1 bg-transparent" /></label>
        </div>}
        {/* Table Properties (shown when cursor is inside table) */}
        {isTableActive && (
          <div className="p-3 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/40 space-y-2.5">
            <div className="flex items-center space-x-1 font-bold text-sky-600 dark:text-sky-400">
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table Properties</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className="px-2 py-1 rounded bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 text-left"
              >
                + Row Above
              </button>
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="px-2 py-1 rounded bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 text-left"
              >
                + Row Below
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className="px-2 py-1 rounded bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 text-left"
              >
                + Col Left
              </button>
              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="px-2 py-1 rounded bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 text-left"
              >
                + Col Right
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="px-2 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 text-left"
              >
                Delete Row
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="px-2 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 text-left"
              >
                Delete Column
              </button>
            </div>

            <div className="flex items-center space-x-1.5 pt-1">
              <button
                onClick={() => editor.chain().focus().mergeCells().run()}
                disabled={!editor.can().mergeCells()}
                className="flex-1 px-2 py-1 rounded bg-surface-200 dark:bg-surface-800 disabled:opacity-40 text-center"
              >
                Merge Cells
              </button>
              <button
                onClick={() => editor.chain().focus().splitCell().run()}
                disabled={!editor.can().splitCell()}
                className="flex-1 px-2 py-1 rounded bg-surface-200 dark:bg-surface-800 disabled:opacity-40 text-center"
              >
                Split Cell
              </button>
            </div>
          </div>
        )}

        {/* Page Information Quick Overview */}
        <div className="p-3 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/40 space-y-2">
          <div className="flex items-center justify-between font-bold text-surface-800 dark:text-surface-200">
            <span>Page Geometry</span>
            <button
              onClick={onOpenPageSetup}
              className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
            >
              Configure
            </button>
          </div>

          <div className="space-y-1 text-surface-600 dark:text-surface-400 text-[11px]">
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-semibold text-surface-900 dark:text-surface-100">{settings.format}</span>
            </div>
            <div className="flex justify-between">
              <span>Orientation:</span>
              <span className="font-semibold text-surface-900 dark:text-surface-100 capitalize">{settings.orientation}</span>
            </div>
            <div className="flex justify-between">
              <span>Preset:</span>
              <span className="font-semibold text-surface-900 dark:text-surface-100 capitalize">{settings.marginPreset}</span>
            </div>
            <div className="flex justify-between">
              <span>Columns:</span>
              <span className="font-semibold text-surface-900 dark:text-surface-100">{settings.columns} Column</span>
            </div>
            <div className="flex justify-between">
              <span>Watermark:</span>
              <span className="font-semibold text-surface-900 dark:text-surface-100">
                {settings.watermark?.enabled ? settings.watermark.text : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
