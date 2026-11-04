import JSZip from 'jszip';
import { DocCloudFilePackage, DocumentMetadata } from '../../types/document';
import { PageSettings, HeaderFooterContent } from '../../types/layout';
import { DocumentComment, DocumentSuggestion, DocumentRevision } from '../../types/review';
import { getDefaultPageSettings } from '../layout/PageGeometry';

function validateSettings(settings: PageSettings) {
  const number = (value: unknown, min: number, max: number) =>
    typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
  if (!['A4', 'Letter', 'Legal', 'A3', 'A5', 'Executive', 'Custom'].includes(settings.format) || !['portrait', 'landscape'].includes(settings.orientation))
    throw new Error('Invalid page format');
  if (settings.format === 'Custom' && (!number(settings.customWidthMm, 50, 1000) || !number(settings.customHeightMm, 50, 1000)))
    throw new Error('Invalid custom page dimensions');
  for (const field of ['topMm', 'bottomMm', 'leftMm', 'rightMm', 'topPx', 'bottomPx', 'leftPx', 'rightPx'] as const) {
    if (!number(settings.margins[field], 0, field.endsWith('Px') ? 2000 : 500)) throw new Error('Invalid page margins');
  }
  if (
    settings.watermark &&
    (typeof settings.watermark.text !== 'string' ||
      !/^#[0-9a-f]{6}$/i.test(settings.watermark.color) ||
      !number(settings.watermark.angle, -360, 360) ||
      !number(settings.watermark.fontSizePt, 1, 200) ||
      !number(settings.watermark.opacity, 0, 1))
  )
    throw new Error('Invalid watermark settings');
}

export async function exportToNativeDCloud(pkg: DocCloudFilePackage): Promise<Uint8Array> {
  const zip = new JSZip();

  // Root manifest
  const manifest = {
    format: 'Doc Cloud Document',
    formatVersion: pkg.formatVersion || '1.0.0',
    generator: 'Doc Cloud Desktop 1.0.0 (BlueCloud AI Technologies)',
    createdAt: pkg.metadata.createdAt,
    updatedAt: pkg.metadata.updatedAt,
  };
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // Document metadata
  zip.file('metadata.json', JSON.stringify(pkg.metadata, null, 2));

  // Page setup & styling settings
  zip.file('settings.json', JSON.stringify(pkg.settings, null, 2));

  // Header & Footer content
  zip.file('headerFooter.json', JSON.stringify(pkg.headerFooter, null, 2));

  // ProseMirror Document AST
  zip.file('content.json', JSON.stringify(pkg.content, null, 2));

  // Comments
  zip.file('comments.json', JSON.stringify(pkg.comments || [], null, 2));

  // Suggestions / Track Changes
  zip.file('suggestions.json', JSON.stringify(pkg.suggestions || [], null, 2));

  // Named Revisions
  zip.file('revisions.json', JSON.stringify(pkg.revisions || [], null, 2));

  // Sections
  if (pkg.sections) {
    zip.file('sections.json', JSON.stringify(pkg.sections, null, 2));
  }

  // Mail Merge configuration
  if (pkg.mailMerge) {
    zip.file('mailMerge.json', JSON.stringify(pkg.mailMerge, null, 2));
  }

  // Table of Contents
  if (pkg.toc) {
    zip.file('toc.json', JSON.stringify(pkg.toc, null, 2));
  }

  // Assets folder
  const assetsFolder = zip.folder('assets');
  if (assetsFolder && pkg.assets) {
    for (const [name, base64Data] of Object.entries(pkg.assets)) {
      assetsFolder.file(name, base64Data, { base64: true });
    }
  }

  return zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

export async function importFromNativeDCloud(data: Uint8Array | ArrayBuffer): Promise<DocCloudFilePackage> {
  if (data.byteLength > 50 * 1024 * 1024) throw new Error('Document exceeds the 50 MB import limit');
  const zip = await JSZip.loadAsync(data);
  const manifestFile = zip.file('manifest.json');
  if (!manifestFile) throw new Error('Invalid .dcloud package: missing manifest.json');
  const manifest = JSON.parse(await manifestFile.async('text'));
  if (manifest.formatVersion !== '1.0.0') throw new Error(`Unsupported document version: ${manifest.formatVersion}`);

  // Content is mandatory
  const contentFile = zip.file('content.json');
  if (!contentFile) {
    throw new Error('Invalid .dcloud package: missing content.json');
  }
  const contentStr = await contentFile.async('text');
  const content = JSON.parse(contentStr);
  if (content?.type !== 'doc' || !Array.isArray(content.content)) throw new Error('Invalid document content');

  // Metadata
  let metadata: DocumentMetadata = {
    id: `doc_${Date.now()}`,
    title: 'Untitled Document',
    author: 'Author',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0.0',
    wordCount: 0,
    characterCount: 0,
    readingTimeMinutes: 0,
  };
  const metaFile = zip.file('metadata.json');
  if (metaFile) {
    metadata = JSON.parse(await metaFile.async('text'));
  }

  // Settings
  let settings: PageSettings = getDefaultPageSettings();
  const settingsFile = zip.file('settings.json');
  if (settingsFile) {
    const saved = JSON.parse(await settingsFile.async('text'));
    settings = { ...settings, ...saved, margins: { ...settings.margins, ...saved.margins } };
  }

  // Header / Footer
  let headerFooter: any = {
    headerLeft: '',
    headerCenter: '',
    headerRight: '',
    footerLeft: '',
    footerCenter: 'Page {page} of {pages}',
    footerRight: '',
  };
  const hfFile = zip.file('headerFooter.json');
  if (hfFile) {
    headerFooter = JSON.parse(await hfFile.async('text'));
  }

  // Comments
  let comments: DocumentComment[] = [];
  const commentsFile = zip.file('comments.json');
  if (commentsFile) {
    comments = JSON.parse(await commentsFile.async('text'));
  }

  // Suggestions
  let suggestions: DocumentSuggestion[] = [];
  const suggestionsFile = zip.file('suggestions.json');
  if (suggestionsFile) {
    suggestions = JSON.parse(await suggestionsFile.async('text'));
  }

  // Revisions
  let revisions: DocumentRevision[] = [];
  const revFile = zip.file('revisions.json');
  if (revFile) {
    revisions = JSON.parse(await revFile.async('text'));
  }

  // Sections
  let sections: any[] | undefined;
  const sectionsFile = zip.file('sections.json');
  if (sectionsFile) {
    sections = JSON.parse(await sectionsFile.async('text'));
  }

  // Mail Merge
  let mailMerge: any | undefined;
  const mmFile = zip.file('mailMerge.json');
  if (mmFile) {
    mailMerge = JSON.parse(await mmFile.async('text'));
  }

  // Table of Contents
  let toc: any[] | undefined;
  const tocFile = zip.file('toc.json');
  if (tocFile) {
    toc = JSON.parse(await tocFile.async('text'));
  }

  if (typeof metadata.id !== 'string' || typeof metadata.title !== 'string') throw new Error('Invalid document metadata');
  validateSettings(settings);
  if (!Object.values(headerFooter).every(value => typeof value === 'string')) throw new Error('Invalid header/footer fields');
  if (!Array.isArray(comments) || !comments.every(comment => typeof comment.id === 'string' && typeof comment.content === 'string' && Array.isArray(comment.replies))) throw new Error('Invalid comments');
  if (!Array.isArray(revisions) || !revisions.every(revision => typeof revision.contentJson === 'string')) throw new Error('Invalid versions');

  const assets: Record<string, string> = {};
  const assetFiles = Object.values(zip.files).filter(file => file.name.startsWith('assets/') && !file.dir);
  for (const file of assetFiles) assets[file.name.slice('assets/'.length)] = await file.async('base64');

  return {
    formatVersion: '1.0.0',
    metadata,
    settings,
    headerFooter,
    content,
    comments,
    suggestions,
    revisions,
    assets,
    sections,
    mailMerge,
    toc,
  };
}
