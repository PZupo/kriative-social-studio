// src/lib/toast.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "info" | "error";

export type ToastMessage = {
  id: string;
  type: ToastType;
  text: string;
};

type ToastContextValue = {
  pushToast: (type: ToastType, text: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  function pushToast(type: ToastType, text: string) {
    const id = crypto.randomUUID();
    const msg: ToastMessage = { id, type, text };
    setToasts((prev) => [...prev, msg]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}

      {/* Área visual dos toasts */}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-xl shadow-lg backdrop-blur text-sm border 
              ${
                t.type === "success"
                  ? "bg-emerald-600/90 text-white border-emerald-300/30"
                  : t.type === "error"
                  ? "bg-red-600/90 text-white border-red-300/30"
                  : "bg-slate-800/80 text-slate-100 border-slate-600/30"
              }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside <ToastProvider>");
  return ctx;
}
