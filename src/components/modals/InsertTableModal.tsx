import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Table as TableIcon, X } from 'lucide-react';

interface InsertTableModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InsertTableModal: React.FC<InsertTableModalProps> = ({
  editor,
  isOpen,
  onClose,
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeader, setWithHeader] = useState(true);

  if (!isOpen || !editor) return null;

  const handleInsert = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: Math.max(1, rows),
        cols: Math.max(1, cols),
        withHeaderRow: withHeader,
      })
      .run();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-xl w-full max-w-xs overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-bold text-xs text-surface-900 dark:text-surface-100">
            <TableIcon className="w-4 h-4 text-sky-600" />
            <span>Insert Table</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-surface-700 dark:text-surface-300">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Rows:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value, 10) || 1)}
                className="w-full px-2.5 py-1.5 border border-surface-300 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Columns:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value, 10) || 1)}
                className="w-full px-2.5 py-1.5 border border-surface-300 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="withHeader"
              checked={withHeader}
              onChange={(e) => setWithHeader(e.target.checked)}
              className="rounded accent-sky-600"
            />
            <label htmlFor="withHeader" className="cursor-pointer">
              Include header row
            </label>
          </div>
        </div>

        <div className="px-4 py-2.5 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 text-xs rounded hover:bg-surface-200 dark:hover:bg-surface-800">
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-3 py-1 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-700 text-white"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
};
