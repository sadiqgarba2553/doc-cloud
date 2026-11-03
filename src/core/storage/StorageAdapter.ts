import { RecentDocumentItem, RecoverySnapshot } from '../../types/document';

export interface IStorageAdapter {
  isTauri(): boolean;
  readFile(path: string): Promise<string>;
  writeFileAtomic(path: string, content: string): Promise<void>;
  readBinaryFile(path: string): Promise<Uint8Array>;
  writeBinaryFileAtomic(path: string, data: Uint8Array): Promise<void>;
  showOpenDialog(filters?: { name: string; extensions: string[] }[]): Promise<string | null>;
  showSaveDialog(defaultPath?: string, filters?: { name: string; extensions: string[] }[]): Promise<string | null>;
  
  // Recents & Metadata storage
  getRecentDocuments(): Promise<RecentDocumentItem[]>;
  saveRecentDocument(item: RecentDocumentItem): Promise<void>;
  removeRecentDocument(id: string): Promise<void>;
  clearRecents(): Promise<void>;

  // Disaster Recovery Snapshots
  saveRecoverySnapshot(snapshot: RecoverySnapshot): Promise<void>;
  getRecoverySnapshots(): Promise<RecoverySnapshot[]>;
  clearRecoverySnapshot(docId: string): Promise<void>;
}
