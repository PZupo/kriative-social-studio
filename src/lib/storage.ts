// lib/storage.ts
export type Creation = {
  id: string;
  dataURL: string;
  createdAt: string; // ISO
  meta: any;
};

const KEY = 'kss_creations';

function readAll(): Creation[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function writeAll(list: Creation[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  try { window.dispatchEvent(new CustomEvent('kss:creations:changed')); } catch {}
}

export function saveCreation(c: Omit<Creation, 'id' | 'createdAt'>) {
  const list = readAll();
  const id = 'kss-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
  const createdAt = new Date().toISOString();
  list.unshift({ id, createdAt, ...c });
  writeAll(list);
  return id;
}

export function listCreations(): Creation[] { return readAll(); }

export function removeCreation(id: string) {
  const list = readAll().filter(c => c.id !== id);
  writeAll(list);
}
