import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Sigma, X } from 'lucide-react';
import katex from 'katex';

interface InsertEquationModalProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_FORMULAS = [
  { label: 'Quadratic Formula', code: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
  { label: 'Mass-Energy Equivalence', code: 'E = mc^2' },
  { label: 'Euler\'s Identity', code: 'e^{i\\pi} + 1 = 0' },
  { label: 'Gaussian Integral', code: '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}' },
  { label: 'Matrix', code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
];

export const InsertEquationModal: React.FC<InsertEquationModalProps> = ({
  editor,
  isOpen,
  onClose,
}) => {
  const [latex, setLatex] = useState('x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');

  if (!isOpen || !editor) return null;

  let previewHtml = '';
  let errorMsg = '';
  try {
    previewHtml = katex.renderToString(latex, { displayMode: true, throwOnError: true });
  } catch (err: any) {
    errorMsg = err.message || 'LaTeX Syntax Error';
  }

  const handleInsert = () => {
    if (latex.trim()) {
      editor.chain().focus().setMathBlock({ latex: latex.trim(), displayMode: true }).run();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-3.5 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-surface-900 dark:text-surface-100">
            <Sigma className="w-4 h-4 text-purple-600" />
            <span>Insert Mathematical Equation (LaTeX)</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Presets */}
          <div>
            <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_FORMULAS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setLatex(p.code)}
                  className="px-2 py-0.5 rounded border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:border-sky-500"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* LaTeX Input */}
          <div>
            <label className="block font-semibold mb-1 text-surface-800 dark:text-surface-200">LaTeX Expression:</label>
            <textarea
              rows={3}
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              className="w-full px-3 py-2 font-mono text-xs border border-surface-300 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 outline-none focus:border-purple-500"
              placeholder="e.g. \\int_0^1 x^2 dx"
            />
          </div>

          {/* Rendered Preview */}
          <div>
            <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider block mb-1">
              Live KaTeX Preview
            </span>
            <div className="min-h-[60px] p-4 rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50/70 dark:bg-surface-950/60 flex items-center justify-center overflow-x-auto">
              {errorMsg ? (
                <span className="text-rose-500 font-mono text-[11px]">{errorMsg}</span>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950 flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1.5 text-xs rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800">
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!!errorMsg || !latex.trim()}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm disabled:opacity-40"
          >
            Insert Equation
          </button>
        </div>
      </div>
    </div>
  );
};
