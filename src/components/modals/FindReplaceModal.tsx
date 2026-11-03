import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Search, X, Replace } from 'lucide-react';
import { findTextRanges } from '../../core/editor/search';
import { closeHistory } from '@tiptap/pm/history';

interface FindReplaceModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  editor,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !editor) return null;

  const handleFindNext = () => {
    if (!searchTerm) return;
    const matches = findTextRanges(editor.state.doc, searchTerm, matchCase);

    if (matches.length > 0) {
      const match = matches.find(item => item.from >= editor.state.selection.to) || matches[0];
      editor.chain().setTextSelection(match).scrollIntoView().run();
      setMessage(`Found ${matches.length} occurrences`);
    } else {
      setMessage('No matches found');
    }
  };

  const handleReplaceAll = () => {
    if (!searchTerm) return;
    const matches = findTextRanges(editor.state.doc, searchTerm, matchCase);
    const count = matches.length;

    if (count > 0) {
      const tr = closeHistory(editor.state.tr);
      matches.reverse().forEach(({ from, to }) => {
        if (replaceTerm) {
          const marks = tr.doc.resolve(from).marks();
          tr.replaceWith(from, to, editor.schema.text(replaceTerm, marks));
        } else tr.delete(from, to);
      });
      editor.view.dispatch(tr);
      setMessage(`Replaced ${count} occurrences`);
    } else {
      setMessage('No matches found to replace');
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-bold text-xs text-surface-900 dark:text-surface-100">
            <Search className="w-4 h-4 text-sky-600" />
            <span>Find and Replace</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-surface-700 dark:text-surface-300">Find What:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search text..."
              className="w-full px-3 py-1.5 border border-surface-300 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-surface-700 dark:text-surface-300">Replace With:</label>
            <input
              type="text"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="Replacement text..."
              className="w-full px-3 py-1.5 border border-surface-300 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="matchCase"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="rounded accent-sky-600"
            />
            <label htmlFor="matchCase" className="text-surface-600 dark:text-surface-400">
              Match case
            </label>
          </div>

          {message && (
            <div className="text-[11px] font-medium text-sky-600 dark:text-sky-400 py-1">
              {message}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 flex justify-end space-x-2">
          <button
            onClick={handleFindNext}
            className="px-3 py-1 text-xs rounded border border-surface-300 dark:border-surface-700 hover:bg-surface-200 dark:hover:bg-surface-800"
          >
            Find
          </button>
          <button
            onClick={handleReplaceAll}
            className="px-3 py-1 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-700 text-white"
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
};
