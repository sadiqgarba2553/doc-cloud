> Codex review (4 November 2026): Read [CODEX_VERIFICATION.md](CODEX_VERIFICATION.md) for tested behavior, corrected claims and remaining limits. Earlier source-only claims are not proof of feature parity.

# Doc Cloud - Known Limitations

This document provides a transparent, comprehensive record of architectural, engine, and exchange boundaries in Doc Cloud.

---

## 1. Document Layout & Pagination Boundaries
- **Whole-Block Pagination in Paged Mode**: In paged mode, Doc Cloud calculates layout by moving whole ProseMirror blocks (paragraphs, tables, callouts) between pages when an overflow occurs. If a single table or paragraph is taller than an entire page, Doc Cloud flags it as oversized rather than performing mid-paragraph line splitting.
- **Pageless Mode Advantage**: For long, unconstrained documents, users can switch to Pageless mode via the Layout tab, eliminating page-break gaps entirely.
- **Section Breaks with Mixed Orientation**: Section break metadata is preserved in the file format; however, rendering mixed page orientations (e.g., portrait page 1 followed by landscape page 2 in the same viewport) is not yet supported in the single-canvas DOM view.

---

## 2. Track Changes Scope
- **Tracked Operations**: Track changes currently marks typed text insertions and deletions. Complex structural table edits (adding/removing columns or merging cells) and pasted rich HTML blocks currently apply as direct edits rather than diff-marked blocks.
- **Suggestion Diff Rendering**: Inserted text is highlighted in green with underline; deleted text is rendered in red with strikethrough.

---

## 3. File Format & Conversion Fidelity
- **DOCX Round-Trip Boundaries**: DOCX import supports text, headings, lists, bold/italic/underline, links, and basic tables via Mammoth. DOCX export generates clean OpenXML using the `docx` library. Floating image wrap styles (behind text, tight, square) and custom shape drawings do not transfer to DOCX.
- **Binary Legacy DOC (.doc)**: Legacy Microsoft Word 97-2003 binary files are not supported. Users must convert them to `.docx` or `.rtf` before importing.
- **ODT (OpenDocument Text)**: Native ODT parsing is not yet connected; users can exchange via HTML or Markdown.

---

## 4. Multi-User Collaboration
- **Local-First Stance**: Doc Cloud is strictly local-first and air-gapped. Real-time multi-cursor cloud co-authoring via WebSocket servers is not enabled, guaranteeing zero data leakage or unauthorized telemetry.
