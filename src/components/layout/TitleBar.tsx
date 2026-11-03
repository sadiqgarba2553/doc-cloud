import React, { useState } from 'react';
import {
  FileText,
  Save,
  RotateCcw,
  RotateCw,
  Printer,
  Moon,
  Sun,
  Laptop,
  Users,
  Settings,
  FolderOpen,
  FilePlus,
  Home,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface TitleBarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  saveStatus: 'saved' | 'saving' | 'dirty';
  onHomeClick: () => void;
  onNewClick: () => void;
  onOpenClick: () => void;
  onSaveClick: () => void;
  onUndoClick: () => void;
  onRedoClick: () => void;
  onPrintClick: () => void;
  canUndo: boolean;
  canRedo: boolean;
  theme: 'light' | 'dark' | 'system';
  onThemeToggle: () => void;
  onCollabClick: () => void;
  onSettingsClick: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  onTitleChange,
  saveStatus,
  onHomeClick,
  onNewClick,
  onOpenClick,
  onSaveClick,
  onUndoClick,
  onRedoClick,
  onPrintClick,
  canUndo,
  canRedo,
  theme,
  onThemeToggle,
  onCollabClick,
  onSettingsClick,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    } else {
      setTempTitle(title);
    }
  };

  return (
    <header className="h-11 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-3 select-none z-30 transition-colors">
      {/* Left: Brand & Quick Access */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onHomeClick}
          title="Doc Cloud Home Hub"
          className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-sky-600 dark:text-sky-400 font-bold transition-colors group"
        >
          <div className="w-6 h-6 rounded bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-semibold text-surface-900 dark:text-surface-100 tracking-tight">Doc Cloud</span>
        </button>

        <div className="h-4 w-px bg-surface-200 dark:bg-surface-800 mx-1" />

        {/* Quick Access Icons */}
        <div className="flex items-center space-x-0.5 text-surface-600 dark:text-surface-400">
          <button
            onClick={onNewClick}
            title="New Document (Ctrl/Cmd + N)"
            className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
          >
            <FilePlus className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenClick}
            title="Open Document (Ctrl/Cmd + O)"
            className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
          <button
            onClick={onSaveClick}
            title="Save Document (Ctrl/Cmd + S)"
            className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={onUndoClick}
            disabled={!canUndo}
            title="Undo (Ctrl/Cmd + Z)"
            className={`p-1.5 rounded transition-colors ${
              canUndo
                ? 'hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onRedoClick}
            disabled={!canRedo}
            title="Redo (Ctrl/Cmd + Y / Shift+Cmd+Z)"
            className={`p-1.5 rounded transition-colors ${
              canRedo
                ? 'hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={onPrintClick}
            title="Print / Export PDF (Ctrl/Cmd + P)"
            className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Document Title & Save Status */}
      <div className="flex items-center space-x-2 max-w-md">
        {isEditingTitle ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setTempTitle(title);
                setIsEditingTitle(false);
              }
            }}
            autoFocus
            className="px-2 py-0.5 text-sm font-medium border border-sky-500 rounded bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 outline-none w-64 text-center"
          />
        ) : (
          <div
            onClick={() => {
              setTempTitle(title);
              setIsEditingTitle(true);
            }}
            title="Click to rename document"
            className="px-2 py-0.5 text-sm font-medium text-surface-800 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 rounded cursor-pointer transition-colors truncate max-w-xs"
          >
            {title}
          </div>
        )}

        {/* Save State Indicator */}
        <div className="flex items-center text-xs">
          {saveStatus === 'saved' && (
            <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400" title="All changes saved to disk">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved</span>
            </span>
          )}
          {saveStatus === 'saving' && (
            <span className="flex items-center space-x-1 text-sky-600 dark:text-sky-400 animate-pulse" title="Saving changes...">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Saving...</span>
            </span>
          )}
          {saveStatus === 'dirty' && (
            <span className="flex items-center space-x-1 text-amber-500" title="Unsaved modifications">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
              <span className="hidden sm:inline">Edited</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions, Theme, Collab, Settings */}
      <div className="flex items-center space-x-1">
        <button
          onClick={onCollabClick}
          className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:hover:bg-sky-900/60 transition-colors"
          title="Real-Time Collaboration"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Collaborate</span>
        </button>

        <button
          onClick={onThemeToggle}
          title={`Switch Theme (Current: ${theme})`}
          className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

        <button
          onClick={onSettingsClick}
          title="Settings & Preferences"
          className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
