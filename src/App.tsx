import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Editor, useEditor } from '@tiptap/react';
import { EditorState } from '@tiptap/pm/state';
import {
  FileText,
  Plus,
  FolderOpen,
  Search,
  Clock3,
  Pin,
  MoreHorizontal,
  ArrowUpRight,
  ChevronDown,
  Check,
  Undo2,
  Redo2,
  Download,
  MessageSquare,
  PanelLeft,
  SlidersHorizontal,
  Sun,
  Moon,
  Monitor,
  X,
  Trash2,
  ArrowLeft,
  FileUp,
  Printer,
  History,
  ShieldCheck,
  Settings2,
  BookOpen,
  ImagePlus,
  Link2,
  Table2,
  ScrollText,
  Send,
  Users,
} from 'lucide-react';
import { getDocCloudExtensions } from './core/editor/DocumentSchema';
import { Typography } from './core/editor/extensions/Typography';
import { suggestEdits } from './core/editor/extensions/SuggestEdits';
import { documentStore } from './core/storage/DocumentStore';
import { TauriStorageAdapter } from './core/storage/TauriAdapter';
import { createDocument, downloadFile, plainTextContent, sanitizeDocumentHtml } from './core/documents';
import { DocCloudFilePackage } from './types/document';
import { PageSettings } from './types/layout';
import { DocumentTemplate } from './types/templates';
import { TEMPLATES } from './core/templates';
import { exportToNativeDCloud, importFromNativeDCloud } from './core/conversion/NativeFormat';
import { importFromMarkdown } from './core/conversion/MarkdownImport';
import { exportToMarkdown } from './core/conversion/MarkdownExport';
import { exportToHtmlDocument } from './core/conversion/HtmlExport';
import { importFromRtf, exportToRtf } from './core/conversion/RtfConverter';
import { createPrintLayout, printLayout } from './core/conversion/PrintLayout';
import {
  parseMailMergeCsv,
  extractMergeFields,
  applyMailMergeToContent,
  generateMailMergePackages,
  RecipientRecord,
} from './core/mailmerge/MailMergeEngine';
import { extractHeadingsFromContent, buildTocBlockNode } from './core/toc/TocGenerator';
import { HomeTab } from './components/layout/Ribbon/Tabs/HomeTab';
import { InsertTab } from './components/layout/Ribbon/Tabs/InsertTab';
import { ReferencesTab } from './components/layout/Ribbon/Tabs/ReferencesTab';
import { MailingsTab } from './components/layout/Ribbon/Tabs/MailingsTab';
import { InspectorSidebar } from './components/layout/Sidebars/InspectorSidebar';
import { CommentsSidebar } from './components/layout/Sidebars/CommentsSidebar';
import { PageSetupModal } from './components/modals/PageSetupModal';
import { FindReplaceModal } from './components/modals/FindReplaceModal';
import { InsertTableModal } from './components/modals/InsertTableModal';
import { InsertEquationModal } from './components/modals/InsertEquationModal';
import { InsertLinkModal } from './components/modals/InsertLinkModal';
import { Modal } from './components/Modal';
import { PagedEditor } from './components/PagedEditor';

const storage = new TauriStorageAdapter();
const tabs = ['Home', 'Insert', 'Layout', 'References', 'Mailings', 'Review', 'View', 'Help'];
const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/u).length : 0);
const fileFilters = [{ name: 'Documents', extensions: ['dcloud', 'docx', 'txt', 'md', 'html', 'rtf'] }];
type Appearance = 'light' | 'dark' | 'system';

export default function App() {
  const [doc, setDoc] = useState(createDocument);
  const current = useRef(doc);
  current.current = doc;
  const [ready, setReady] = useState(false);
  const [home, setHome] = useState(true);
  const [library, setLibrary] = useState<DocCloudFilePackage[]>([]);
  const [filter, setFilter] = useState('All documents');
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('Home');
  const [modal, setModal] = useState('');
  const [message, setMessage] = useState('');
  const [failure, setFailure] = useState('');
  const [status, setStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [zoom, setZoom] = useState(0.85);
  const [pages, setPages] = useState(1);
  const [outline, setOutline] = useState(true);
  const [inspector, setInspector] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [rulers, setRulers] = useState(true);
  const [appearance, setAppearance] = useState<Appearance>(
    () => (localStorage.getItem('doccloud-appearance') as Appearance) || 'system'
  );
  const [pinned, setPinned] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('doccloud-pinned') || '[]')
  );
  const [track, setTrack] = useState(false);
  const tracking = useRef(false);
  const painter = useRef<any[] | null>(null);
  const [painting, setPainting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [fieldText, setFieldText] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const externalBaseline = useRef<{ path: string; bytes: Uint8Array } | null>(null);

  // Mail Merge States
  const [recipients, setRecipients] = useState<RecipientRecord[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [previewActive, setPreviewActive] = useState(false);
  const baseContentBeforePreview = useRef<any>(null);

  const extensions = useMemo(
    () => [...getDocCloudExtensions(), Typography, suggestEdits(() => tracking.current)],
    []
  );

  const editor = useEditor({
    extensions,
    shouldRerenderOnTransaction: true,
    content: doc.content,
    editorProps: {
      attributes: {
        spellcheck: 'true',
        lang: 'en',
        'aria-label': 'Document editor',
        role: 'textbox',
        'aria-multiline': 'true',
      },
      transformPastedHTML: sanitizeDocumentHtml,
      handlePaste: (_view, event) => {
        const image = Array.from(event.clipboardData?.files || []).find(f =>
          /^image\/(png|jpeg|webp|gif)$/.test(f.type)
        );
        if (!image) return false;
        insertImage(image);
        return true;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        const image = Array.from(event.dataTransfer?.files || []).find(f =>
          /^image\/(png|jpeg|webp|gif)$/.test(f.type)
        );
        if (!image) return false;
        insertImage(image);
        return true;
      },
    },
    onUpdate: ({ editor: e }) => {
      if (baseContentBeforePreview.current) return;
      const text = e.getText();
      const words = countWords(text);
      setDoc(prev => ({
        ...prev,
        content: e.getJSON(),
        metadata: {
          ...prev.metadata,
          updatedAt: new Date().toISOString(),
          wordCount: words,
          characterCount: text.length,
          readingTimeMinutes: Math.ceil(words / 200),
        },
      }));
      setStatus('dirty');
    },
    onSelectionUpdate: ({ editor: e }) => {
      if (!painter.current || e.state.selection.empty) return;
      const marks = painter.current;
      painter.current = null;
      setPainting(false);
      const chain = e.chain().unsetAllMarks();
      marks.forEach(mark => chain.setMark(mark.type.name, mark.attrs));
      chain.run();
    },
  });

  function insertImage(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setFailure('Choose an image smaller than 10 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setFailure('Could not read this image.');
    reader.onload = () =>
      editor?.chain().focus().setImage({ src: String(reader.result), alt: file.name, width: 460 }).run();
    reader.readAsDataURL(file);
  }

  const refreshLibrary = useCallback(async () => {
    const docs = await documentStore.list();
    setLibrary(docs.sort((a, b) => b.metadata.updatedAt.localeCompare(a.metadata.updatedAt)));
  }, []);

  useEffect(() => {
    if (!editor) return;
    let active = true;
    (async () => {
      try {
        await refreshLibrary();
        const id = localStorage.getItem('doccloud-active');
        const previous = id ? await documentStore.get(id) : undefined;
        if (active && previous) {
          current.current = previous;
          setDoc(previous);
          editor.commands.setContent(previous.content, { emitUpdate: false });
        }
      } catch (error) {
        if (active) setFailure(`Local storage could not be opened: ${String(error)}`);
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [editor, refreshLibrary]);

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () =>
      document.documentElement.classList.toggle(
        'dark',
        appearance === 'dark' || (appearance === 'system' && media.matches)
      );
    apply();
    media.addEventListener('change', apply);
    localStorage.setItem('doccloud-appearance', appearance);
    return () => media.removeEventListener('change', apply);
  }, [appearance]);

  const persist = useCallback(async (snapshot: DocCloudFilePackage) => {
    await documentStore.save(snapshot);
    localStorage.setItem('doccloud-active', snapshot.metadata.id);
    if (current.current === snapshot) setStatus('saved');
  }, []);

  useEffect(() => {
    if (!ready || home || status !== 'dirty') return;
    const snapshot = doc;
    const timer = setTimeout(() => {
      setStatus('saving');
      persist(snapshot).catch(error => {
        setStatus('dirty');
        setFailure(`Autosave failed. Export a backup: ${String(error)}`);
      });
    }, 700);
    return () => clearTimeout(timer);
  }, [doc, home, ready, persist]);

  useEffect(() => {
    if (home && ready) refreshLibrary().catch(error => setFailure(String(error)));
  }, [home, ready, refreshLibrary]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 4500);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (status !== 'saved') {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    addEventListener('beforeunload', beforeUnload);
    return () => removeEventListener('beforeunload', beforeUnload);
  }, [status]);

  function updateDocument(update: (value: DocCloudFilePackage) => DocCloudFilePackage) {
    setDoc(prev => {
      const next = update(prev);
      next.metadata = { ...next.metadata, updatedAt: new Date().toISOString() };
      return next;
    });
    setStatus('dirty');
  }

  async function loadDocument(next: DocCloudFilePackage) {
    try {
      if (!home) await persist(current.current);
      if (!externalBaseline.current || externalBaseline.current.path !== next.metadata.filePath)
        next = { ...next, metadata: { ...next.metadata, filePath: undefined } };
      if (editor) {
        const parsed = editor.schema.nodeFromJSON(next.content);
        parsed.check();
        editor.view.updateState(
          EditorState.create({ schema: editor.schema, doc: parsed, plugins: editor.state.plugins })
        );
        const text = editor.getText();
        next = {
          ...next,
          metadata: {
            ...next.metadata,
            wordCount: countWords(text),
            characterCount: text.length,
            readingTimeMinutes: Math.ceil(countWords(text) / 200),
          },
        };
      }
      current.current = next;
      setDoc(next);
      setHome(false);
      setModal('');
      setStatus('dirty');
      tracking.current = false;
      setTrack(false);
      setCommentsOpen(false);
      setPreviewActive(false);
      baseContentBeforePreview.current = null;
      editor?.setEditable(true);
      setRecipients([]); setAvailableFields([]); setCurrentRecordIndex(0);
    } catch (error) {
      setFailure(`Could not switch documents: ${String(error)}`);
    }
  }

  async function newDocument(template?: DocumentTemplate) {
    const next = createDocument(
      template?.id === 'blank' ? 'Untitled document' : template?.title || 'Untitled document',
      template?.id === 'blank' ? undefined : template?.initialContent
    );
    if (template?.settings) next.settings = { ...next.settings, ...template.settings };
    externalBaseline.current = null;
    await loadDocument(next);
  }

  async function showHome() {
    try {
      await persist(current.current);
      setHome(true);
    } catch (error) {
      setFailure(`Save failed: ${String(error)}`);
    }
  }

  async function importBytes(name: string, bytes: Uint8Array, path?: string) {
    try {
      const extension = name.split('.').pop()?.toLowerCase();
      let next = createDocument(name.replace(/\.[^.]+$/, ''));
      const text = () => new TextDecoder().decode(bytes);
      let html: string | undefined;
      if (extension === 'dcloud') {
        next = await importFromNativeDCloud(bytes);
        next.settings = { ...createDocument().settings, ...next.settings };
        next.metadata.filePath = path;
        if (path) externalBaseline.current = { path, bytes };
      } else if (extension === 'docx') {
        const { importFromDocx } = await import('./core/conversion/DocxImport');
        const result = await importFromDocx(bytes.slice().buffer as ArrayBuffer);
        html = result.html;
        setMessage('DOCX imported. Advanced Word layout may change; your original file is preserved.');
        if (result.messages.length) setFailure(`Import notes: ${result.messages.join('; ')}`);
      } else if (extension === 'md') {
        html = importFromMarkdown(text());
      } else if (extension === 'html' || extension === 'htm') {
        html = text();
      } else if (extension === 'rtf') {
        html = importFromRtf(text());
        setMessage('RTF imported as text. Advanced formatting is not preserved.');
      } else if (extension === 'txt') {
        next.content = plainTextContent(text());
      } else {
        throw new Error('Supported formats: .dcloud, .docx, .txt, .md, .html, and basic .rtf.');
      }

      if (html !== undefined) {
        const parser = new Editor({ extensions: getDocCloudExtensions(), content: sanitizeDocumentHtml(html) });
        next.content = parser.getJSON();
        parser.destroy();
      }
      await loadDocument(next);
    } catch (error) {
      setFailure(`Could not open document: ${String(error)}`);
    }
  }

  async function openFile() {
    if (!storage.isTauri()) {
      input.current?.click();
      return;
    }
    try {
      const path = await storage.showOpenDialog(fileFilters);
      if (path) await importBytes(path.split(/[\\/]/).pop()!, await storage.readBinaryFile(path), path);
    } catch (error) {
      setFailure(String(error));
    }
  }

  async function exportFile(format: string, saveAs = false) {
    if (!editor) return;
    try {
      const snapshot = current.current;
      await persist(snapshot);
      const filename = `${
        snapshot.metadata.title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_') || 'Untitled'
      }.${format}`;
      let data: string | Uint8Array;
      if (format === 'dcloud') {
        data = await exportToNativeDCloud(snapshot);
      } else if (format === 'docx') {
        if (
          !window.confirm(
            'DOCX export supports basic text, headings, lists, and tables. Images, equations, comments, and advanced layout may not transfer. Your full document remains saved locally. Continue?'
          )
        )
          return;
        const { exportToDocx } = await import('./core/conversion/DocxExport');
        data = await exportToDocx(editor.getJSON(), snapshot.settings, snapshot.headerFooter, snapshot.metadata.title);
      } else if (format === 'md') {
        data = exportToMarkdown(editor.getHTML());
      } else if (format === 'html') {
        data = exportToHtmlDocument(
          editor.getHTML(),
          snapshot.settings,
          snapshot.headerFooter,
          snapshot.metadata.title
        );
      } else if (format === 'rtf') {
        data = exportToRtf(editor.getText());
        setMessage('RTF export contains text only. Use .dcloud to preserve all formatting.');
      } else {
        data = editor.getText();
      }

      if (storage.isTauri()) {
        const path =
          format === 'dcloud' &&
          !saveAs &&
          snapshot.metadata.filePath &&
          externalBaseline.current?.path === snapshot.metadata.filePath
            ? snapshot.metadata.filePath
            : await storage.showSaveDialog(filename, [
                { name: `${format.toUpperCase()} document`, extensions: [format] },
              ]);
        if (!path) return;
        if (externalBaseline.current?.path === path) {
          const actual = await storage.readBinaryFile(path);
          const original = externalBaseline.current.bytes;
          if (actual.length !== original.length || actual.some((val, idx) => val !== original[idx]))
            throw new Error('The file changed outside Doc Cloud. Use Save As to preserve both versions.');
        }
        const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
        await storage.writeBinaryFileAtomic(path, bytes);
        if (format === 'dcloud') {
          externalBaseline.current = { path, bytes };
          updateDocument(value => ({ ...value, metadata: { ...value.metadata, filePath: path } }));
        }
      } else {
        downloadFile(typeof data === 'string' ? data : (data.slice().buffer as ArrayBuffer), filename);
      }
      setModal('');
      setMessage(`Exported ${filename}`);
    } catch (error) {
      setFailure(`Export failed: ${String(error)}`);
    }
  }

  function print() {
    if (!editor) return;
    try {
      void printLayout(createPrintLayout(editor, current.current, zoom)).catch(error => setFailure(String(error)));
    } catch (error) {
      setFailure(String(error));
    }
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const k = event.key.toLowerCase();
      if (['s', 'o', 'n', 'p', 'f', 'h', 'k'].includes(k)) {
        event.preventDefault();
        if (k === 's') void exportFile('dcloud', event.shiftKey);
        if (k === 'o') void openFile();
        if (k === 'n') void newDocument();
        if (k === 'p') print();
        if (k === 'f' || k === 'h') setModal('find');
        if (k === 'k') {
          if (home) document.querySelector<HTMLInputElement>('[aria-label="Search documents"]')?.focus();
          else setModal('link');
        }
      }
    };
    addEventListener('keydown', handler);
    return () => removeEventListener('keydown', handler);
  });

  function reviewSuggestions(accept: boolean) {
    if (!editor) return;
    const ranges: { from: number; to: number; type: string }[] = [];
    editor.state.doc.descendants((node, pos) => {
      const mark = node.marks.find(m => m.type.name === 'suggestion');
      if (node.isText && mark) ranges.push({ from: pos, to: pos + node.nodeSize, type: mark.attrs.type });
    });
    const tr = editor.state.tr;
    ranges.reverse().forEach(range => {
      if ((accept && range.type === 'delete') || (!accept && range.type === 'insert')) tr.delete(range.from, range.to);
      else tr.removeMark(range.from, range.to, editor.state.schema.marks.suggestion);
    });
    editor.view.dispatch(tr);
  }

  function addComment() {
    if (!editor || !commentText.trim()) return;
    const { from, to } = editor.state.selection;
    const id = crypto.randomUUID();
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    editor.chain().setComment(id).run();
    updateDocument(value => ({
      ...value,
      comments: [
        ...value.comments,
        {
          id,
          selectedText,
          author: 'You',
          avatarColor: '#2563eb',
          content: commentText.trim(),
          createdAt: new Date().toISOString(),
          resolved: false,
          replies: [],
        },
      ],
    }));
    setCommentText('');
    setModal('');
    setCommentsOpen(true);
  }

  async function saveRevision() {
    if (!editor) return;
    const revision = {
      id: crypto.randomUUID(),
      name: fieldText.trim() || `Version ${doc.revisions.length + 1}`,
      author: 'You',
      createdAt: new Date().toISOString(),
      contentJson: JSON.stringify(editor.getJSON()),
      wordCount: doc.metadata.wordCount,
    };
    updateDocument(value => ({ ...value, revisions: [...value.revisions, revision] }));
    setFieldText('');
    setMessage('Version added to local history.');
  }

  // --- Mail Merge Handlers ---
  const handleImportMailMergeCsv = (file: File) => {
    const reader = new FileReader();
    reader.onerror = () => setFailure('Could not read the recipient CSV.');
    reader.onload = e => {
      const text = String(e.target?.result || '');
      let parsedRecipients: RecipientRecord[];
      try { parsedRecipients = parseMailMergeCsv(text); } catch (error) { setFailure(String(error)); return; }
      if (parsedRecipients.length === 0) {
        setFailure('CSV contains no valid recipient records.');
        return;
      }
      setRecipients(parsedRecipients);
      const fields = Object.keys(parsedRecipients[0] || {});
      setAvailableFields(fields);
      setCurrentRecordIndex(0);
      setMessage(`Imported ${parsedRecipients.length} recipients. Fields: ${fields.join(', ')}`);
    };
    reader.readAsText(file);
  };

  const handleInsertMergeField = (fieldName: string) => {
    if (!editor) return;
    editor.chain().focus().insertContent(`{{${fieldName}}}`).run();
  };

  const handleTogglePreview = () => {
    if (!editor) return;
    if (!previewActive) {
      if (recipients.length === 0) {
        setFailure('Import a recipient CSV file first to preview merged records.');
        return;
      }
      baseContentBeforePreview.current = editor.getJSON();
      const currentRec = recipients[currentRecordIndex];
      const mergedContent = applyMailMergeToContent(baseContentBeforePreview.current, currentRec);
      editor.commands.setContent(mergedContent, { emitUpdate: false });
      editor.setEditable(false);
      setPreviewActive(true);
    } else {
      if (baseContentBeforePreview.current) {
        editor.commands.setContent(baseContentBeforePreview.current, { emitUpdate: false });
      }
      setPreviewActive(false);
      baseContentBeforePreview.current = null;
      editor.setEditable(true);
    }
  };

  const handleNavigateRecord = (newIndex: number) => {
    if (!editor || newIndex < 0 || newIndex >= recipients.length) return;
    setCurrentRecordIndex(newIndex);
    if (previewActive && baseContentBeforePreview.current) {
      const currentRec = recipients[newIndex];
      const mergedContent = applyMailMergeToContent(baseContentBeforePreview.current, currentRec);
      editor.commands.setContent(mergedContent, { emitUpdate: false });
    }
  };

  const handleFinishMerge = async () => {
    if (recipients.length === 0) {
      setFailure('Select a recipient list first.');
      return;
    }
    const basePkg = { ...doc, content: baseContentBeforePreview.current || doc.content };
    const mergedPackages = generateMailMergePackages(basePkg, recipients);
    for (const pkg of mergedPackages) {
      await documentStore.save(pkg);
    }
    await refreshLibrary();
    setMessage(`Successfully generated ${mergedPackages.length} merged documents in your library.`);
  };

  // --- Table of Contents Insertion ---
  const handleInsertToc = () => {
    if (!editor) return;
    const headings = extractHeadingsFromContent(editor.getJSON());
    if (headings.length === 0) {
      setFailure('No headings found in document! Add Heading 1, 2, or 3 styles to generate a Table of Contents.');
      return;
    }
    const tocNode = buildTocBlockNode(headings);
    editor.chain().focus().insertContent(tocNode).run();
    setMessage('Inserted Table of Contents.');
  };

  const visible = library.filter(
    item =>
      item.metadata.title.toLowerCase().includes(query.toLowerCase()) &&
      (filter !== 'Pinned' || pinned.includes(item.metadata.id))
  );
  const headings: { text: string; pos: number; level: number }[] = [];
  editor?.state.doc.descendants((node, pos) => {
    if (node.type.name === 'heading') headings.push({ text: node.textContent, pos, level: node.attrs.level });
  });
  const selectionWords = editor
    ? countWords(editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, ' '))
    : 0;
  const updateSettings = (settings: PageSettings) => updateDocument(value => ({ ...value, settings }));
  const name = doc.metadata.title;

  if (!editor || !ready)
    return (
      <div className="loading">
        <img src="/logo.svg" width="32" height="32" alt="" />
        <span>Opening your workspace…</span>
      </div>
    );

  return (
    <div className="doc-cloud-app">
      <input
        ref={input}
        type="file"
        accept=".dcloud,.docx,.txt,.md,.html,.htm,.rtf"
        hidden
        onChange={async e => {
          const file = e.target.files?.[0];
          if (file) await importBytes(file.name, new Uint8Array(await file.arrayBuffer()));
          e.target.value = '';
        }}
      />
      <input
        ref={imageInput}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) insertImage(file);
          e.target.value = '';
        }}
      />
      {home ? (
        <>
          <aside className="library-sidebar">
            <div className="brand">
              <span className="brand-mark">
                <img src="/logo.svg" alt="" />
              </span>
              <span>
                doc cloud<span className="brand-edition">BY BLUECLOUD</span>
              </span>
            </div>
            <button className="primary new-document" onClick={() => newDocument()}>
              <Plus size={18} />
              New document
            </button>
            <div className="sidebar-label">WORKSPACE</div>
            {['All documents', 'Recent', 'Pinned', 'Templates'].map((label, i) => {
              const Icon = [FileText, Clock3, Pin, BookOpen][i];
              return (
                <button
                  key={label}
                  className={`sidebar-item ${filter === label ? 'selected' : ''}`}
                  onClick={() => setFilter(label)}
                >
                  <Icon size={17} />
                  {label}
                  {label === 'All documents' && <span className="sidebar-count">{library.length}</span>}
                </button>
              );
            })}
            <button className="sidebar-item" onClick={openFile}>
              <FolderOpen size={17} />
              Open from computer
              <ArrowUpRight size={13} className="ml-auto" />
            </button>
            <div className="sidebar-bottom">
              <div className="local-note">
                <ShieldCheck size={18} />
                <div>
                  <strong>Your words. Your space.</strong>
                  <p>Saved on this device. Always free.</p>
                </div>
              </div>
              <button className="sidebar-item" onClick={() => setModal('settings')}>
                <Settings2 size={17} />
                Settings & appearance
              </button>
              <span className="version">Doc Cloud · Development edition</span>
            </div>
          </aside>
          <main className="library-main">
            <div className="library-topbar">
              <span>Your workspace</span>
              <div className="search-field">
                <Search size={16} />
                <input
                  aria-label="Search documents"
                  placeholder="Search your documents"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <kbd>⌘ K</kbd>
              </div>
              <button
                aria-label="Appearance settings"
                className="icon-button"
                onClick={() => setModal('settings')}
              >
                <Sun size={19} />
              </button>
              <div className="user-avatar">Y</div>
            </div>
            <div className="library-content">
              <div className="welcome">
                <div>
                  <div className="eyebrow">A LITTLE SPACE FOR BIG IDEAS</div>
                  <h1>Make room for your words.</h1>
                  <p>A fresh page. A clear mind. Something worth writing.</p>
                </div>
                <span className="welcome-icon">
                  <FileText size={54} strokeWidth={1} />
                </span>
              </div>
              <div className="section-heading">
                <h2>Start something new</h2>
                <button
                  className="text-button"
                  onClick={() => setFilter(filter === 'Templates' ? 'All documents' : 'Templates')}
                >
                  {filter === 'Templates' ? 'Back to documents' : 'View all templates'}
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="template-grid">
                {(filter === 'Templates' ? TEMPLATES : TEMPLATES.slice(0, 5)).map((template, i) => (
                  <button
                    className="template-card"
                    key={template.id}
                    onClick={() => newDocument(template)}
                  >
                    <div className={`template-preview template-${i % 5}`}>
                      {template.id === 'blank' ? (
                        <Plus size={30} strokeWidth={1} />
                      ) : (
                        <div className="mini-page">
                          <span className="mini-kicker">{template.category}</span>
                          <strong>{template.title.split(' /')[0]}</strong>
                          <div className="mini-rule" />
                          <i />
                          <i />
                          <i className="short" />
                          <div className="mini-gap" />
                          <b />
                          <i />
                          <i />
                          <i className="short" />
                        </div>
                      )}
                    </div>
                    <strong>{template.id === 'blank' ? 'Blank document' : template.title.split(' /')[0]}</strong>
                    <span>{template.id === 'blank' ? 'A clean beginning' : template.category}</span>
                  </button>
                ))}
              </div>
              {filter !== 'Templates' && (
                <>
                  <div className="section-heading document-section">
                    <h2>
                      {filter === 'Pinned' ? 'Pinned documents' : 'Your documents'}
                      <span className="count-badge">{visible.length}</span>
                    </h2>
                    <span className="muted">
                      Last edited
                      <ChevronDown size={13} />
                    </span>
                  </div>
                  {visible.length === 0 ? (
                    <div className="empty-library">
                      <div className="empty-icon">
                        <FileText size={25} />
                      </div>
                      <h3>
                        {query
                          ? 'No matching documents'
                          : filter === 'Pinned'
                          ? 'Keep your favorites close'
                          : 'Your next chapter starts here'}
                      </h3>
                      <p>
                        {query
                          ? 'Try another name in the search field.'
                          : filter === 'Pinned'
                          ? 'Pin a document to find it here.'
                          : 'Create a document or bring one from your computer.'}
                      </p>
                      <button className="secondary" onClick={openFile}>
                        <FileUp size={16} />
                        Open a document
                      </button>
                    </div>
                  ) : (
                    <div className="document-list">
                      <div className="document-list-heading">
                        <span>NAME</span>
                        <span>LAST EDITED</span>
                        <span>WORDS</span>
                        <span />
                      </div>
                      {visible.map(item => (
                        <div className="document-row" key={item.metadata.id}>
                          <button
                            className="document-name"
                            onClick={() => {
                              externalBaseline.current = null;
                              loadDocument(item);
                            }}
                          >
                            <span className="file-icon">
                              <FileText size={22} />
                            </span>
                            <span>
                              <strong>{item.metadata.title}</strong>
                              <small>Local document · .dcloud</small>
                            </span>
                          </button>
                          <span className="muted">
                            {new Date(item.metadata.updatedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="muted">{item.metadata.wordCount}</span>
                          <div className="row-actions">
                            <button
                              aria-label={`Pin ${item.metadata.title}`}
                              className={`icon-button ${pinned.includes(item.metadata.id) ? 'blue' : ''}`}
                              onClick={() => {
                                const next = pinned.includes(item.metadata.id)
                                  ? pinned.filter(id => id !== item.metadata.id)
                                  : [...pinned, item.metadata.id];
                                setPinned(next);
                                localStorage.setItem('doccloud-pinned', JSON.stringify(next));
                              }}
                            >
                              <Pin size={15} />
                            </button>
                            <button
                              aria-label={`Delete ${item.metadata.title}`}
                              className="icon-button"
                              onClick={async () => {
                                if (
                                  confirm(
                                    `Delete “${item.metadata.title}” from this device? Export a backup first if needed.`
                                  )
                                ) {
                                  await documentStore.remove(item.metadata.id);
                                  await refreshLibrary();
                                  if (item.metadata.id === current.current.metadata.id) {
                                    const next = createDocument();
                                    current.current = next;
                                    setDoc(next);
                                    editor.commands.setContent(next.content, { emitUpdate: false });
                                    localStorage.removeItem('doccloud-active');
                                  }
                                }
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div className="workspace-footer">
                <ShieldCheck size={14} />
                <span>Local first. No accounts. No subscriptions. Just writing.</span>
                <span className="ml-auto">Made for your next idea.</span>
              </div>
            </div>
          </main>
        </>
      ) : (
        <>
          <header className="editor-titlebar">
            <button className="editor-brand" onClick={showHome} title="Back to documents" aria-label="Back to documents">
              <span className="brand-mark">
                <img src="/logo.svg" alt="" />
              </span>
              <span>doc cloud</span>
            </button>
            <span className="title-divider" />
            <div className="title-details">
              <input
                aria-label="Document title"
                value={name}
                onChange={e =>
                  updateDocument(value => ({
                    ...value,
                    metadata: { ...value.metadata, title: e.target.value },
                  }))
                }
              />
              <span className="save-label">
                {status === 'saved' ? <Check size={12} /> : <Clock3 size={12} />}
                {status === 'saved'
                  ? 'Saved on this device'
                  : status === 'saving'
                  ? 'Saving…'
                  : 'Unsaved changes'}
              </span>
            </div>
            <div className="title-actions">
              <button
                className="icon-button"
                title="Find and replace"
                onClick={() => setModal('find')}
              >
                <Search size={18} />
              </button>
              <button
                className={`icon-button ${commentsOpen ? 'blue' : ''}`}
                title="Comments"
                onClick={() => setCommentsOpen(!commentsOpen)}
              >
                <MessageSquare size={18} />
              </button>
              <button className="secondary" onClick={() => setModal('history')}>
                <History size={15} />
                <span>History</span>
              </button>
              <button className="primary" onClick={() => setModal('export')}>
                <Download size={15} />
                Export
                <ChevronDown size={13} />
              </button>
            </div>
          </header>
          <div className="menu-strip">
            <button onClick={() => setModal('file')}>File</button>
            {tabs.map(label => (
              <button
                key={label}
                className={tab === label ? 'active' : ''}
                onClick={() => setTab(label)}
              >
                {label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1">
              <span className="editing-label">{track ? 'Suggesting text' : 'Editing'}</span>
              <button
                className="icon-button"
                title="Undo"
                disabled={!editor.can().undo()}
                onClick={() => editor.chain().focus().undo().run()}
              >
                <Undo2 size={16} />
              </button>
              <button
                className="icon-button"
                title="Redo"
                disabled={!editor.can().redo()}
                onClick={() => editor.chain().focus().redo().run()}
              >
                <Redo2 size={16} />
              </button>
            </div>
          </div>
          <div
            className="editor-toolbar"
            onMouseDown={e => {
              if ((e.target as HTMLElement).closest('button')) e.preventDefault();
            }}
          >
            {tab === 'Home' && (
              <HomeTab
                editor={editor}
                onOpenFindReplace={() => setModal('find')}
                formatPainterActive={painting}
                onToggleFormatPainter={() => {
                  if (painter.current) {
                    painter.current = null;
                    setPainting(false);
                  } else {
                    painter.current = [
                      ...editor.state.selection.$from.marks(),
                      ...(editor.state.storedMarks || []),
                    ];
                    setPainting(true);
                    setMessage('Select text to apply the copied formatting.');
                  }
                }}
              />
            )}
            {tab === 'Insert' && (
              <InsertTab
                editor={editor}
                onOpenTableModal={() => setModal('table')}
                onOpenEquationModal={() => setModal('equation')}
                onOpenLinkModal={() => setModal('link')}
                onOpenSymbolModal={() => setModal('symbol')}
                onOpenFootnoteModal={() => {
                  setFieldText('');
                  setModal('footnote');
                }}
                onImageInsertClick={() => imageInput.current?.click()}
              />
            )}
            {tab === 'Layout' && (
              <>
                <button className="toolbar-action" onClick={() => setModal('page')}>
                  <SlidersHorizontal size={19} />
                  Page setup
                </button>
                <button
                  className={`toolbar-action ${doc.settings.pageless ? 'blue' : ''}`}
                  onClick={() =>
                    updateSettings({
                      ...doc.settings,
                      pageless: !doc.settings.pageless,
                    })
                  }
                  title="Toggle Pageless Mode"
                >
                  <ScrollText size={19} />
                  {doc.settings.pageless ? 'Pageless' : 'Paged'}
                </button>
                <label>
                  Columns
                  <select
                    aria-label="Columns"
                    value={doc.settings.columns}
                    onChange={e =>
                      updateSettings({
                        ...doc.settings,
                        columns: parseInt(e.target.value, 10) as any,
                      })
                    }
                  >
                    <option value="1">1 Column</option>
                    <option value="2">2 Columns</option>
                    <option value="3">3 Columns</option>
                  </select>
                </label>
                <label>
                  Paper
                  <select
                    aria-label="Paper size"
                    disabled={doc.settings.pageless}
                    value={doc.settings.format}
                    onChange={e =>
                      updateSettings({
                        ...doc.settings,
                        format: e.target.value as PageSettings['format'],
                      })
                    }
                  >
                    {['A4', 'Letter', 'Legal', 'A3', 'A5'].map(size => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Orientation
                  <select
                    aria-label="Orientation"
                    disabled={doc.settings.pageless}
                    value={doc.settings.orientation}
                    onChange={e =>
                      updateSettings({
                        ...doc.settings,
                        orientation: e.target.value as 'portrait' | 'landscape',
                      })
                    }
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </label>
                <button className="toolbar-action" onClick={() => setModal('headers')}>
                  <FileText size={19} />
                  Headers & footers
                </button>
                <button
                  className="toolbar-action"
                  onClick={() => editor.chain().focus().setPageBreak().run()}
                >
                  <Plus size={19} />
                  Page break
                </button>
              </>
            )}
            {tab === 'References' && (
              <>
                <button className="toolbar-action" onClick={handleInsertToc}>
                  <BookOpen size={19} />
                  Table of Contents
                </button>
                <button
                  className="toolbar-action"
                  onClick={() => {
                    setFieldText('');
                    setModal('footnote');
                  }}
                >
                  <Plus size={19} />
                  Insert Footnote
                </button>
              </>
            )}
            {tab === 'Mailings' && (
              <MailingsTab
                recipientsCount={recipients.length}
                availableFields={availableFields}
                currentRecordIndex={currentRecordIndex}
                previewActive={previewActive}
                onImportCsvFile={handleImportMailMergeCsv}
                onInsertField={handleInsertMergeField}
                onTogglePreview={handleTogglePreview}
                onPrevRecord={() => handleNavigateRecord(currentRecordIndex - 1)}
                onNextRecord={() => handleNavigateRecord(currentRecordIndex + 1)}
                onFinishMerge={handleFinishMerge}
              />
            )}
            {tab === 'Review' && (
              <>
                <button className="toolbar-action" onClick={() => setModal('statistics')}>
                  <FileText size={19} />
                  Word count
                </button>
                <button
                  className="toolbar-action"
                  disabled={editor.state.selection.empty}
                  onClick={() => setModal('comment')}
                >
                  <MessageSquare size={19} />
                  Add comment
                </button>
                <button
                  className={`toolbar-action ${track ? 'blue' : ''}`}
                  onClick={() => {
                    tracking.current = !track;
                    setTrack(!track);
                    if (!track)
                      setMessage(
                        'Suggestions track typed text and text deletions. Paste, IME, and structural edits remain direct edits.'
                      );
                  }}
                >
                  <History size={19} />
                  {track ? 'Stop suggesting' : 'Suggest text'}
                </button>
                <button className="toolbar-action" onClick={() => reviewSuggestions(true)}>
                  <Check size={19} />
                  Accept all
                </button>
                <button className="toolbar-action" onClick={() => reviewSuggestions(false)}>
                  <X size={19} />
                  Reject all
                </button>
              </>
            )}
            {tab === 'View' && (
              <>
                <button
                  className={`toolbar-action ${outline ? 'blue' : ''}`}
                  onClick={() => setOutline(!outline)}
                >
                  <PanelLeft size={19} />
                  Outline
                </button>
                <button
                  className={`toolbar-action ${inspector ? 'blue' : ''}`}
                  onClick={() => setInspector(!inspector)}
                >
                  <SlidersHorizontal size={19} />
                  Inspector
                </button>
                <label className="toggle-field">
                  <input
                    type="checkbox"
                    checked={rulers}
                    onChange={e => setRulers(e.target.checked)}
                  />
                  Show ruler
                </label>
                <label>
                  Zoom
                  <select
                    aria-label="View zoom"
                    value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                  >
                    {[0.5, 0.65, 0.75, 0.85, 1, 1.25, 1.5, 2].map(value => (
                      <option key={value} value={value}>
                        {Math.round(value * 100)}%
                      </option>
                    ))}
                  </select>
                </label>
                <button className="toolbar-action" onClick={() => setModal('settings')}>
                  <Sun size={19} />
                  Appearance
                </button>
              </>
            )}
            {tab === 'Help' && (
              <>
                <button className="toolbar-action" onClick={() => setModal('shortcuts')}>
                  <BookOpen size={19} />
                  Keyboard shortcuts
                </button>
                <button className="toolbar-action" onClick={() => setModal('about')}>
                  <img src="/logo.svg" width="19" height="19" alt="" />
                  About Doc Cloud
                </button>
                <button className="toolbar-action" onClick={() => setModal('limitations')}>
                  <FileText size={19} />
                  Feature status
                </button>
              </>
            )}
          </div>
          <div className="editor-body">
            {outline && (
              <aside className="outline-sidebar">
                <div className="outline-heading">
                  DOCUMENT OUTLINE
                  <button
                    title="Hide outline"
                    className="icon-button"
                    onClick={() => setOutline(false)}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="outline-document">
                  <FileText size={17} />
                  <span>{name || 'Untitled document'}</span>
                </div>
                {headings.length ? (
                  headings.map((heading, i) => (
                    <button
                      className="outline-item"
                      key={`${heading.pos}:${i}`}
                      style={{ paddingLeft: 18 + (heading.level - 1) * 12 }}
                      onClick={() =>
                        editor
                          .chain()
                          .focus()
                          .setTextSelection(heading.pos + 1)
                          .scrollIntoView()
                          .run()
                      }
                    >
                      {heading.text || 'Untitled heading'}
                    </button>
                  ))
                ) : (
                  <p className="outline-empty">Add headings to navigate your document.</p>
                )}
                <div className="outline-tip">
                  <BookOpen size={16} />
                  <p>
                    A little structure goes a long way.
                    <br />
                    Use headings to organize your ideas.
                  </p>
                </div>
              </aside>
            )}
            <PagedEditor editor={editor} doc={doc} zoom={zoom} rulers={rulers} onPages={setPages} />
            <InspectorSidebar
              editor={editor}
              settings={doc.settings}
              isOpen={inspector}
              onClose={() => setInspector(false)}
              onOpenPageSetup={() => setModal('page')}
            />
            <CommentsSidebar
              comments={doc.comments}
              isOpen={commentsOpen}
              onClose={() => setCommentsOpen(false)}
              onAddReply={(id, text) =>
                updateDocument(value => ({
                  ...value,
                  comments: value.comments.map(c =>
                    c.id === id
                      ? {
                          ...c,
                          replies: [
                            ...c.replies,
                            {
                              id: crypto.randomUUID(),
                              author: 'You',
                              avatarColor: '#2563eb',
                              content: text,
                              createdAt: new Date().toISOString(),
                            },
                          ],
                        }
                      : c
                  ),
                }))
              }
              onToggleResolve={id =>
                updateDocument(value => ({
                  ...value,
                  comments: value.comments.map(c => (c.id === id ? { ...c, resolved: !c.resolved } : c)),
                }))
              }
              onDeleteComment={id => {
                const tr = editor.state.tr;
                editor.state.doc.descendants((node, pos) => {
                  node.marks
                    .filter(m => m.type.name === 'comment' && m.attrs.commentId === id)
                    .forEach(m => tr.removeMark(pos, pos + node.nodeSize, m));
                });
                editor.view.dispatch(tr);
                updateDocument(value => ({
                  ...value,
                  comments: value.comments.filter(c => c.id !== id),
                }));
              }}
            />
          </div>
          <footer className="editor-statusbar">
            <span>
              {pages} {pages === 1 ? 'page' : 'pages'}
            </span>
            <button onClick={() => setModal('statistics')}>
              {doc.metadata.wordCount.toLocaleString()} words
            </button>
            <span>
              {selectionWords
                ? `${selectionWords} selected`
                : `${doc.metadata.characterCount.toLocaleString()} characters`}
            </span>
            <span className="ml-auto">English · Browser spellcheck</span>
            <span className="status-separator" />
            <button
              className="icon-button"
              title="Zoom out"
              onClick={() => setZoom(Math.max(0.5, Math.round((zoom - 0.1) * 100) / 100))}
            >
              −
            </button>
            <input
              aria-label="Zoom"
              type="range"
              min="50"
              max="150"
              step="5"
              value={zoom * 100}
              onChange={e => setZoom(Number(e.target.value) / 100)}
            />
            <button
              className="icon-button"
              title="Zoom in"
              onClick={() => setZoom(Math.min(2, Math.round((zoom + 0.1) * 100) / 100))}
            >
              +
            </button>
            <span className="zoom-label">{Math.round(zoom * 100)}%</span>
          </footer>
        </>
      )}
      <FindReplaceModal editor={editor} isOpen={modal === 'find'} onClose={() => setModal('')} />
      <InsertTableModal editor={editor} isOpen={modal === 'table'} onClose={() => setModal('')} />
      <InsertEquationModal editor={editor} isOpen={modal === 'equation'} onClose={() => setModal('')} />
      <InsertLinkModal editor={editor} isOpen={modal === 'link'} onClose={() => setModal('')} />
      {modal === 'page' && (
        <PageSetupModal
          isOpen
          onClose={() => setModal('')}
          settings={doc.settings}
          onSaveSettings={settings => {
            updateSettings(settings);
            setModal('');
          }}
        />
      )}
      {['file', 'export'].includes(modal) && (
        <Modal title={modal === 'file' ? 'Your document' : 'Export a copy'} onClose={() => setModal('')}>
          <p className="dialog-note">
            Your document is saved automatically on this device. Export a copy to keep it anywhere.
          </p>
          <div className="file-actions">
            {modal === 'file' && (
              <>
                <button className="secondary" onClick={() => newDocument()}>
                  <Plus size={16} />
                  New document
                </button>
                <button className="secondary" onClick={openFile}>
                  <FolderOpen size={16} />
                  Open file
                </button>
                <button
                  className="secondary"
                  onClick={() => {
                    const duplicate = {
                      ...structuredClone(doc),
                      metadata: {
                        ...doc.metadata,
                        id: crypto.randomUUID(),
                        title: `${name} (copy)`,
                        filePath: undefined,
                      },
                    };
                    externalBaseline.current = null;
                    loadDocument(duplicate);
                  }}
                >
                  <FileText size={16} />
                  Duplicate
                </button>
              </>
            )}
          </div>
          <div className="export-options">
            {[
              ['dcloud', 'Doc Cloud document', 'Full fidelity · recommended'],
              ['docx', 'Word document', 'Headings, tables, and text styles'],
              ['html', 'Web document', 'HTML with page styles'],
              ['md', 'Markdown', 'Portable text and formatting'],
              ['txt', 'Plain text', 'Text without formatting'],
              ['rtf', 'Rich Text Format', 'Basic text export'],
            ].map(([format, title, subtitle]) => (
              <button key={format} onClick={() => exportFile(format, true)}>
                <span className="file-icon">
                  <FileText size={20} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </span>
                <span className="format-extension">.{format}</span>
                <Download size={16} />
              </button>
            ))}
            <button
              onClick={() => {
                print();
                setModal('');
              }}
            >
              <span className="file-icon">
                <Printer size={20} />
              </span>
              <span>
                <strong>Print / Save as PDF</strong>
                <small>Choose “Save as PDF” in the print dialog</small>
              </span>
              <ArrowUpRight size={16} className="ml-auto" />
            </button>
          </div>
        </Modal>
      )}
      {modal === 'settings' && (
        <Modal title="Make yourself at home" onClose={() => setModal('')}>
          <p className="dialog-note">A workspace that feels like yours.</p>
          <label className="setting-label">APPEARANCE</label>
          <div className="appearance-options">
            {(['light', 'dark', 'system'] as Appearance[]).map((value, i) => {
              const Icon = [Sun, Moon, Monitor][i];
              return (
                <button
                  className={appearance === value ? 'chosen' : ''}
                  key={value}
                  onClick={() => setAppearance(value)}
                >
                  <Icon size={24} />
                  <span>{value[0].toUpperCase() + value.slice(1)}</span>
                  {appearance === value && <Check size={14} />}
                </button>
              );
            })}
          </div>
          <div className="settings-info">
            <ShieldCheck size={21} />
            <div>
              <strong>Private by design</strong>
              <p>
                Documents stay in this browser or app’s local storage. Export backups before clearing application data. No telemetry or account required.
              </p>
            </div>
          </div>
          <button className="text-button" onClick={() => setModal('limitations')}>
            View current feature status
            <ArrowUpRight size={14} />
          </button>
        </Modal>
      )}
      {modal === 'statistics' && (
        <Modal title="Every word counts" onClose={() => setModal('')}>
          <div className="statistics-grid">
            {[
              [doc.metadata.wordCount, 'Words'],
              [doc.metadata.characterCount, 'Characters'],
              [pages, 'Pages'],
              [`${doc.metadata.readingTimeMinutes} min`, 'Reading time'],
              [selectionWords, 'Selected words'],
            ].map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {modal === 'comment' && (
        <Modal title="Add a comment" onClose={() => setModal('')}>
          <p className="dialog-note">On your selected text</p>
          <textarea
            aria-label="Comment text"
            autoFocus
            placeholder="What would you like to add?"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          <button className="primary" disabled={!commentText.trim()} onClick={addComment}>
            Add comment
          </button>
        </Modal>
      )}
      {modal === 'symbol' && (
        <Modal title="Symbols & special characters" onClose={() => setModal('')}>
          <div className="symbol-grid">
            {Array.from('©®™€£¥°±×÷≠≤≥∞πΩαβγδ→←↑↓✓•§¶—…').map(symbol => (
              <button
                key={symbol}
                onClick={() => {
                  editor.chain().focus().insertContent({ type: 'text', text: symbol }).run();
                  setModal('');
                }}
              >
                {symbol}
              </button>
            ))}
          </div>
        </Modal>
      )}
      {modal === 'footnote' && (
        <Modal title="Insert footnote" onClose={() => setModal('')}>
          <p className="dialog-note">Adds a numbered reference note tooltip to the selected text.</p>
          <textarea
            aria-label="Footnote text"
            value={fieldText}
            onChange={e => setFieldText(e.target.value)}
          />
          <button
            className="primary"
            disabled={!fieldText.trim()}
            onClick={() => {
              editor.chain().focus().insertFootnote(fieldText).run();
              setModal('');
            }}
          >
            Insert reference
          </button>
        </Modal>
      )}
      {modal === 'headers' && (
        <Modal title="Headers & footers" onClose={() => setModal('')}>
          <p className="dialog-note">Use {'{page}'}, {'{pages}'}, and {'{title}'} for automatic fields.</p>
          <div className="header-fields">
            {Object.entries(doc.headerFooter).map(([key, value]) => (
              <label key={key}>
                {key.replace(/([A-Z])/g, ' $1')}
                <input
                  aria-label={key}
                  value={value}
                  onChange={e =>
                    updateDocument(d => ({
                      ...d,
                      headerFooter: { ...d.headerFooter, [key]: e.target.value },
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <button className="primary" onClick={() => setModal('')}>
            Done
          </button>
        </Modal>
      )}
      {modal === 'history' && (
        <Modal title="Local version history" onClose={() => setModal('')}>
          <p className="dialog-note">Keep named versions of your document on this device.</p>
          <div className="version-input">
            <input
              aria-label="Version name"
              placeholder="Name this version"
              value={fieldText}
              onChange={e => setFieldText(e.target.value)}
            />
            <button className="primary" onClick={saveRevision}>
              Save version
            </button>
          </div>
          {doc.revisions.length === 0 && (
            <p className="dialog-note">No named versions yet. Your current document still autosaves.</p>
          )}
          {doc.revisions
            .slice()
            .reverse()
            .map(revision => (
              <div className="revision-row" key={revision.id}>
                <div>
                  <strong>{revision.name}</strong>
                  <small>
                    {new Date(revision.createdAt).toLocaleString()} · {revision.wordCount} words
                  </small>
                </div>
                <button
                  className="secondary"
                  onClick={() => {
                    if (
                      !confirm(
                        `Restore “${revision.name}”? A version of your current document will be retained.`
                      )
                    )
                      return;
                    const backup = {
                      id: crypto.randomUUID(),
                      name: 'Before restore',
                      author: 'You',
                      createdAt: new Date().toISOString(),
                      contentJson: JSON.stringify(editor.getJSON()),
                      wordCount: doc.metadata.wordCount,
                    };
                    const content = JSON.parse(revision.contentJson);
                    editor.commands.setContent(content);
                    updateDocument(value => ({
                      ...value,
                      content,
                      revisions: [...value.revisions, backup],
                    }));
                    setModal('');
                  }}
                >
                  Restore
                </button>
              </div>
            ))}
        </Modal>
      )}
      {modal === 'shortcuts' && (
        <Modal title="Keep your hands on the keys" onClose={() => setModal('')}>
          <p className="dialog-note">Use Command on macOS and Control on Windows or Linux.</p>
          <div className="shortcut-list">
            {[
              ['N', 'New document'],
              ['O', 'Open document'],
              ['S', 'Export / save .dcloud'],
              ['Shift S', 'Save as'],
              ['P', 'Print / Save as PDF'],
              ['B / I / U', 'Bold / Italic / Underline'],
              ['Z / Shift Z', 'Undo / Redo'],
              ['F / H', 'Find & replace'],
              ['K', 'Insert link'],
              ['Enter', 'Insert page break'],
            ].map(([keys, action]) => (
              <div key={keys}>
                <span>{action}</span>
                <kbd>Ctrl / ⌘ {keys}</kbd>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {['about', 'limitations'].includes(modal) && (
        <Modal
          title={modal === 'about' ? 'A good place for your words.' : 'Development status'}
          onClose={() => setModal('')}
        >
          <p className="dialog-note">Doc Cloud · BlueCloud AI Technologies · Free development edition</p>
          <p>
            Local writing, pageless & paged layouts, multi-column geometry, Mail Merge CSV engine, Table of Contents generator, editable templates, native documents, comments, and named versions are connected.
          </p>
          <p className="dialog-note">
            The current layout supports paged sheets with margin headers/footers as well as pageless continuous digital drafting.
          </p>
        </Modal>
      )}
      {failure && (
        <div className="error-banner" role="alert">
          <span>{failure}</span>
          <button aria-label="Dismiss error" onClick={() => setFailure('')}>
            <X size={17} />
          </button>
        </div>
      )}
      {message && (
        <div className="toast" role="status">
          <Check size={16} />
          <span>{message}</span>
          <button aria-label="Dismiss notification" onClick={() => setMessage('')}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
