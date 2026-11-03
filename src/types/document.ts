import { PageSettings, HeaderFooterContent } from './layout';
import { DocumentComment, DocumentSuggestion, DocumentRevision } from './review';

export interface DocumentMetadata {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  filePath?: string;
  version: string;
  wordCount: number;
  characterCount: number;
  readingTimeMinutes: number;
}

export interface DocCloudFilePackage {
  formatVersion: '1.0.0';
  metadata: DocumentMetadata;
  settings: PageSettings;
  headerFooter: HeaderFooterContent;
  content: any; // ProseMirror JSON tree
  comments: DocumentComment[];
  suggestions: DocumentSuggestion[];
  revisions: DocumentRevision[];
  assets: Record<string, string>; // assetId -> base64 or relative path
}

export interface RecentDocumentItem {
  id: string;
  title: string;
  filePath?: string;
  updatedAt: string;
  previewText: string;
  wordCount: number;
  pinned: boolean;
}

export interface RecoverySnapshot {
  id: string;
  docId: string;
  title: string;
  timestamp: number;
  contentJson: string;
  settings: PageSettings;
  headerFooter: HeaderFooterContent;
}
