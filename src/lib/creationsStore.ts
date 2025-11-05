import { create } from "zustand";

export type Creation = {
  id: string;
  title?: string;
  dataUrl: string; // thumbnail base64
  createdAt: number;
};

type State = {
  items: Creation[];
  add: (c: Omit<Creation, "id" | "createdAt">) => { ok: boolean; error?: string };
  remove: (id: string) => void;
  clear: () => void;
  load: () => void;
};

const KEY = "ks:social:creations:v1";
const MAX_ITEMS = 120;

/** Salva lista no localStorage */
function saveToLS(items: Creation[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    // dispara evento global (para MyCreations reagir)
    try {
      window.dispatchEvent(new Event("kss:creations:changed"));
    } catch {}
  } catch (err) {
    console.error("Erro ao salvar localStorage:", err);
  }
}

/** Lê lista do localStorage */
function readFromLS(): Creation[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Creation[]) : [];
  } catch {
    return [];
  }
}

export const useCreations = create<State>((set, get) => ({
  items: [],

  load: () => {
    try {
      const items = readFromLS();
      set({ items });
    } catch (err) {
      console.error("Falha ao carregar criações:", err);
      set({ items: [] });
    }
  },

  add: (c) => {
    try {
      const now = Date.now();
      const id = crypto.randomUUID();
      let items = [{ id, createdAt: now, ...c }, ...get().items];
      if (items.length > MAX_ITEMS) items = items.slice(0, MAX_ITEMS);
      saveToLS(items);
      set({ items });
      return { ok: true };
    } catch (e: any) {
      console.error("Erro ao salvar criação:", e);
      return {
        ok: false,
        error:
          e?.name === "QuotaExceededError"
            ? "Espaço insuficiente no navegador."
            : "Falha ao salvar.",
      };
    }
  },

  remove: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    saveToLS(items);
    set({ items });
  },

  clear: () => {
    localStorage.removeItem(KEY);
    set({ items: [] });
  },
}));
