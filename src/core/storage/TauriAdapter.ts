import { IStorageAdapter } from './StorageAdapter';
import { WebStorageAdapter } from './WebAdapter';
import { RecentDocumentItem, RecoverySnapshot } from '../../types/document';

export class TauriStorageAdapter extends WebStorageAdapter implements IStorageAdapter {
  isTauri(): boolean {
    return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  }

  async readFile(path: string): Promise<string> {
    if (!this.isTauri()) {
      return super.readFile(path);
    }
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<string>('read_file_content', { path });
  }

  async writeFileAtomic(path: string, content: string): Promise<void> {
    if (!this.isTauri()) {
      return super.writeFileAtomic(path, content);
    }
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('write_file_atomic', { path, content });
  }

  async readBinaryFile(path: string): Promise<Uint8Array> {
    if (!this.isTauri()) {
      return super.readBinaryFile(path);
    }
    const { invoke } = await import('@tauri-apps/api/core');
    const bytes = await invoke<number[]>('read_binary_file', { path });
    return new Uint8Array(bytes);
  }

  async writeBinaryFileAtomic(path: string, data: Uint8Array): Promise<void> {
    if (!this.isTauri()) {
      return super.writeBinaryFileAtomic(path, data);
    }
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('write_binary_file_atomic', { path, data: Array.from(data) });
  }

  async showOpenDialog(filters?: { name: string; extensions: string[] }[]): Promise<string | null> {
    if (!this.isTauri()) {
      return super.showOpenDialog(filters);
    }
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const selected = await open({
        multiple: false,
        directory: false,
        filters: filters || [
          { name: 'Doc Cloud Document', extensions: ['dcloud'] },
          { name: 'Microsoft Word', extensions: ['docx'] },
          { name: 'OpenDocument Text', extensions: ['odt'] },
          { name: 'Rich Text Format', extensions: ['rtf'] },
          { name: 'Markdown', extensions: ['md'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });
      return typeof selected === 'string' ? selected : null;
    } catch {
      return super.showOpenDialog(filters);
    }
  }

  async showSaveDialog(defaultPath?: string, filters?: { name: string; extensions: string[] }[]): Promise<string | null> {
    if (!this.isTauri()) {
      return super.showSaveDialog(defaultPath, filters);
    }
    try {
      const { save } = await import('@tauri-apps/plugin-dialog');
      const selected = await save({
        defaultPath: defaultPath || 'untitled.dcloud',
        filters: filters || [
          { name: 'Doc Cloud Document', extensions: ['dcloud'] },
          { name: 'Microsoft Word', extensions: ['docx'] },
          { name: 'PDF Document', extensions: ['pdf'] },
          { name: 'Markdown', extensions: ['md'] },
          { name: 'HTML Document', extensions: ['html'] },
          { name: 'Plain Text', extensions: ['txt'] },
        ],
      });
      return selected;
    } catch {
      return super.showSaveDialog(defaultPath, filters);
    }
  }
}

let activeAdapter: IStorageAdapter | null = null;

export function getStorageAdapter(): IStorageAdapter {
  if (!activeAdapter) {
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      activeAdapter = new TauriStorageAdapter();
    } else {
      activeAdapter = new WebStorageAdapter();
    }
  }
  return activeAdapter;
}
