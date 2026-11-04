import React, { useRef } from 'react';
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { RibbonButton } from '../RibbonButton';

interface MailingsTabProps {
  recipientsCount: number;
  availableFields: string[];
  currentRecordIndex: number;
  previewActive: boolean;
  onImportCsvFile: (file: File) => void;
  onInsertField: (field: string) => void;
  onTogglePreview: () => void;
  onPrevRecord: () => void;
  onNextRecord: () => void;
  onFinishMerge: () => void;
}

export const MailingsTab: React.FC<MailingsTabProps> = ({
  recipientsCount,
  availableFields,
  currentRecordIndex,
  previewActive,
  onImportCsvFile,
  onInsertField,
  onTogglePreview,
  onPrevRecord,
  onNextRecord,
  onFinishMerge,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center space-x-2 py-1 px-1 overflow-x-auto text-surface-700 dark:text-surface-300">
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept=".csv,.txt"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onImportCsvFile(file);
            e.target.value = '';
          }
        }}
      />

      {/* Recipient Source */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          label="Select Recipients"
          variant="large"
          onClick={() => fileInputRef.current?.click()}
          title="Import CSV Recipient List"
        />
        {recipientsCount > 0 && (
          <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {recipientsCount} loaded
          </div>
        )}
      </div>

      {/* Insert Merge Fields */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider px-1">
            Merge Fields
          </span>
          <select
            disabled={availableFields.length === 0}
            onChange={(e) => {
              if (e.target.value) {
                onInsertField(e.target.value);
                e.target.value = '';
              }
            }}
            className="h-6 px-1.5 text-xs bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded text-surface-900 dark:text-surface-100 outline-none w-32 disabled:opacity-50"
            defaultValue=""
          >
            <option value="" disabled>
              Insert field…
            </option>
            {availableFields.map((f) => (
              <option key={f} value={f}>
                {`{{${f}}}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview Records */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<Eye className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="Preview Results"
          variant="large"
          isActive={previewActive}
          onClick={onTogglePreview}
          title="Toggle Merged Data Preview"
        />
        <div className="flex items-center space-x-1 px-1">
          <button
            onClick={onPrevRecord}
            disabled={recipientsCount === 0 || currentRecordIndex === 0}
            className="p-1 rounded border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40"
            title="Previous Recipient"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono px-1">
            {recipientsCount > 0 ? `${currentRecordIndex + 1} / ${recipientsCount}` : '0 / 0'}
          </span>
          <button
            onClick={onNextRecord}
            disabled={recipientsCount === 0 || currentRecordIndex >= recipientsCount - 1}
            className="p-1 rounded border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40"
            title="Next Recipient"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Finish & Merge */}
      <div className="flex items-center space-x-1">
        <RibbonButton
          icon={<Send className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          label="Finish & Merge"
          variant="large"
          onClick={onFinishMerge}
          title="Generate all personalized documents"
        />
      </div>
    </div>
  );
};
