# Doc Cloud implementation architecture

Updated 2 November 2026. This document describes connected code, not aspirational feature completion.

## Application

`src/main.tsx` mounts the React app. `src/App.tsx` connects the library, editable templates, toolbar tabs, editor, comments, versions, file commands and settings. `src/app.css` defines the original neutral interface with system typography and light/dark/system appearance. Remote font and KaTeX stylesheet links were removed; math fonts ship locally.

## Document model

TipTap 3 / ProseMirror JSON is the canonical rich-text tree. Existing custom nodes cover page breaks, images, callouts, math and inline footnote references; marks cover formatting, comments and text suggestions. `Typography.ts` persists font size and paragraph line spacing. Local comments and named content versions live alongside the tree in `DocCloudFilePackage`.

Native `.dcloud` is a versioned JSZip container, with separate manifest, metadata, settings, header/footer, content, comments, suggestions, revisions and embedded assets. Import rejects unsupported versions and malformed document roots. Loading into the editor validates schema structure. This is full-fidelity within the supported Doc Cloud model, not arbitrary OOXML fidelity.

## Persistence and file I/O

`DocumentStore.ts` commits entire document snapshots through IndexedDB transactions. Edits debounce for 700 ms; failures remain visible and never report success. Switching documents flushes the prior snapshot and resets editor history so undo cannot reveal a different document. Pinned IDs and appearance preferences use localStorage.

Browser export creates downloadable files; browser import reads real File bytes. Tauri uses native open/save dialogs and Rust commands. Native writes use a unique same-directory temporary file, sync data, and atomically persist over the destination. A baseline byte comparison refuses to overwrite a file modified externally during the open session. Reopened local-library snapshots use Save As rather than trusting a stale disk path. A full external file watcher and metadata index remain future work.

## Layout and printing

`BlockPagination.ts` computes page boundaries from measured top-level block heights. `PagedEditor.tsx` uses document-neutral ProseMirror widget decorations for whitespace between physical pages, with page layers behind the single editable tree. Selection positions and exported JSON do not contain layout spacers. ResizeObserver, edits, page size and zoom changes trigger measurement. Oversized blocks are explicitly reported; paragraph and table-row splitting remain unfinished.

`PrintLayout.ts` serializes the same block/page groups into physical page sections with matching dimensions, margins and header/footer macros. Oversized blocks block this accurate-print route. Browser print controls printer selection and PDF output. Equation source, rather than typeset math, is currently serialized for print; full fidelity requires further work.

## Conversions and review

DOCX import uses Mammoth then DOMPurify and the editor schema. DOCX export uses the open-source `docx` library for a limited subset. DOCX export confirms compatibility limitations while keeping the native local document. Markdown uses Marked/Turndown; HTML is sanitized before editing. RTF is a basic legacy converter, not full formatting support. ODT and DOC are not connected.

Text search traverses ProseMirror textblocks and maps matches to real positions, so replacement never rewrites HTML attributes. Replace-all is a single isolated undo action. Comment threads are local data anchored by marks. Experimental typed-text suggestions retain insertion/deletion marks with accept/reject all; paste, IME and structural edits remain direct edits.

## Native runtime and packaging

Tauri 2 provides the desktop window, Rust filesystem commands and dialogs. Explicit capabilities grant native dialog operations to the main window. Production CSP restricts script sources to the app. Generated original application icons support Windows/macOS/Linux packaging. File associations are configured, but launch-argument handling is not implemented. The inherited SQLite dependency and metadata record are not a connected index. The retained Yjs/WebSocket scaffold is not connected, authenticated or production ready.

## Verification and unfinished work

Vitest covers native format, assets, storage, schema attributes, sanitization, search ranges and pagination. Playwright drives installed Chrome through actual editing, downloads, imports, layout, comments and versions. Rust tests cover atomic replacement and binary I/O. GitHub workflow definitions provide frontend checks and platform-specific build jobs; they have not been run in a remote repository in this session.

See FEATURE_PARITY_MATRIX.md for acceptance criteria, TEST_REPORT.md for actual run results, KNOWN_LIMITATIONS.md for boundaries and RELEASE_CHECKLIST.md for release gates.
