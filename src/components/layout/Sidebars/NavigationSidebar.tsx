import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { ListTree, FileText, Search, X } from 'lucide-react';

interface NavigationSidebarProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  editor,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'headings' | 'pages' | 'search'>('headings');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Extract headings
  const headings: { level: number; text: string; pos: number }[] = [];
  if (editor) {
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        headings.push({
          level: node.attrs.level,
          text: node.textContent || 'Untitled Heading',
          pos,
        });
      }
    });
  }

  const handleHeadingClick = (pos: number) => {
    if (!editor) return;
    editor.chain().focus().setTextSelection(pos).run();
  };

  return (
    <aside className="w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 flex flex-col select-none z-10 transition-colors">
      {/* Header */}
      <div className="h-10 px-3 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
        <span className="text-xs font-bold text-surface-800 dark:text-surface-200 uppercase tracking-wider">
          Navigation
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500"
          title="Close Navigation Sidebar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('headings')}
          className={`flex-1 py-1.5 flex items-center justify-center space-x-1 border-b-2 transition-colors ${
            activeTab === 'headings'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-semibold'
              : 'border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'
          }`}
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>Headings</span>
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-1.5 flex items-center justify-center space-x-1 border-b-2 transition-colors ${
            activeTab === 'pages'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-semibold'
              : 'border-transparent text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Pages</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'headings' && (
          <div className="space-y-1">
            {headings.length === 0 ? (
              <p className="text-xs text-surface-400 italic text-center py-4">
                No headings found. Add headings to navigate sections easily.
              </p>
            ) : (
              headings.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleHeadingClick(h.pos)}
                  style={{ paddingLeft: `${(h.level - 1) * 12 + 8}px` }}
                  className="w-full text-left py-1 pr-2 text-xs rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 truncate transition-colors"
                >
                  {h.text}
                </button>
              ))
            )}
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-3 flex flex-col items-center">
            {/* Page 1 Thumbnail card */}
            <div className="w-36 h-48 border border-surface-300 dark:border-surface-700 rounded bg-white dark:bg-surface-800 shadow-sm p-2 flex flex-col justify-between cursor-pointer hover:border-sky-500 transition-colors">
              <div className="space-y-1 opacity-50">
                <div className="h-1.5 bg-surface-300 dark:bg-surface-600 rounded w-3/4" />
                <div className="h-1 bg-surface-200 dark:bg-surface-700 rounded w-full" />
                <div className="h-1 bg-surface-200 dark:bg-surface-700 rounded w-5/6" />
                <div className="h-1 bg-surface-200 dark:bg-surface-700 rounded w-4/5" />
              </div>
              <span className="text-[10px] text-center text-surface-400">Page 1</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
