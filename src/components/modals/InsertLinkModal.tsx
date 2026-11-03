import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Link as LinkIcon, X } from 'lucide-react';

interface InsertLinkModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InsertLinkModal: React.FC<InsertLinkModalProps> = ({
  editor,
  isOpen,
  onClose,
}) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  if (!isOpen || !editor) return null;

  const handleInsert = () => {
    if (url.trim()) {
      let finalUrl = url.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      if (text.trim() && editor.state.selection.empty) {
        editor
          .chain()
          .focus()
          .insertContent({ type: 'text', text: text.trim(), marks: [{ type: 'link', attrs: { href: finalUrl } }] })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: finalUrl })
          .run();
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-bold text-xs text-surface-900 dark:text-surface-100">
            <LinkIcon className="w-4 h-4 text-sky-600" />
            <span>Insert Hyperlink</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-surface-700 dark:text-surface-300">URL Destination:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-1.5 border border-surface-300 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 outline-none focus:border-sky-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-surface-700 dark:text-surface-300">Display Text (optional):</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Link title"
              className="w-full px-3 py-1.5 border border-surface-300 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 outline-none"
            />
          </div>
        </div>

        <div className="px-4 py-2.5 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 text-xs rounded hover:bg-surface-200 dark:hover:bg-surface-800">
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!url.trim()}
            className="px-4 py-1 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-40"
          >
            Insert Link
          </button>
        </div>
      </div>
    </div>
  );
};
