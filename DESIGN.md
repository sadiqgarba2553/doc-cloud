# Doc Cloud Design System

Doc Cloud is the blue document editing member of the BlueCloud desktop suite. Its interface shares Sheet Cloud and Slide Cloud's quiet sidebar, practical ribbon, local save ledger, and native backup workflow.

- **Brand Asset**: Supplied blue document artwork, engraved in the BlueCloud superellipse squircle silhouette. Never substitute external competitor branding.
- **Typography**: Clean system font stack (Segoe UI on Windows, -apple-system on macOS), 13px base body, 11–12px controls, 9–10px metadata labels, and restrained Georgia/serif headings for formal editorial typography.
- **Color Palette**:
  - Light mode: Canvas background `#f1f5f9`, paper `#ffffff`, text `#1e293b`, muted text `#64748b`, line/borders `#e2e8f0`, brand blue accent `#0284c7` (primary hover `#0369a1`), soft blue highlights `#e0f2fe`.
  - Dark mode: Canvas `#0f172a`, editor surface `#1e293b`, text `#f8fafc`, borders `#334155`, brand accent `#38bdf8`, soft focus `#0c4a6e`.
- **Layout & Geometry**:
  - Paged mode: True physical dimensions (Letter, A4, A3, A5, Legal) with millimetric margins, header/footer zones, watermarks, and whole-block pagination.
  - Pageless mode: Continuous, responsive digital drafting canvas without fixed height or page breaks.
  - Multi-column layout: 1, 2, or 3 columns with balanced gutters.
- **Spacing & Elevation**: 4/8/12/16/24/32/48px design rhythm. 6–8px control border radii, 1px border lines, subtle page drop shadow.
- **Interactions**: Visible focus rings on all interactive elements, keyboard accessibility across ribbon and dialogs, clear undo/redo stack, and modal overlays with dimmed backdrop. No flashy neon or entrance animations.
- **Honest Status**: "Saved on this device" reflects local IndexedDB commits; `.dcloud` file export produces a full, self-contained ZIP archive.
