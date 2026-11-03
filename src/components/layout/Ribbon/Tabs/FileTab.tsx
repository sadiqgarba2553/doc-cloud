import React from 'react';
import {
  FilePlus,
  FolderOpen,
  Save,
  FileDown,
  Printer,
  Info,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  Code,
  FileCode,
} from 'lucide-react';
import { DocumentMetadata } from '../../../../types/document';

interface FileTabProps {
  metadata: DocumentMetadata;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onExportRtf: () => void;
  onExportTxt: () => void;
  onPrint: () => void;
  onCloseFileTab: () => void;
}

export const FileTab: React.FC<FileTabProps> = ({
  metadata,
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onExportDocx,
  onExportPdf,
  onExportMarkdown,
  onExportHtml,
  onExportRtf,
  onExportTxt,
  onPrint,
  onCloseFileTab,
}) => {
  return (
    <div className="fixed inset-0 top-11 bg-white/95 dark:bg-surface-950/95 backdrop-blur-sm z-40 flex select-none">
      {/* Left Navigation Bar */}
      <div className="w-64 bg-surface-50 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 p-4 flex flex-col justify-between">
        <div className="space-y-1">
          <button
            onClick={onCloseFileTab}
            className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-semibold rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Document</span>
          </button>

          <button
            onClick={() => {
              onNew();
              onCloseFileTab();
            }}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-800 dark:text-surface-200 transition-colors"
          >
            <FilePlus className="w-4 h-4 text-sky-600" />
            <span>New Document</span>
          </button>

          <button
            onClick={() => {
              onOpen();
              onCloseFileTab();
            }}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-800 dark:text-surface-200 transition-colors"
          >
            <FolderOpen className="w-4 h-4 text-amber-500" />
            <span>Open from Disk...</span>
          </button>

          <button
            onClick={() => {
              onSave();
              onCloseFileTab();
            }}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-800 dark:text-surface-200 transition-colors"
          >
            <Save className="w-4 h-4 text-emerald-600" />
            <span>Save (.dcloud)</span>
          </button>

          <button
            onClick={() => {
              onSaveAs();
              onCloseFileTab();
            }}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-800 dark:text-surface-200 transition-colors"
          >
            <FileDown className="w-4 h-4 text-purple-600" />
            <span>Save As Copy...</span>
          </button>

          <div className="h-px bg-surface-200 dark:bg-surface-800 my-2" />

          <button
            onClick={() => {
              onPrint();
              onCloseFileTab();
            }}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-800 dark:text-surface-200 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print / Quick PDF</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-surface-400 p-2">
          Doc Cloud 1.0.0
          <br />
          BlueCloud AI Technologies
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6">
          Export Document
        </h2>

        {/* Export Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* DOCX */}
          <div
            onClick={() => {
              onExportDocx();
              onCloseFileTab();
            }}
            className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50 hover:border-sky-500 hover:shadow-md cursor-pointer transition-all flex items-start space-x-4"
          >
            <div className="p-3 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">Microsoft Word (.docx)</h3>
              <p className="text-xs text-surface-500 mt-1">
                Standard OOXML document compatible with MS Word, Google Docs, and LibreOffice. Preserves headings, tables, and typography.
              </p>
            </div>
          </div>

          {/* PDF */}
          <div
            onClick={() => {
              onExportPdf();
              onCloseFileTab();
            }}
            className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50 hover:border-sky-500 hover:shadow-md cursor-pointer transition-all flex items-start space-x-4"
          >
            <div className="p-3 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">PDF Document (.pdf)</h3>
              <p className="text-xs text-surface-500 mt-1">
                High-resolution vector PDF with exact page breaks, headers, footers, and margins. Ready for printing and distribution.
              </p>
            </div>
          </div>

          {/* Markdown */}
          <div
            onClick={() => {
              onExportMarkdown();
              onCloseFileTab();
            }}
            className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50 hover:border-sky-500 hover:shadow-md cursor-pointer transition-all flex items-start space-x-4"
          >
            <div className="p-3 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">Markdown (.md)</h3>
              <p className="text-xs text-surface-500 mt-1">
                Clean GitHub-flavored Markdown text. Ideal for developer documentation, READMEs, and static site generators.
              </p>
            </div>
          </div>

          {/* HTML */}
          <div
            onClick={() => {
              onExportHtml();
              onCloseFileTab();
            }}
            className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50 hover:border-sky-500 hover:shadow-md cursor-pointer transition-all flex items-start space-x-4"
          >
            <div className="p-3 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">Standalone Web Page (.html)</h3>
              <p className="text-xs text-surface-500 mt-1">
                Self-contained HTML document with embedded CSS styles matching Doc Cloud styling and print layouts.
              </p>
            </div>
          </div>
        </div>

        {/* Document Properties Section */}
        <div className="p-5 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">
          <div className="flex items-center space-x-2 text-surface-900 dark:text-surface-100 font-bold mb-4">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Document Information</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-surface-500">Title:</span>
              <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{metadata.title}</p>
            </div>
            <div>
              <span className="text-surface-500">Word Count:</span>
              <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{metadata.wordCount} words</p>
            </div>
            <div>
              <span className="text-surface-500">Character Count:</span>
              <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{metadata.characterCount} chars</p>
            </div>
            <div>
              <span className="text-surface-500">Last Modified:</span>
              <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">
                {new Date(metadata.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
