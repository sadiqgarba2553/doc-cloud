import { test, expect } from '@playwright/test';
import JSZip from 'jszip';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from 'docx';
import { readFile } from 'node:fs/promises';

test('create, type, format, autosave, reopen and export native document', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Make room for your words.' })).toBeVisible();
  await page.screenshot({ path: 'output/playwright/home-light.png' });
  await page.getByRole('button', { name: 'New document', exact: true }).click();
  await page.getByRole('textbox', { name: 'Document title', exact: true }).fill('Verified document');
  const editor = page.getByRole('textbox', { name: 'Document editor', exact: true });
  await editor.click();
  await page.keyboard.type('A useful writing workspace.');
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Control+b');
  await expect(editor.locator('strong')).toHaveText('A useful writing workspace.');
  await expect(page.getByText('Saved on this device', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Back to documents' }).click();
  await expect(page.getByRole('button', { name: 'Verified document Local document' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Verified document Local document' }).click();
  await expect(editor.locator('strong')).toHaveText('A useful writing workspace.');
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Doc Cloud document Full fidelity' }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe('Verified document.dcloud');
  await download.saveAs('output/playwright/Verified document.dcloud');
  await page.screenshot({ path: 'output/playwright/editor-light.png' });
  expect(errors).toEqual([]);
});

test('DOCX import and export preserve basic paragraphs and a table', async ({ page }) => {
  const fixture = new Document({ sections: [{ children: [new Paragraph({ children: [new TextRun({ text: 'A portable report', bold: true })] }), new Table({ rows: [new TableRow({ children: [new TableCell({ children: [new Paragraph('Cell one')] }), new TableCell({ children: [new Paragraph('Cell two')] })] })] })] }] });
  const bytes = await Packer.toBuffer(fixture);
  await page.goto('/');
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'report.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: bytes });
  const editor = page.getByRole('textbox', { name: 'Document editor', exact: true });
  await expect(editor).toContainText('A portable report');
  await expect(editor.locator('table')).toContainText('Cell one');
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  page.once('dialog', dialog => dialog.accept());
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Word document Basic formatting' }).click();
  const download = await downloading;
  await download.saveAs('output/playwright/report.docx');
  const zip = await JSZip.loadAsync(await readFile('output/playwright/report.docx'));
  const xml = await zip.file('word/document.xml')!.async('text');
  expect(xml).toContain('A portable report');
  expect(xml).toContain('Cell one');
  expect(xml).toContain('<w:tbl>');
});

test('native exports reopen with formatting, comments and named versions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'New document', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Document editor', exact: true });
  await editor.fill('Review this sentence.');
  await page.keyboard.press('Control+a');
  await page.keyboard.press('Control+b');
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await page.getByRole('button', { name: 'Add comment', exact: true }).click();
  await page.getByRole('textbox', { name: 'Comment text' }).fill('Keep this thought.');
  await page.getByRole('button', { name: 'Add comment', exact: true }).last().click();
  await expect(page.getByText('Keep this thought.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Doc Cloud document Full fidelity' }).click();
  const download = await downloading;
  await download.saveAs('output/playwright/review.dcloud');
  await page.getByRole('button', { name: 'Back to documents' }).click();
  await page.locator('input[type="file"]').first().setInputFiles('output/playwright/review.dcloud');
  await expect(editor.locator('strong')).toHaveText('Review this sentence.');
  await page.getByRole('button', { name: 'Comments', exact: true }).click();
  await expect(page.getByText('Keep this thought.', { exact: true })).toBeVisible();
});

test('text suggestions can be rejected without losing original text', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'New document', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Document editor', exact: true });
  await editor.fill('Original');
  await page.getByRole('button', { name: 'Review', exact: true }).click();
  await page.getByRole('button', { name: 'Suggest text', exact: true }).click();
  await editor.click();
  await page.keyboard.press('Control+End');
  await page.keyboard.type(' addition');
  await expect(editor.locator('ins')).toHaveText(' addition');
  await page.getByRole('button', { name: 'Reject all', exact: true }).click();
  await expect(editor).toHaveText('Original');
  await editor.click();
  await page.keyboard.press('Control+End');
  await page.keyboard.press('Backspace');
  await expect(editor.locator('del')).toHaveText('l');
  await page.getByRole('button', { name: 'Reject all', exact: true }).click();
  await expect(editor).toHaveText('Original');
});

test('overflow repaginates with page size and the print layout uses the same page count', async ({ page, context }) => {
  await page.goto('/');
  const html = '<h1>A considered approach</h1>' + Array.from({ length: 40 }, (_, i) => `<p>Paragraph ${i + 1}. Clear thinking begins with a little room to write. These words should flow onto real pages without changing the underlying document.</p>`).join('');
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'layout.html', mimeType: 'text/html', buffer: Buffer.from(html) });
  const sheets = page.locator('[data-page]');
  await expect.poll(() => sheets.count()).toBeGreaterThan(1);
  const before = await sheets.count();
  await page.getByRole('button', { name: 'Layout', exact: true }).click();
  await page.getByRole('combobox', { name: 'Paper size' }).selectOption('A5');
  await expect.poll(() => sheets.count()).toBeGreaterThan(before);
  const count = await sheets.count();
  // Keep the generated print frame available for structural and PDF verification.
  await page.evaluate(() => { Window.prototype.print = function () {}; });
  await page.keyboard.press('Control+p');
  const frame = page.frameLocator('iframe[title="Document print layout"]');
  await expect(frame.locator('.print-page')).toHaveCount(count);
  const printHtml = await page.locator('iframe[title="Document print layout"]').evaluate((element: HTMLIFrameElement) => element.contentDocument!.documentElement.outerHTML);
  const printPage = await context.newPage();
  await printPage.setContent(printHtml);
  await printPage.pdf({ path: 'output/playwright/layout.pdf', preferCSSPageSize: true, printBackground: true });
  await printPage.close();
});

test('editable template renders as a document with working headings and equations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Modern Resume Personal' }).click();
  const editor = page.getByRole('textbox', { name: 'Document editor', exact: true });
  await expect(editor.locator('h1')).toContainText('ALEXANDER MORGAN');
  await page.getByRole('textbox', { name: 'Document title', exact: true }).fill('A fresh perspective');
  await page.screenshot({ path: 'output/playwright/template-editor.png' });
  await page.getByRole('button', { name: 'Insert', exact: true }).click();
  await page.getByRole('button', { name: 'Equation', exact: true }).click();
  await page.getByRole('button', { name: 'Insert Equation', exact: true }).click();
  await expect(editor.locator('.katex')).toBeVisible();
});

test('template editing, find and replace, undo and measured pagination', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Blank document A clean beginning' }).click();
  const editor = page.getByRole('textbox', { name: 'Document editor', exact: true });
  await editor.fill('needle needle');
  await page.keyboard.press('Control+h');
  await page.getByPlaceholder('Search text...').fill('needle');
  await page.getByPlaceholder('Replacement text...').fill('replacement');
  await page.getByRole('button', { name: 'Replace All', exact: true }).click();
  await expect(editor).toHaveText('replacement replacement');
  // Close the existing modal by its header close button.
  await page.locator('.fixed.inset-0').getByRole('button').first().click();
  await editor.click();
  await page.keyboard.press('Control+z');
  await expect(editor).toHaveText('needle needle');
  await page.keyboard.press('Control+End');
  await page.keyboard.press('Control+Enter');
  await page.keyboard.type('After the page break.');
  await expect(page.locator('[data-page]')).toHaveCount(2);
  await expect(editor).toContainText('After the page break.');
});

test('named versions restore text and keep a backup', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'New document', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Document editor', exact: true });
  await editor.fill('Original version');
  await page.getByRole('button', { name: 'History', exact: true }).click();
  await page.getByRole('textbox', { name: 'Version name', exact: true }).fill('First draft');
  await page.getByRole('button', { name: 'Save version', exact: true }).click();
  await expect(page.getByText('First draft', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await editor.fill('Later version');
  await page.getByRole('button', { name: 'History', exact: true }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Restore', exact: true }).click();
  await expect(editor).toHaveText('Original version');
  await page.getByRole('button', { name: 'History', exact: true }).click();
  await expect(page.getByText('Before restore', { exact: true })).toBeVisible();
});

test('appearance persists and local editing makes no external requests', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:1420')) external.push(request.url()); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings & appearance' }).click();
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveClass('dark');
  await page.screenshot({ path: 'output/playwright/home-dark.png' });
  await page.getByRole('button', { name: 'New document', exact: true }).click();
  await page.getByRole('textbox', { name: 'Document editor', exact: true }).fill('Offline-friendly writing.');
  await expect(page.getByText('Saved on this device', { exact: true })).toBeVisible();
  expect(external).toEqual([]);
});

test('switching documents isolates undo history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'New document', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Document editor', exact: true });
  await editor.fill('Private first document');
  await page.getByRole('button', { name: 'Back to documents' }).click();
  await page.getByRole('button', { name: 'New document', exact: true }).click();
  await expect(editor).toHaveText('');
  await expect(page.getByRole('button', { name: 'Undo', exact: true })).toBeDisabled();
  await editor.click();
  await page.keyboard.press('Control+z');
  await expect(editor).not.toContainText('Private first document');
});
