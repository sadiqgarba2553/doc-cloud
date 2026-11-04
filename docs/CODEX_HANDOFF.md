> Codex review (4 November 2026): Read [CODEX_VERIFICATION.md](CODEX_VERIFICATION.md) for tested behavior, corrected claims and remaining limits. Earlier source-only claims are not proof of feature parity.

# Doc Cloud - Codex Handoff & Verification Guide

This guide provides Codex with exact verification commands, branch details, and expected behaviors for testing Doc Cloud.

---

## 1. Environment & Branch Details
- **Repository Directory**: `C:\Users\Garba Ibrahim\Desktop\BlueCloud Apps\apps\office\doc-cloud`
- **Active Feature Branch**: `feat/office-suite-expansion`
- **Base Clean Commit**: `ebed707537ef792a9fc31533b2eb96068e99327f`
- **Primary Technology Stack**: React 18, TypeScript, Vite, Tiptap 3 / ProseMirror, Tailwind CSS, JSZip, Tauri (Rust).

---

## 2. Verification Steps for Codex

### Step 1: Run Unit Tests
Execute the unit test suite with Vitest to verify all document integrity, layout, mail merge, TOC, and safety checks:
```powershell
cd "C:\Users\Garba Ibrahim\Desktop\BlueCloud Apps\apps\office\doc-cloud"
npm test
```
**Expected Outcome**: All tests pass, including:
- Native `.dcloud` round-trip with comments, revisions, pageless settings, and multi-column configuration.
- Mail merge CSV parsing with quoted commas, template substitution, and batch package generation.
- Table of Contents heading extraction and callout block building.
- Track changes suggestion acceptance and rejection in AST.
- Pagination block gaps and physical dimension calculations.
- Formatted text search across marks and HTML sanitization.

### Step 2: Source Code Typecheck
Run the TypeScript compiler to ensure all interfaces and models are properly typed:
```powershell
npx tsc --noEmit
```
**Expected Outcome**: Clean exit with code 0.

### Step 3: Run Desktop Smoke Test
Launch the development server to verify the UI:
```powershell
npm run dev
```
Navigate to `http://127.0.0.1:1420` in the browser:
1. Verify menu strip contains `Home`, `Insert`, `Layout`, `References`, `Mailings`, `Review`, `View`, `Help`.
2. In `Layout` tab: Click `Pageless` -> Observe document canvas transforms into a wide, continuous digital canvas without page break gaps.
3. In `Layout` tab: Change `Columns` to `2 Columns` -> Observe text divides into two balanced columns.
4. In `Mailings` tab: Click `Select Recipients` -> Upload a test CSV -> Verify loaded count updates -> Select a field from `Merge Fields` -> Verify `{{Field}}` inserts at cursor -> Click `Preview Results` -> Observe dynamic substitution.
5. In `References` tab: Click `Table of Contents` -> Verify TOC callout block is inserted from headings.
6. In `Review` tab: Toggle `Track Changes` -> Type text -> Observe green insertion mark. Click `Accept all` -> Observe mark is removed and text remains.
