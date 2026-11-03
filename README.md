# Doc Cloud

A free, local-first word processor from BlueCloud AI Technologies. This is a development edition, with an original interface informed by desktop writing workflows and restrained Apple-style typography and spacing.

The canonical project is `doc-cloud`. Its UI and core were combined from the two original folders without overwriting existing files. The sibling `doc cloud` folder is a preserved source snapshot; run commands here.

## Run

Requires Node.js 22.12 or newer (Node.js 24 used during development).

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:1420. Browser documents live in IndexedDB for that origin. Keep the same hostname and port to access the same library.

## Desktop

Install Rust and the platform's Tauri prerequisites. On Windows this includes Microsoft C++ Build Tools and WebView2. Then:

```powershell
npm run tauri dev
npm run tauri build
```

On machines with limited memory use `$env:CARGO_BUILD_JOBS = '1'` before building. Generated installers are under `src-tauri/target/release/bundle`. Builds on macOS and Linux require their corresponding hosts. See `docs/RELEASE_CHECKLIST.md` for platform validation and signing requirements.

## Use

- Create a blank document or choose an editable template.
- Documents autosave locally after 700 ms of inactivity. The save label refers to the local library, not an exported file.
- Export `.dcloud` for full document structure, page setup, comments, tracked text marks, and named versions. Export backups before clearing browser/application data.
- Ctrl/Cmd+S exports a native copy in browsers and saves through the native dialog on desktop. Ctrl/Cmd+Shift+S opens Save As on desktop.
- Open `.dcloud`, `.docx`, `.txt`, `.md`, `.html`, or basic `.rtf` documents. Original files are preserved during import.
- Use File or Export for native, basic DOCX, HTML, Markdown, text, basic RTF, or Print / Save as PDF.
- Review supports local comments and experimental text suggestions. Suggestions track typed text and ordinary text deletion; paste, IME, and structural editing remain direct edits.
- History stores named text versions locally, with a backup before restoring.

## Verify

```powershell
npm test
npm run test:e2e
npm run build
npm audit
cargo test --manifest-path src-tauri/Cargo.toml -j 1
```

Browser tests use installed Google Chrome by default. CI installs it explicitly. Screenshots, generated compatibility fixtures, PDFs, and browser traces are written to `output/playwright`.

## Scope

This edition does not yet replace every Word or Google Docs feature. DOCX conversion is limited; ODT and legacy DOC are not connected. Pagination moves whole blocks, with a warning for blocks taller than a page. Collaboration authentication, roles, cloud synchronization, mixed sections, and full tracked changes remain unfinished. The retained collaboration server is a development scaffold, not a production service.

Read `docs/FEATURE_PARITY_MATRIX.md`, `docs/KNOWN_LIMITATIONS.md`, and `docs/TEST_REPORT.md` for measured status. Features are not complete merely because a retained component or architecture proposal mentions them.

## Windows alpha releases

Source and downloads belong to `sadiqgarba2553/doc-cloud`. Build in release mode with `npm run tauri -- build --bundles nsis`, then run `./scripts/package-windows.ps1`. Commit and push source before `npm run release:prepare` and `npm run release:publish`. The publisher verifies repository ownership, source commit, upload sizes and SHA-256 digests. Signed launcher metadata is promoted from the launcher repository only after public downloads pass verification. See RELEASE-NOTES.md for the alpha scope.
