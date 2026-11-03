# Feature parity and acceptance matrix

Updated 2 November 2026. Replaces unsupported inherited “Implemented” labels with evidence-based status. “Connected” means code and UI are wired; “Tested subset” names bounded automated coverage, not full competitor parity.

| Competitor feature / expected behavior | Doc Cloud equivalent | Implementation / dependency | Acceptance check | Status |
|---|---|---|---|---|
| Word / Docs create and edit text | Real rich-text editor | TipTap 3 / ProseMirror / React | Type, format, save, reload; text and bold survive | Tested subset: Chrome E2E |
| Desktop ribbon and Docs formatting menus | Compact Home / Insert / Layout / References / Review / View / Help | Existing components connected by App | Activate formatting and insert commands against a live editor | Connected; primary flows tested |
| Apple-inspired refinement | Original neutral UI, system fonts, light/dark/system | app.css / local assets | Visual screenshots and persisted appearance | Tested subset; no Apple skill installed |
| Word / Docs font size and styling | Font, size, color, highlight, marks, alignment, headings | TipTap + Typography extension | Font size survives JSON/HTML; bold survives reopen | Tested subset; full visual style corpus pending |
| Lists, tables and undo | Nested editor lists, resizable tables, row/column and merge/split inspector | TipTap table/list extensions | Import/export simple table; undo replace-all | Tested subset; complex tables pending |
| Images, equations, special characters | File/clipboard/drop image insertion, equation preview, symbol grid | Custom image/math nodes, KaTeX | Insert equation and observe typeset editor output | Equation E2E; image corpus pending |
| Find and replace | Text-position search and replacement | ProseMirror textblock ranges | Replace visible text across marks without modifying URLs; one undo restores | Unit + E2E |
| Word pages and manual breaks | Measured whole-block pagination | ResizeObserver + decoration spacers | Overflow creates pages; A5 increases page count; Ctrl+Enter creates page | Tested subset; long-block splitting missing |
| Paper sizes, margins, landscape | A3/A4/A5/Letter/Legal/Custom geometry | PageGeometry / page setup | Physical dimensions / landscape unit checks, A5 browser test | Tested subset; custom size UI incomplete |
| Headers, footers, page numbers, watermark | Local fields, page/title macros, watermark | Page layers and print serializer | Configure fields, save/reopen, compare printed pages | Connected; full preservation corpus pending |
| Sections / mixed orientation / columns | No connected equivalent yet | Future layout engine work | Mixed-section OOXML and print comparison | Not implemented |
| Word save / Docs autosave | IndexedDB local autosave + explicit export | DocumentStore + native commands | Save/reload formatting; native atomic replacement | Tested subset; crash timeline pending |
| Open and save full native document | Versioned `.dcloud` ZIP | JSZip, schema validation | Round-trip tree/settings/comments/revisions/assets; reject future versions | Unit + E2E + REA package inventory |
| DOCX interoperability | Basic import/export subset with warnings | Mammoth / docx | Import genuine DOCX text/table and inspect exported OOXML | Tested subset; advanced fidelity incomplete |
| DOC / ODT | No connected converter | Future open-source conversion integration | Complex sample import/export without silent loss | Not implemented |
| TXT / Markdown / HTML / RTF | Connected import and export | Marked / Turndown / DOMPurify / legacy RTF | Literal text/sanitization unit checks; HTML page fixture browser test | Partial; RTF basic text only |
| Word print and PDF | Matching measured page groups + native browser print | PrintLayout + print dialog | Repaginate A5; print page count matches; produce PDF fixture | Tested subset; physical printing pending |
| Word comments / Docs discussion | Local anchored threads, replies, resolve/delete | ProseMirror marks + package data | Comment survives `.dcloud` export/import | Tested subset; no remote discussion |
| Track changes / suggesting | Experimental typed-text insertion/deletion marks | SuggestEdits plugin | Reject insertion/deletion restores original | Tested subset; paste/IME/structure not tracked |
| Word compare / per-change review | No connected document diff or per-change UI | Future AST diff and review controls | Compare independent documents, accept one change | Not implemented |
| Docs collaborative editing | Retained self-host scaffold only | Yjs / y-websocket | Auth roles, concurrent edits, reconnect and offline tests | Not connected; do not expose scaffold |
| Version history | Named local content revisions | IndexedDB/package revisions | Restore named version and keep pre-restore backup | Chrome E2E |
| Templates / recent documents | Editable built-in templates and searchable local library | Template AST catalog + IndexedDB | Open resume, edit heading/title, save/reopen | Tested subset; custom templates missing |
| Pin / duplicate / delete | Local library actions | localStorage pinned IDs + document records | Pin/filter, clone independent ID, delete with confirmation | Connected; dedicated tests pending |
| Spelling / grammar / dictionaries | Browser/WebView spellcheck only | Platform dictionaries | Runtime-dependent spelling UI | Partial; no grammar/custom dictionary |
| Accessibility / keyboard | Main native dialogs, named editor, common shortcuts | HTML dialog / keyboard handlers | Keyboard typing/format/search/save tests | Partial; full audit pending |
| Windows/macOS/Linux desktop | Tauri window and packaging configs | Tauri 2 / Rust / platform CI definitions | Native build, install, dialogs, uninstall on each host | See TEST_REPORT; not cross-platform validated |
| Privacy and safe import | No remote fonts/telemetry; sanitized HTML; local data | DOMPurify / CSP / local assets | Zero external requests during tested local flow; unsafe HTML removed | Tested subset; hostile-package corpus pending |
| Performance at hundreds of pages | No measured guarantee | Future profiling and layout improvements | Startup/typing/layout/memory benchmark corpus | Not validated |

Sources and REA boundaries: RESEARCH.md. Current technical limits: KNOWN_LIMITATIONS.md. Release gates: RELEASE_CHECKLIST.md.
