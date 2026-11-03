import React from 'react';
import {
  FileSpreadsheet,
  RotateCcw,
  Maximize2,
  Columns as ColumnsIcon,
  Stamp,
  Sliders,
  Hash,
} from 'lucide-react';
import { PageSettings, PaperFormat, Orientation } from '../../../../types/layout';
import { MARGIN_PRESETS, createPageMargins } from '../../../../core/layout/PageGeometry';
import { RibbonButton } from '../RibbonButton';

interface LayoutTabProps {
  settings: PageSettings;
  onUpdateSettings: (updater: (prev: PageSettings) => PageSettings) => void;
  onOpenPageSetup: () => void;
}

export const LayoutTab: React.FC<LayoutTabProps> = ({
  settings,
  onUpdateSettings,
  onOpenPageSetup,
}) => {
  return (
    <div className="flex items-center space-x-2 py-1 px-1 overflow-x-auto text-surface-700 dark:text-surface-300">
      {/* Margins */}
      <div className="flex flex-col space-y-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-1">Margins</span>
        <div className="flex items-center space-x-1">
          <select
            value={settings.marginPreset}
            onChange={(e) => {
              const preset = e.target.value as any;
              if (preset in MARGIN_PRESETS) {
                const p = MARGIN_PRESETS[preset as keyof typeof MARGIN_PRESETS];
                onUpdateSettings((prev) => ({
                  ...prev,
                  marginPreset: preset,
                  margins: createPageMargins(p.top, p.bottom, p.left, p.right),
                }));
              } else {
                onOpenPageSetup();
              }
            }}
            className="h-6 px-1.5 text-xs bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded text-surface-900 dark:text-surface-100 outline-none w-28"
          >
            <option value="normal">Normal (1")</option>
            <option value="narrow">Narrow (0.5")</option>
            <option value="moderate">Moderate</option>
            <option value="wide">Wide (2")</option>
            <option value="custom">Custom...</option>
          </select>
          <button
            onClick={onOpenPageSetup}
            className="p-1 rounded hover:bg-surface-200/70 dark:hover:bg-surface-800 text-xs"
            title="Detailed Margin & Page Setup"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Orientation */}
      <div className="flex flex-col space-y-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-1">Orientation</span>
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => onUpdateSettings((prev) => ({ ...prev, orientation: 'portrait' }))}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              settings.orientation === 'portrait'
                ? 'bg-sky-100 text-sky-800 border-sky-400 dark:bg-sky-950 dark:text-sky-300 font-semibold'
                : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            Portrait
          </button>
          <button
            onClick={() => onUpdateSettings((prev) => ({ ...prev, orientation: 'landscape' }))}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              settings.orientation === 'landscape'
                ? 'bg-sky-100 text-sky-800 border-sky-400 dark:bg-sky-950 dark:text-sky-300 font-semibold'
                : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            Landscape
          </button>
        </div>
      </div>

      {/* Paper Size */}
      <div className="flex flex-col space-y-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-1">Paper Size</span>
        <select
          value={settings.format}
          onChange={(e) => {
            const format = e.target.value as PaperFormat;
            onUpdateSettings((prev) => ({ ...prev, format }));
          }}
          className="h-6 px-1.5 text-xs bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded text-surface-900 dark:text-surface-100 outline-none w-28"
        >
          <option value="Letter">Letter (8.5 × 11")</option>
          <option value="A4">A4 (210 × 297 mm)</option>
          <option value="Legal">Legal (8.5 × 14")</option>
          <option value="A3">A3 (297 × 420 mm)</option>
          <option value="A5">A5 (148 × 210 mm)</option>
          <option value="Executive">Executive</option>
        </select>
      </div>

      {/* Columns */}
      <div className="flex flex-col space-y-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-1">Columns</span>
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => onUpdateSettings((prev) => ({ ...prev, columns: 1 }))}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              settings.columns === 1
                ? 'bg-sky-100 text-sky-800 border-sky-400 dark:bg-sky-950 dark:text-sky-300 font-semibold'
                : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            1 Column
          </button>
          <button
            onClick={() => onUpdateSettings((prev) => ({ ...prev, columns: 2 }))}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              settings.columns === 2
                ? 'bg-sky-100 text-sky-800 border-sky-400 dark:bg-sky-950 dark:text-sky-300 font-semibold'
                : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            2 Columns
          </button>
        </div>
      </div>

      {/* Watermark & Line Numbers */}
      <div className="flex items-center space-x-1">
        <RibbonButton
          icon={<Stamp className="w-4 h-4 text-amber-500" />}
          label="Watermark"
          variant="large"
          isActive={!!settings.watermark?.enabled}
          onClick={() => {
            const current = settings.watermark?.enabled;
            onUpdateSettings((prev) => ({
              ...prev,
              watermark: {
                enabled: !current,
                text: prev.watermark?.text || 'CONFIDENTIAL',
                opacity: 0.12,
                color: '#64748b',
                angle: -45,
                fontSizePt: 54,
              },
            }));
          }}
          title="Toggle Document Watermark"
        />
        <RibbonButton
          icon={<Hash className="w-4 h-4" />}
          label="Line Numbers"
          variant="large"
          isActive={settings.lineNumbers}
          onClick={() => onUpdateSettings((prev) => ({ ...prev, lineNumbers: !prev.lineNumbers }))}
          title="Toggle Line Numbering"
        />
      </div>
    </div>
  );
};
