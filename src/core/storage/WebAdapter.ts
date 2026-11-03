import { IStorageAdapter } from './StorageAdapter';
import { RecentDocumentItem, RecoverySnapshot } from '../../types/document';

const RECENTS_KEY = 'doccloud_recent_documents';
const RECOVERY_KEY = 'doccloud_recovery_snapshots';

export class WebStorageAdapter implements IStorageAdapter {
  isTauri(): boolean {
    return false;
  }

  async readFile(path: string): Promise<string> {
    const stored = localStorage.getItem(`doccloud_file_${path}`);
    if (stored !== null) return stored;
    throw new Error(`File not found in local storage: ${path}`);
  }

  async writeFileAtomic(path: string, content: string): Promise<void> {
    localStorage.setItem(`doccloud_file_${path}`, content);
  }

  async readBinaryFile(path: string): Promise<Uint8Array> {
    const raw = localStorage.getItem(`doccloud_bin_${path}`);
    if (!raw) throw new Error(`Binary file not found: ${path}`);
    const binStr = atob(raw);
    const len = binStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return bytes;
  }

  async writeBinaryFileAtomic(path: string, data: Uint8Array): Promise<void> {
    let binStr = '';
    const len = data.byteLength;
    for (let i = 0; i < len; i++) {
      binStr += String.fromCharCode(data[i]);
    }
    localStorage.setItem(`doccloud_bin_${path}`, btoa(binStr));
  }

  async showOpenDialog(_filters?: { name: string; extensions: string[] }[]): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.dcloud,.docx,.odt,.rtf,.txt,.md,.html';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          resolve(file.name);
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }

  async showSaveDialog(defaultPath?: string, _filters?: { name: string; extensions: string[] }[]): Promise<string | null> {
    return defaultPath || 'untitled.dcloud';
  }

  async getRecentDocuments(): Promise<RecentDocumentItem[]> {
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async saveRecentDocument(item: RecentDocumentItem): Promise<void> {
    const recents = await this.getRecentDocuments();
    const filtered = recents.filter((r) => r.id !== item.id && r.filePath !== item.filePath);
    filtered.unshift(item);
    // keep top 30
    const trimmed = filtered.slice(0, 30);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(trimmed));
  }

  async removeRecentDocument(id: string): Promise<void> {
    const recents = await this.getRecentDocuments();
    const updated = recents.filter((r) => r.id !== id);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
  }

  async clearRecents(): Promise<void> {
    localStorage.removeItem(RECENTS_KEY);
  }

  async saveRecoverySnapshot(snapshot: RecoverySnapshot): Promise<void> {
    try {
      const snapshots = await this.getRecoverySnapshots();
      const filtered = snapshots.filter((s) => s.docId !== snapshot.docId);
      filtered.unshift(snapshot);
      localStorage.setItem(RECOVERY_KEY, JSON.stringify(filtered.slice(0, 10)));
    } catch (e) {
      console.warn('Failed to save recovery snapshot:', e);
    }
  }

  async getRecoverySnapshots(): Promise<RecoverySnapshot[]> {
    try {
      const raw = localStorage.getItem(RECOVERY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async clearRecoverySnapshot(docId: string): Promise<void> {
    const snapshots = await this.getRecoverySnapshots();
    const filtered = snapshots.filter((s) => s.docId !== docId);
    localStorage.setItem(RECOVERY_KEY, JSON.stringify(filtered));
  }
}
