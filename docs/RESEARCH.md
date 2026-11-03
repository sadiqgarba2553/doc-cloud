# Workflow and design research

2 November 2026. Public documentation was used for clean-room workflow references; no proprietary source code or protected visual assets were copied.

## References and implementation decisions

- [Microsoft Word shortcuts](https://support.microsoft.com/en-us/accessibility/word/keyboard-shortcuts-in-word): standard new/open/save, formatting, undo, find and print shortcuts inform the command layer. Browser-reserved shortcuts may vary by platform.
- [Google Docs overview](https://support.google.com/docs/answer/7068618?hl=en): editable documents and connected formatting/review workflows inform the library/editor distinction. This does not establish collaborative equivalence.
- [Google Docs paragraph and font formatting](https://support.google.com/docs/answer/1663349?hl=en): font, alignment, paragraph and heading controls inform the compact toolbar.
- [LibreOffice Writer help](https://help.libreoffice.org/latest/en-US/text/swriter/main0000.html): menu, toolbar and shortcut organization informs the feature backlog.
- [ONLYOFFICE desktop help](https://helpcenter.onlyoffice.com/desktop/welcome/desktop-welcome.aspx): attempted reference; unavailable through the research tool in this session. Detailed ONLYOFFICE behavior remains unverified.
- [Apple typography guidance](https://developer.apple.com/design/human-interface-guidelines/typography): public reference for the requested design direction. The initial response exposed a JavaScript shell; no detailed wording was used as evidence. Local design choices are system fonts, restrained hierarchy, neutral colors, simple borders, compact controls and no gradients or glassmorphism. No installed Apple design skill was found after searching local skill roots.
- [TipTap v3 migration](https://tiptap.dev/docs/guides/upgrade-tiptap-v2) and [published security advisory](https://github.com/advisories/GHSA-cp6q-959q-f8rh): prompted migration from the inherited TipTap 2 dependency line to patched TipTap 3, followed by rebuilt editor and browser tests.

## REA evidence and boundaries

REA is connected. An attempt to launch a Chrome debugging session was rejected by automatic policy review as “blocked by policy.” It was not retried. No Word or Google Docs runtime or binary was inspected; competitor claims above remain documentation-based.

REA successfully inspected a generated native document fixture, `output/playwright/review.dcloud`:

- Evidence: `ev_9a01bcc7f1fa1ad1bd33f362d2394573c35e2f66ff5032c8213c6839891b20ee`.
- Inventory evidence: `ev_65ac95a3828dacc9f1823a9315fad550d2bfff8148071d77820e0d90f19e53f3`.
- SHA-256: `348e192239ff006ce4958648999c19937c84867541104546bf0b25129b6f9632`.
- Observed: ZIP package members include manifest, metadata, content, settings, header/footer, comments, suggestions, revisions and assets directory. Inventory reported no integrity contradictions and verified member hashes.
- Boundary: static central-directory inventory; no execution or validation of document-format semantics. ZIP comments and bytes outside member entries are outside this inventory.
- Complete evidence is saved in `docs/research/native-package-rea.json`. Later test runs may regenerate a fixture with a different timestamp/hash; this evidence describes the exact captured artifact, not every subsequent export.

No claim of full Word, Docs, Writer or ONLYOFFICE parity follows from this research.
