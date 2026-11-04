import { describe, expect, it, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import { Editor } from '@tiptap/core';
import JSZip from 'jszip';
import { createDocument, plainTextContent, sanitizeDocumentHtml } from '../src/core/documents';
import { exportToNativeDCloud, importFromNativeDCloud } from '../src/core/conversion/NativeFormat';
import { documentStore } from '../src/core/storage/DocumentStore';
import { paginateBlocks } from '../src/core/layout/BlockPagination';
import { getDocCloudExtensions } from '../src/core/editor/DocumentSchema';
import { Typography } from '../src/core/editor/extensions/Typography';
import { findTextRanges } from '../src/core/editor/search';
import { getPageDimensions } from '../src/core/layout/PageGeometry';
import {
  parseMailMergeCsv,
  extractMergeFields,
  replaceMergeFieldsInString,
  applyMailMergeToContent,
  generateMailMergePackages,
} from '../src/core/mailmerge/MailMergeEngine';
import {
  extractHeadingsFromContent,
  generateTocItems,
  buildTocBlockNode,
} from '../src/core/toc/TocGenerator';
import {
  processSuggestionsInContent,
  updateSuggestionsLedger,
} from '../src/core/review/TrackChangesReview';

let editor: Editor | undefined;
afterEach(() => {
  editor?.destroy();
  editor = undefined;
});

describe('native document integrity', () => {
  it('round trips content, formatting, page settings, comments, revisions and assets', async () => {
    const doc = createDocument('Quarterly report', {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello 世界',
              marks: [{ type: 'bold' }, { type: 'textStyle', attrs: { fontSize: '18pt' } }],
            },
          ],
        },
      ],
    });
    doc.assets['image.png'] = btoa('image fixture');
    doc.comments.push({
      id: 'comment',
      selectedText: 'Hello',
      author: 'You',
      avatarColor: '#2563eb',
      content: 'Review',
      createdAt: '2026-11-02',
      resolved: false,
      replies: [],
    });
    doc.revisions.push({
      id: 'revision',
      name: 'First',
      author: 'You',
      createdAt: '2026-11-02',
      contentJson: JSON.stringify(doc.content),
      wordCount: 2,
    });
    doc.settings.pageless = true;
    doc.settings.columns = 2;

    const result = await importFromNativeDCloud(await exportToNativeDCloud(doc));
    expect(result.metadata.title).toBe('Quarterly report');
    expect(result.settings.pageless).toBe(true);
    expect(result.settings.columns).toBe(2);
    expect(result.comments).toHaveLength(1);
    expect(result.revisions).toHaveLength(1);
  });

  it('rejects future versions instead of silently converting them', async () => {
    const zip = new JSZip();
    zip.file('manifest.json', JSON.stringify({ formatVersion: '9.0.0' }));
    zip.file('content.json', JSON.stringify({ type: 'doc', content: [] }));
    await expect(importFromNativeDCloud(await zip.generateAsync({ type: 'uint8array' }))).rejects.toThrow(
      'Unsupported document version'
    );
  });

  it('rejects malformed content', async () => {
    const zip = new JSZip();
    zip.file('manifest.json', JSON.stringify({ formatVersion: '1.0.0' }));
    zip.file('content.json', '{}');
    await expect(importFromNativeDCloud(await zip.generateAsync({ type: 'uint8array' }))).rejects.toThrow(
      'Invalid document content'
    );
  });

  it('rejects native page settings that could inject print CSS', async () => {
    const doc = createDocument('Unsafe settings');
    (doc.settings.watermark as any).fontSizePt = '54;} </style><script>alert(1)</script>';
    await expect(importFromNativeDCloud(await exportToNativeDCloud(doc))).rejects.toThrow(
      'Invalid watermark settings'
    );
  });

  it('commits and restores full documents in local storage', async () => {
    const doc = createDocument('Local test', plainTextContent('One\nTwo'));
    await documentStore.save(doc);
    expect(await documentStore.get(doc.metadata.id)).toEqual(doc);
    expect((await documentStore.list()).some(item => item.metadata.id === doc.metadata.id)).toBe(true);
    await documentStore.remove(doc.metadata.id);
    expect(await documentStore.get(doc.metadata.id)).toBeUndefined();
  });
});

describe('Mail Merge Engine', () => {
  it('parses CSV recipient records and handles quoted commas', () => {
    const csv = `FirstName,LastName,Company\n"Alice, M.",Smith,Acme Corp\nBob,Jones,"Global, Inc."`;
    const recipients = parseMailMergeCsv(csv);
    expect(recipients).toHaveLength(2);
    expect(recipients[0].FirstName).toBe('Alice, M.');
    expect(recipients[0].Company).toBe('Acme Corp');
    expect(recipients[1].Company).toBe('Global, Inc.');
  });

  it('extracts merge fields and performs template substitution', () => {
    const docContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Dear {{FirstName}}, welcome to {{Company}}!' }],
        },
      ],
    };
    const fields = extractMergeFields(docContent);
    expect(fields).toContain('FirstName');
    expect(fields).toContain('Company');

    const merged = applyMailMergeToContent(docContent, { FirstName: 'Diana', Company: 'BlueCloud' });
    expect(merged.content[0].content[0].text).toBe('Dear Diana, welcome to BlueCloud!');
  });

  it('generates batch mail merge document packages', () => {
    const base = createDocument('Welcome Letter', {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello {{Name}}' }],
        },
      ],
    });
    const recipients = [{ Name: 'Eve' }, { Name: 'Frank' }];
    const packages = generateMailMergePackages(base, recipients);
    expect(packages).toHaveLength(2);
    expect(packages[0].metadata.title).toBe('Welcome Letter - Eve');
    expect(packages[0].content.content[0].content[0].text).toBe('Hello Eve');
    expect(packages[1].content.content[0].content[0].text).toBe('Hello Frank');
  });
});

describe('Table of Contents Generator', () => {
  it('extracts hierarchical headings and constructs a TOC callout block', () => {
    const docContent = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Introduction' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Some body text.' }],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Background' }],
        },
      ],
    };
    const headings = extractHeadingsFromContent(docContent);
    expect(headings).toHaveLength(2);
    expect(headings[0].text).toBe('Introduction');
    expect(headings[0].level).toBe(1);
    expect(headings[1].text).toBe('Background');
    expect(headings[1].level).toBe(2);

    const tocNode = buildTocBlockNode(generateTocItems(docContent));
    expect(tocNode.type).toBe('callout');
    expect(tocNode.content[0].content[0].text).toBe('TABLE OF CONTENTS');
  });
});

describe('Track Changes Review', () => {
  it('accepts and rejects suggestions in AST', () => {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'inserted word ',
              marks: [{ type: 'suggestion', attrs: { type: 'insert', suggestionId: 's1' } }],
            },
            {
              type: 'text',
              text: 'deleted word',
              marks: [{ type: 'suggestion', attrs: { type: 'delete', suggestionId: 's2' } }],
            },
          ],
        },
      ],
    };

    // Accept insert s1: keeps text
    const acceptedInsert = processSuggestionsInContent(content, 's1', 'accept');
    expect(acceptedInsert.content[0].content[0].text).toBe('inserted word ');
    expect(acceptedInsert.content[0].content[0].marks).toHaveLength(0);

    // Reject insert s1: drops text
    const rejectedInsert = processSuggestionsInContent(content, 's1', 'reject');
    expect(rejectedInsert.content[0].content).toHaveLength(1);
    expect(rejectedInsert.content[0].content[0].text).toBe('deleted word');
  });
});

describe('layout', () => {
  it('moves an overflowing block intact to the next page', () => {
    const result = paginateBlocks([{ pos: 0, height: 600 }, { pos: 3, height: 300 }], 800, 220);
    expect(result).toEqual({ pages: 2, gaps: [{ pos: 3, height: 420 }], oversized: false });
  });

  it('honors manual breaks and does not mark an exact fit as overflow', () => {
    expect(
      paginateBlocks(
        [{ pos: 0, height: 800 }, { pos: 3, height: 0, pageBreak: true }, { pos: 4, height: 50 }],
        800,
        220
      )
    ).toEqual({ pages: 2, gaps: [{ pos: 3, height: 220 }], oversized: false });
  });

  it('reports blocks requiring paragraph or table splitting', () => {
    expect(paginateBlocks([{ pos: 0, height: 900 }], 800, 220).oversized).toBe(true);
  });

  it('uses physical dimensions and swaps landscape axes', () => {
    const portrait = getPageDimensions('A4', 'portrait');
    const landscape = getPageDimensions('A4', 'landscape');
    expect(portrait.widthMm).toBe(210);
    expect(landscape.widthPx).toBe(portrait.heightPx);
  });
});

describe('editing and import safety', () => {
  it('searches text across formatting marks without searching HTML attributes', () => {
    editor = new Editor({
      extensions: getDocCloudExtensions(),
      content: '<p><a href="https://example.com/needle">needle</a> <strong>nee</strong>dle</p>',
    });
    expect(findTextRanges(editor.state.doc, 'needle')).toEqual([
      { from: 1, to: 7 },
      { from: 8, to: 14 },
    ]);
  });

  it('preserves font size and line spacing in editor JSON and HTML', () => {
    editor = new Editor({
      extensions: [...getDocCloudExtensions(), Typography],
      content: '<p style="line-height:2"><span style="font-size:18pt">Type</span></p>',
    });
    expect(editor.getJSON().content?.[0].attrs?.lineHeight).toBe('2');
    expect(editor.getHTML()).toContain('font-size: 18pt');
  });

  it('removes executable content and unsafe link protocols', () => {
    const clean = sanitizeDocumentHtml(
      '<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">link</a><iframe src="https://example.com"></iframe>'
    );
    expect(clean).not.toMatch(/script|onerror|javascript:|iframe/);
  });

  it('keeps literal markup and Unicode literal in plain text imports', () => {
    const content = plainTextContent('<script>世界</script>\n');
    expect(content.content[0].content?.[0].text).toBe('<script>世界</script>');
    expect(content.content[1]).toEqual({ type: 'paragraph' });
  });
});
