import React from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  ZoomIn,
  ZoomOut,
  Globe,
  Sliders,
} from 'lucide-react';

interface StatusBarProps {
  currentPage: number;
  totalPages: number;
  wordCount: number;
  characterCount: number;
  selectionWords: number;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  saveStatus: 'saved' | 'saving' | 'dirty';
  onOpenWordCountModal: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  currentPage,
  totalPages,
  wordCount,
  characterCount,
  selectionWords,
  zoom,
  onZoomChange,
  saveStatus,
  onOpenWordCountModal,
}) => {
  return (
    <footer className="h-6 bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between px-3 text-[11px] text-surface-600 dark:text-surface-400 select-none z-30 transition-colors">
      {/* Left Metrics */}
      <div className="flex items-center space-x-3">
        <span>
          Page {currentPage} of {totalPages}
        </span>

        <span className="h-3 w-px bg-surface-200 dark:bg-surface-700" />

        <button
          onClick={onOpenWordCountModal}
          className="hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
          title="Click to view detailed document statistics"
        >
          {selectionWords > 0
            ? `${selectionWords} of ${wordCount} words`
            : `${wordCount} words, ${characterCount} chars`}
        </button>

        <span className="h-3 w-px bg-surface-200 dark:bg-surface-700" />

        <div className="flex items-center space-x-1" title="Proofing Language">
          <Globe className="w-3 h-3 text-surface-400" />
          <span>English (US)</span>
        </div>
      </div>

      {/* Right Controls: Save state & Zoom */}
      <div className="flex items-center space-x-3">
        {/* Save State Badge */}
        <div className="flex items-center space-x-1">
          {saveStatus === 'saved' && (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">Saved</span>
            </span>
          )}
          {saveStatus === 'saving' && (
            <span className="text-sky-600 dark:text-sky-400 flex items-center space-x-1 animate-pulse">
              <Clock className="w-3 h-3 animate-spin" />
              <span>Saving...</span>
            </span>
          )}
          {saveStatus === 'dirty' && (
            <span className="text-amber-500 font-medium">Modified</span>
          )}
        </div>

        <span className="h-3 w-px bg-surface-200 dark:bg-surface-700" />

        {/* Zoom Slider */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
            className="p-0.5 hover:text-surface-900 dark:hover:text-surface-100"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>

          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            className="w-20 h-1 bg-surface-200 dark:bg-surface-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />

          <button
            onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
            className="p-0.5 hover:text-surface-900 dark:hover:text-surface-100"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>

          <span
            onClick={() => onZoomChange(1.0)}
            className="w-9 text-right font-mono cursor-pointer hover:underline"
            title="Click to reset to 100%"
          >
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
    </footer>
  );
};
