import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTodo,
  Indent,
  Outdent,
  Quote,
  Code,
  Paintbrush,
  RemoveFormatting,
  Search,
  Type,
  Palette,
  Highlighter,
} from 'lucide-react';
import { RibbonButton } from '../RibbonButton';

interface HomeTabProps {
  editor: Editor | null;
  onOpenFindReplace: () => void;
  formatPainterActive: boolean;
  onToggleFormatPainter: () => void;
}

const FONT_FAMILIES = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Calibri', value: 'Calibri, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Garamond', value: '"EB Garamond", serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
];

const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

export const HomeTab: React.FC<HomeTabProps> = ({
  editor,
  onOpenFindReplace,
  formatPainterActive,
  onToggleFormatPainter,
}) => {
  if (!editor) return null;

  return (
    <div className="flex items-center space-x-2 py-1 px-1 overflow-x-auto text-surface-700 dark:text-surface-300">
      {/* Clipboard / Format Painter */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <RibbonButton
          icon={<Paintbrush className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="Format Painter"
          variant="large"
          isActive={formatPainterActive}
          onClick={onToggleFormatPainter}
          title="Copy formatting from one place and apply it to another"
        />
        <RibbonButton
          icon={<RemoveFormatting className="w-4 h-4" />}
          label="Clear"
          variant="large"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear Formatting (Ctrl+\)"
        />
      </div>

      {/* Font Family & Size */}
      <div className="flex flex-col space-y-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <div className="flex items-center space-x-1">
          <select
            className="h-6 px-1.5 text-xs bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded text-surface-900 dark:text-surface-100 outline-none w-32"
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            value={editor.getAttributes('textStyle').fontFamily || 'Arial, sans-serif'}
            title="Font Family"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <select
            className="h-6 px-1.5 text-xs bg-surface-50 dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded text-surface-900 dark:text-surface-100 outline-none w-14"
            value={parseFloat(editor.getAttributes('textStyle').fontSize || '11').toString()}
            onChange={(e) => {
              // Set font size attribute
              editor.chain().focus().setMark('textStyle', { fontSize: `${e.target.value}pt` }).run();
            }}
            title="Font Size"
          >
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Font Formatting Marks */}
        <div className="flex items-center space-x-0.5">
          <RibbonButton
            icon={<Bold className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl/Cmd + B)"
          />
          <RibbonButton
            icon={<Italic className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl/Cmd + I)"
          />
          <RibbonButton
            icon={<UnderlineIcon className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl/Cmd + U)"
          />
          <RibbonButton
            icon={<Strikethrough className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          />
          <RibbonButton
            icon={<SubscriptIcon className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('subscript')}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            title="Subscript (Ctrl + =)"
          />
          <RibbonButton
            icon={<SuperscriptIcon className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('superscript')}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            title="Superscript (Ctrl + Shift + =)"
          />

          {/* Color & Highlight */}
          <label className="p-1 rounded hover:bg-surface-200/70 dark:hover:bg-surface-800 cursor-pointer flex items-center" title="Font Color">
            <Palette className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <input
              type="color"
              className="opacity-0 w-0 h-0 pointer-events-none"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
          </label>
          <label className="p-1 rounded hover:bg-surface-200/70 dark:hover:bg-surface-800 cursor-pointer flex items-center" title="Text Highlight Color">
            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            <input
              type="color"
              defaultValue="#fef08a"
              className="opacity-0 w-0 h-0 pointer-events-none"
              onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
            />
          </label>
        </div>
      </div>

      {/* Paragraph Alignment & Lists */}
      <div className="flex flex-col space-y-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <div className="flex items-center space-x-0.5">
          <RibbonButton
            icon={<AlignLeft className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align Left (Ctrl + L)"
          />
          <RibbonButton
            icon={<AlignCenter className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align Center (Ctrl + E)"
          />
          <RibbonButton
            icon={<AlignRight className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align Right (Ctrl + R)"
          />
          <RibbonButton
            icon={<AlignJustify className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive({ textAlign: 'justify' })}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="Justify (Ctrl + J)"
          />
        </div>

        <div className="flex items-center space-x-0.5">
          <RibbonButton
            icon={<List className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bulleted List"
          />
          <RibbonButton
            icon={<ListOrdered className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          />
          <RibbonButton
            icon={<ListTodo className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('taskList')}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            title="Task Checklist"
          />
          <RibbonButton
            icon={<Quote className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          />
          <RibbonButton
            icon={<Code className="w-3.5 h-3.5" />}
            variant="icon"
            isActive={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code Block"
          />
        </div>
      </div>

      {/* Styles Gallery */}
      <div className="flex items-center space-x-1 border-r border-surface-200 dark:border-surface-800 pr-2">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 rounded text-xs border transition-all text-left flex flex-col justify-center h-12 w-16 ${
            editor.isActive('paragraph') && !editor.isActive('heading')
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold'
              : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
        >
          <span className="text-[11px] font-bold">Aa</span>
          <span className="text-[9px] opacity-70">Normal</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-xs border transition-all text-left flex flex-col justify-center h-12 w-16 ${
            editor.isActive('heading', { level: 1 })
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold'
              : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
        >
          <span className="text-xs font-extrabold">H1</span>
          <span className="text-[9px] opacity-70">Heading 1</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-xs border transition-all text-left flex flex-col justify-center h-12 w-16 ${
            editor.isActive('heading', { level: 2 })
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold'
              : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
        >
          <span className="text-xs font-bold">H2</span>
          <span className="text-[9px] opacity-70">Heading 2</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-xs border transition-all text-left flex flex-col justify-center h-12 w-16 ${
            editor.isActive('heading', { level: 3 })
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold'
              : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
        >
          <span className="text-xs font-medium">H3</span>
          <span className="text-[9px] opacity-70">Heading 3</span>
        </button>
      </div>

      {/* Editing / Find & Replace */}
      <div className="flex items-center space-x-1">
        <RibbonButton
          icon={<Search className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          label="Find & Replace"
          variant="large"
          onClick={onOpenFindReplace}
          title="Find and Replace Text (Ctrl/Cmd + F or Ctrl/Cmd + H)"
        />
      </div>
    </div>
  );
};
