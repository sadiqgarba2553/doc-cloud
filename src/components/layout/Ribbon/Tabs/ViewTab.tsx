import React from 'react';
import {
  Ruler,
  PanelLeft,
  PanelRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Moon,
  Sun,
} from 'lucide-react';
import { RibbonButton } from '../RibbonButton';

interface ViewTabProps {
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

export const ViewTab: React.FC<ViewTabProps> = ({
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
  return (
    <div className="flex items-center space-x-2 py-1 px-1 overflow-x-auto text-surface-700 dark:text-surface-300">
      {/* Show / Hide Elements */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<Ruler className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="Rulers"
          variant="large"
          isActive={showRulers}
          onClick={onToggleRulers}
          title="Toggle Horizontal and Vertical Rulers"
        />
        <RibbonButton
          icon={<PanelLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          label="Navigation"
          variant="large"
          isActive={showNavSidebar}
          onClick={onToggleNavSidebar}
          title="Toggle Document Outline Sidebar"
        />
        <RibbonButton
          icon={<PanelRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          label="Inspector"
          variant="large"
          isActive={showInspector}
          onClick={onToggleInspector}
          title="Toggle Formatting Inspector Panel"
        />
      </div>

      {/* Theme Appearance */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          label={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          variant="large"
          onClick={onThemeToggle}
          title="Switch Appearance Theme"
        />
      </div>

      {/* Zoom Controls */}
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-1">Zoom: {Math.round(zoom * 100)}%</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
            className="p-1 rounded hover:bg-surface-200/70 dark:hover:bg-surface-800 text-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onZoomChange(1.0)}
            className="px-2 py-0.5 text-xs rounded border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 font-medium"
          >
            100%
          </button>
          <button
            onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
            className="p-1 rounded hover:bg-surface-200/70 dark:hover:bg-surface-800 text-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
