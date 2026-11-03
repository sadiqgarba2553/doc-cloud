import { DocCloudFilePackage } from '../../types/document';

const database = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open('doccloud', 1);
  request.onupgradeneeded = () => request.result.createObjectStore('documents', { keyPath: 'metadata.id' });
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

async function transaction<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', mode);
    const request = operation(tx.objectStore('documents'));
    tx.oncomplete = () => { db.close(); resolve(request.result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error ?? new Error('Local save was interrupted')); };
  });
}

export const documentStore = {
  save: (doc: DocCloudFilePackage) => transaction('readwrite', store => store.put(doc)),
  get: (id: string): Promise<DocCloudFilePackage | undefined> => transaction('readonly', store => store.get(id)),
  list: (): Promise<DocCloudFilePackage[]> => transaction('readonly', store => store.getAll()),
  remove: (id: string) => transaction('readwrite', store => store.delete(id)),
};
