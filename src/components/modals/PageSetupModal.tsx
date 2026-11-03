import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';
import { PageSettings, PaperFormat, Orientation } from '../../types/layout';
import { MARGIN_PRESETS, createPageMargins } from '../../core/layout/PageGeometry';

interface PageSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PageSettings;
  onSaveSettings: (newSettings: PageSettings) => void;
}

export const PageSetupModal: React.FC<PageSetupModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [format, setFormat] = useState<PaperFormat>(settings.format);
  const [orientation, setOrientation] = useState<Orientation>(settings.orientation);
  const [topMm, setTopMm] = useState(settings.margins.topMm);
  const [bottomMm, setBottomMm] = useState(settings.margins.bottomMm);
  const [leftMm, setLeftMm] = useState(settings.margins.leftMm);
  const [rightMm, setRightMm] = useState(settings.margins.rightMm);
  const [columns, setColumns] = useState(settings.columns);
  const [watermarkText, setWatermarkText] = useState(settings.watermark?.text || 'CONFIDENTIAL');
  const [watermarkEnabled, setWatermarkEnabled] = useState(!!settings.watermark?.enabled);

  if (!isOpen) return null;

  const handleSave = () => {
    const margins = createPageMargins(topMm, bottomMm, leftMm, rightMm);
    onSaveSettings({
      ...settings,
      format,
      orientation,
      margins,
      marginPreset: 'custom',
      columns,
      watermark: {
        enabled: watermarkEnabled,
        text: watermarkText,
        opacity: 0.12,
        color: '#64748b',
        angle: -45,
        fontSizePt: 54,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-surface-900 dark:text-surface-100">
            <Sliders className="w-4 h-4 text-sky-600" />
            <span>Page Setup</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-surface-700 dark:text-surface-300">
          {/* Paper Size */}
          <div>
            <label className="block font-semibold mb-1 text-surface-800 dark:text-surface-200">Paper Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as PaperFormat)}
              className="w-full px-3 py-1.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 outline-none"
            >
              <option value="Letter">Letter (8.5 × 11 in / 215.9 × 279.4 mm)</option>
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="Legal">Legal (8.5 × 14 in / 215.9 × 355.6 mm)</option>
              <option value="A3">A3 (297 × 420 mm)</option>
              <option value="A5">A5 (148 × 210 mm)</option>
              <option value="Executive">Executive (184 × 267 mm)</option>
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block font-semibold mb-1 text-surface-800 dark:text-surface-200">Orientation</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`py-1.5 rounded-lg border font-medium transition-colors ${
                  orientation === 'portrait'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                    : 'border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`py-1.5 rounded-lg border font-medium transition-colors ${
                  orientation === 'landscape'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                    : 'border-surface-300 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                Landscape
              </button>
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="block font-semibold mb-1 text-surface-800 dark:text-surface-200">Margins (mm)</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-surface-400">Top:</span>
                <input
                  type="number"
                  value={topMm}
                  onChange={(e) => setTopMm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-surface-300 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-800 outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-surface-400">Bottom:</span>
                <input
                  type="number"
                  value={bottomMm}
                  onChange={(e) => setBottomMm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-surface-300 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-800 outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-surface-400">Left:</span>
                <input
                  type="number"
                  value={leftMm}
                  onChange={(e) => setLeftMm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-surface-300 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-800 outline-none"
                />
              </div>
              <div>
                <span className="text-[10px] text-surface-400">Right:</span>
                <input
                  type="number"
                  value={rightMm}
                  onChange={(e) => setRightMm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-surface-300 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-800 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Watermark */}
          <div className="pt-2 border-t border-surface-200 dark:border-surface-800">
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-surface-800 dark:text-surface-200">Document Watermark</label>
              <input
                type="checkbox"
                checked={watermarkEnabled}
                onChange={(e) => setWatermarkEnabled(e.target.checked)}
                className="rounded accent-sky-600"
              />
            </div>
            {watermarkEnabled && (
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Watermark text (e.g. DRAFT)"
                className="w-full px-3 py-1.5 border border-surface-300 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-800 outline-none mt-1"
              />
            )}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-colors"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
};
