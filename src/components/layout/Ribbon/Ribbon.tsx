import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { HomeTab } from './Tabs/HomeTab';
import { InsertTab } from './Tabs/InsertTab';
import { LayoutTab } from './Tabs/LayoutTab';
import { ReferencesTab } from './Tabs/ReferencesTab';
import { ReviewTab } from './Tabs/ReviewTab';
import { ViewTab } from './Tabs/ViewTab';
import { HelpTab } from './Tabs/HelpTab';
import { PageSettings } from '../../../types/layout';

export type RibbonTabKey = 'file' | 'home' | 'insert' | 'layout' | 'references' | 'review' | 'view' | 'help';

interface RibbonProps {
  editor: Editor | null;
  settings: PageSettings;
  onUpdateSettings: (updater: (prev: PageSettings) => PageSettings) => void;
  onOpenFileTab: () => void;
  onOpenPageSetup: () => void;
  onOpenFindReplace: () => void;
  onOpenTableModal: () => void;
  onOpenEquationModal: () => void;
  onOpenLinkModal: () => void;
  onOpenSymbolModal: () => void;
  onOpenFootnoteModal: () => void;
  onOpenWordCountModal: () => void;
  onOpenShortcuts: () => void;
  onOpenMatrix: () => void;
  onOpenAbout: () => void;
  onImageInsertClick: () => void;
  formatPainterActive: boolean;
  onToggleFormatPainter: () => void;
  trackChangesMode: boolean;
  onToggleTrackChanges: () => void;
  onOpenNewComment: () => void;
  onToggleCommentsSidebar: () => void;
  commentsSidebarOpen: boolean;
  onAcceptAllSuggestions: () => void;
  onRejectAllSuggestions: () => void;
  hasPendingSuggestions: boolean;
  showRulers: boolean;
  onToggleRulers: () => void;
  showNavSidebar: boolean;
  onToggleNavSidebar: () => void;
  showInspector: boolean;
  onToggleInspector: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  theme: 'light' | 'dark' | 'system';
  onThemeToggle: () => void;
}

export const Ribbon: React.FC<RibbonProps> = ({
  editor,
  settings,
  onUpdateSettings,
  onOpenFileTab,
  onOpenPageSetup,
  onOpenFindReplace,
  onOpenTableModal,
  onOpenEquationModal,
  onOpenLinkModal,
  onOpenSymbolModal,
  onOpenFootnoteModal,
  onOpenWordCountModal,
  onOpenShortcuts,
  onOpenMatrix,
  onOpenAbout,
  onImageInsertClick,
  formatPainterActive,
  onToggleFormatPainter,
  trackChangesMode,
  onToggleTrackChanges,
  onOpenNewComment,
  onToggleCommentsSidebar,
  commentsSidebarOpen,
  onAcceptAllSuggestions,
  onRejectAllSuggestions,
  hasPendingSuggestions,
  showRulers,
  onToggleRulers,
  showNavSidebar,
  onToggleNavSidebar,
  showInspector,
  onToggleInspector,
  zoom,
  onZoomChange,
  theme,
  onThemeToggle,
}) => {
  const [activeTab, setActiveTab] = useState<RibbonTabKey>('home');

  const tabs: { key: RibbonTabKey; label: string; isFile?: boolean }[] = [
    { key: 'file', label: 'File', isFile: true },
    { key: 'home', label: 'Home' },
    { key: 'insert', label: 'Insert' },
    { key: 'layout', label: 'Layout' },
    { key: 'references', label: 'References' },
    { key: 'review', label: 'Review' },
    { key: 'view', label: 'View' },
    { key: 'help', label: 'Help' },
  ];

  return (
    <div className="bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 shadow-sm flex flex-col select-none z-20">
      {/* Tab Strip */}
      <div className="flex items-center px-2 pt-1 space-x-1 border-b border-surface-200/60 dark:border-surface-800/60">
        {tabs.map((t) => {
          if (t.isFile) {
            return (
              <button
                key={t.key}
                onClick={onOpenFileTab}
                className="px-3.5 py-1 text-xs font-bold rounded-t text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-sm mb-0.5"
              >
                {t.label}
              </button>
            );
          }

          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1 text-xs font-medium rounded-t transition-all ${
                isActive
                  ? 'bg-white dark:bg-surface-850 text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-600 dark:border-sky-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="h-16 px-2 flex items-center bg-white dark:bg-surface-850">
        {activeTab === 'home' && (
          <HomeTab
            editor={editor}
            onOpenFindReplace={onOpenFindReplace}
            formatPainterActive={formatPainterActive}
            onToggleFormatPainter={onToggleFormatPainter}
          />
        )}
        {activeTab === 'insert' && (
          <InsertTab
            editor={editor}
            onOpenTableModal={onOpenTableModal}
            onOpenEquationModal={onOpenEquationModal}
            onOpenLinkModal={onOpenLinkModal}
            onOpenSymbolModal={onOpenSymbolModal}
            onOpenFootnoteModal={onOpenFootnoteModal}
            onImageInsertClick={onImageInsertClick}
          />
        )}
        {activeTab === 'layout' && (
          <LayoutTab
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onOpenPageSetup={onOpenPageSetup}
          />
        )}
        {activeTab === 'references' && (
          <ReferencesTab
            editor={editor}
            onOpenFootnoteModal={onOpenFootnoteModal}
          />
        )}
        {activeTab === 'review' && (
          <ReviewTab
            editor={editor}
            onOpenWordCountModal={onOpenWordCountModal}
            trackChangesMode={trackChangesMode}
            onToggleTrackChanges={onToggleTrackChanges}
            onOpenNewComment={onOpenNewComment}
            onToggleCommentsSidebar={onToggleCommentsSidebar}
            commentsSidebarOpen={commentsSidebarOpen}
            onAcceptAllSuggestions={onAcceptAllSuggestions}
            onRejectAllSuggestions={onRejectAllSuggestions}
            hasPendingSuggestions={hasPendingSuggestions}
          />
        )}
        {activeTab === 'view' && (
          <ViewTab
            showRulers={showRulers}
            onToggleRulers={onToggleRulers}
            showNavSidebar={showNavSidebar}
            onToggleNavSidebar={onToggleNavSidebar}
            showInspector={showInspector}
            onToggleInspector={onToggleInspector}
            zoom={zoom}
            onZoomChange={onZoomChange}
            theme={theme}
            onThemeToggle={onThemeToggle}
          />
        )}
        {activeTab === 'help' && (
          <HelpTab
            onOpenShortcuts={onOpenShortcuts}
            onOpenMatrix={onOpenMatrix}
            onOpenAbout={onOpenAbout}
          />
        )}
      </div>
    </div>
  );
};
