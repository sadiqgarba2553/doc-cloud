# Windows alpha release validation

3 November 2026, Africa/Lagos.

- Unit/integration: 13 passed.
- Browser editor workflows: 10 passed.
- TypeScript and production frontend build: passed.
- Rust filesystem tests: 2 passed.
- Optimized Windows x64 executable and NSIS build: passed (one inherited unused metadata type warning).
- Packaged native executable: home and editable document workspace rendered in WebView2 using an isolated test profile; local saved state appeared.
- Managed ZIP executable matches the final native build by SHA-256; installer was copied after bundling completed. Exact deliverable hashes are in BUILD_ARTIFACTS.json.
- App-owned source archive, managed ZIP, standalone installer, release metadata and checksums are prepared for GitHub publication. Launcher 0.7.1 supplies signed-feed download verification.

Unsigned alpha only. Clean-machine installer/uninstaller, complete native dialog save/reopen, macOS/Linux/ARM64 and full Office compatibility remain unverified. Earlier TEST_REPORT.md records the original development baseline. A first concurrent build failed under host memory pressure; the bounded rebuild completed successfully. Upstream license text and inherited source whitespace are retained.
