import React, { useState } from 'react';
import {
  FilePlus,
  FolderOpen,
  Search,
  Pin,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  AlertTriangle,
  FileText,
  User,
  Mail,
  BookOpen,
  Briefcase,
  CheckSquare,
  Receipt,
  X,
} from 'lucide-react';
import { RecentDocumentItem, RecoverySnapshot } from '../../../types/document';
import { TEMPLATES } from '../../../core/templates';
import { DocumentTemplate } from '../../../types/templates';

interface HomeHubProps {
  isOpen: boolean;
  onClose: () => void;
  onNewBlank: () => void;
  onSelectTemplate: (template: DocumentTemplate) => void;
  onOpenFile: () => void;
  recents: RecentDocumentItem[];
  onOpenRecent: (item: RecentDocumentItem) => void;
  onRemoveRecent: (id: string) => void;
  recoverySnapshots: RecoverySnapshot[];
  onRestoreSnapshot: (snapshot: RecoverySnapshot) => void;
}

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  File: <FilePlus className="w-5 h-5 text-sky-600" />,
  User: <User className="w-5 h-5 text-emerald-600" />,
  Mail: <Mail className="w-5 h-5 text-blue-600" />,
  BookOpen: <BookOpen className="w-5 h-5 text-purple-600" />,
  Briefcase: <Briefcase className="w-5 h-5 text-amber-600" />,
  CheckSquare: <CheckSquare className="w-5 h-5 text-teal-600" />,
  Receipt: <Receipt className="w-5 h-5 text-rose-600" />,
};

export const HomeHub: React.FC<HomeHubProps> = ({
  isOpen,
  onClose,
  onNewBlank,
  onSelectTemplate,
  onOpenFile,
  recents,
  onOpenRecent,
  onRemoveRecent,
  recoverySnapshots,
  onRestoreSnapshot,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filteredRecents = recents.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.previewText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between bg-surface-50/70 dark:bg-surface-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-surface-900 dark:text-surface-100 leading-tight">Doc Cloud</h1>
              <p className="text-[11px] text-surface-500">Free, Local-First Desktop Word Processor</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-500 transition-colors"
              title="Close Home Hub"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-6 py-3 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between gap-4 bg-white dark:bg-surface-900">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-surface-400" />
            <input
              type="text"
              placeholder="Search documents and templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenFile}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-800 dark:text-surface-200 transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Open Document</span>
            </button>
            <button
              onClick={() => {
                onNewBlank();
                onClose();
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-colors"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Blank Document</span>
            </button>
          </div>
        </div>

        {/* Body Layout: Left Templates, Right Recents & Recovery */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-surface-200 dark:divide-surface-800">
          {/* Templates Section (7 cols) */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Professional Templates</span>
              </h2>

              {/* Categories */}
              <div className="flex items-center space-x-1 text-xs">
                {['All', 'General', 'Business', 'Academic', 'Personal'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-semibold'
                        : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-950/30 hover:border-sky-500 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="p-2 rounded-lg bg-white dark:bg-surface-800 shadow-sm border border-surface-200 dark:border-surface-700">
                        {TEMPLATE_ICONS[template.iconName] || <FileText className="w-5 h-5 text-sky-600" />}
                      </div>
                      <h3 className="text-xs font-bold text-surface-900 dark:text-surface-100 group-hover:text-sky-600 transition-colors">
                        {template.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-surface-500 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-surface-200/60 dark:border-surface-800/60 flex items-center justify-between text-[10px] text-surface-400">
                    <span className="font-medium text-sky-600 dark:text-sky-400">{template.category}</span>
                    <span className="group-hover:translate-x-1 transition-transform">Use Template →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recents & Recovery Section (5 cols) */}
          <div className="lg:col-span-5 p-6 overflow-y-auto space-y-6 bg-surface-50/30 dark:bg-surface-950/20">
            {/* Crash Recovery Snapshots if any exist */}
            {recoverySnapshots.length > 0 && (
              <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50/70 dark:bg-amber-950/30 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Unsaved Work Recovered</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-normal">
                  Doc Cloud detected unsaved changes from an unexpected session close.
                </p>
                {recoverySnapshots.map((snap) => (
                  <div
                    key={snap.id}
                    onClick={() => {
                      onRestoreSnapshot(snap);
                      onClose();
                    }}
                    className="p-2 rounded bg-white dark:bg-surface-800 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-surface-900 dark:text-surface-100">{snap.title}</h4>
                      <span className="text-[10px] text-surface-400">
                        {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-amber-600 hover:underline">Restore</span>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Documents */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>Recent Documents</span>
                </h2>
                <span className="text-[11px] text-surface-400">{filteredRecents.length} files</span>
              </div>

              {filteredRecents.length === 0 ? (
                <div className="text-center py-8 text-surface-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-xs">No recent documents found.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredRecents.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-850 hover:border-sky-400 dark:hover:border-sky-600 flex items-center justify-between group transition-colors cursor-pointer"
                      onClick={() => {
                        onOpenRecent(item);
                        onClose();
                      }}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <FileText className="w-4 h-4 text-sky-600 flex-shrink-0" />
                        <div className="truncate">
                          <h4 className="text-xs font-semibold text-surface-800 dark:text-surface-200 truncate group-hover:text-sky-600 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-surface-400">
                            {item.wordCount} words • {new Date(item.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveRecent(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-surface-400 hover:text-rose-500 rounded transition-all"
                        title="Remove from recents"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
