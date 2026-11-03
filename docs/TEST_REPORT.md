# Verification report

2 November 2026, Africa/Lagos. Windows x64 development host; Node.js 24.15.0, npm 11.12.1, Rust/Cargo 1.97.1. Browser automation used installed Google Chrome. These are development checks, not a production certification.

| Check | Recorded result |
|---|---|
| `npm test` | 13 tests passed, 1 file; latest run 2.42 seconds |
| `npm run test:e2e` | 10 browser workflows passed; latest run 45.7 seconds |
| `npx tsc --noEmit` | Passed |
| Production frontend build | Passed with Vite 8.3.5; final packaging build 3.34 seconds |
| `npm audit` | Zero known vulnerabilities across production and development dependencies |
| `npm ls --depth=0` | Resolved direct dependency tree; no invalid peer packages reported |
| `cargo check -j 1` | Passed on Windows |
| `cargo test -j 1` | 2 tests passed: atomic replacement with Unicode; binary save/read with parent creation |
| Windows EXE installer | Unsigned x64 NSIS development installer generated successfully, approximately 4.94 MiB |
| Windows MSI installer | Unsigned x64 MSI development package generated successfully, approximately 7.36 MiB |
| Native runtime smoke check | Built executable launched in a Tauri/WebView2 window; real text entry, word count, local autosave status and native Save As dialog observed |
| Native save dialog completion | Canceled: automation field bindings were inconsistent; native UI save/reopen is not claimed verified |
| Print fixture | Six A5 PDF pages; approximately 420 × 594.96 pt; all 40 numbered test paragraphs recovered from PDF text |
| REA native package inventory | Verified ZIP member hashes; no reported integrity contradictions; complete evidence retained |
| macOS/Linux/ARM64 | Not run; workflow definitions are preparation only |
| Clean-machine install/uninstall / physical printer | Not run |

## Browser workflows

1. Create a document; type and bold text; autosave; return to library; reload; reopen; download `.dcloud`.
2. Import a genuine DOCX fixture containing formatted text and a table; export DOCX; inspect its OOXML for preserved text and table elements.
3. Anchor a local comment to formatted text; export and reopen `.dcloud`; verify text formatting and comment preservation.
4. Suggest typed text and text deletion; reject each; verify original text survives.
5. Import 40 paragraphs; verify overflow pages; switch to A5; verify page count increases; assert print page count matches the editor; generate PDF.
6. Open the editable resume template, change its title, and insert a typeset equation.
7. Find and replace visible text; undo replacement as one action; insert a manual page break and continue typing on page two.
8. Save a named version; edit; restore; verify a pre-restore backup exists.
9. Persist dark appearance; type and autosave; observe zero external HTTP(S) requests in the tested local flow.
10. Switch documents; confirm the second document has independent undo history and cannot reveal the first document's text.

## Unit and native boundaries

Unit tests cover native content/format/settings/comments/revisions/assets round-trip, version rejection, malformed roots, unsafe print settings, IndexedDB save/read/delete, exact-fit and manual-break pagination, oversized block reporting, physical page geometry, text search positions across formatting, font-size/line-spacing attributes, HTML sanitization, and literal Unicode text imports.

Rust tests exercise real temporary files, including replacement of an existing file. They do not establish native dialog-to-editor-to-disk round-trip behavior.

## Artifacts

- Browser screenshots: `output/playwright/home-light.png`, `home-dark.png`, `editor-light.png`, `template-editor.png`.
- Generated PDF: `output/playwright/layout.pdf`.
- DOCX compatibility fixture: `output/playwright/report.docx`.
- Native browser exports: `output/playwright/Verified document.dcloud` and `review.dcloud`.
- Exact REA-inspected fixture retained at `docs/research/review-inspected.dcloud`; evidence at `docs/research/native-package-rea.json`.
- Installer hashes and byte sizes: `docs/BUILD_ARTIFACTS.json`.

## Findings and remaining warnings

The inherited editor packages and development tooling required security updates. The final tree uses patched TipTap 3.32.2, KaTeX 0.19.1, Vite 8.3.5, Vitest 5.0.5 and React plugin 6.2.1; the final npm audit is clean. Direct package license metadata is recorded in DEPENDENCY_LICENSES.json; this is not a complete transitive license audit.

The first unrestricted Rust compilation exceeded available memory. The same check passed with one compiler job. An initial Vite 8 build exposed a Windows-encoded HTML entry file; normalizing it to UTF-8 resolved the build. A transient MSI bundler warning caused by the running executable was addressed by closing the development app and rebundling.

The build still reports a large main JavaScript chunk. DOCX conversion is loaded separately, but startup, typing and memory have not been benchmarked. Rust reports the inherited unused `DocumentMetadataRecord`; it is not a connected SQLite index. No working feature is inferred from that unused record.

Full competitor fidelity, secure collaboration, paragraph/table splitting, physical printer output, malicious ZIP resource exhaustion, and production-ready cross-platform distribution remain outside these passing checks. See KNOWN_LIMITATIONS.md and RELEASE_CHECKLIST.md.
