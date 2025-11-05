import { create } from "zustand";

export type FeedbackKind = "success" | "info" | "warning" | "error";

export type Feedback = {
  id: string;
  kind: FeedbackKind;
  message: string;
  ttl?: number; // tempo de vida (ms)
};

type State = {
  list: Feedback[];
  push: (f: Omit<Feedback, "id">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

/**
 * Hook global de feedback/toasts.
 * Use `useFeedback().push({ kind: "success", message: "Feito!" })`
 * em qualquer componente para mostrar uma mensagem.
 */
export const useFeedback = create<State>((set, get) => ({
  list: [],

  push: ({ kind, message, ttl = 3500 }) => {
    const id = crypto.randomUUID();
    set((s) => ({ list: [...s.list, { id, kind, message, ttl }] }));

    // Auto-remover após o TTL
    if (ttl > 0) setTimeout(() => get().remove(id), ttl);
  },

  remove: (id) => set((s) => ({ list: s.list.filter((f) => f.id !== id) })),

  clear: () => set({ list: [] }),
}));
