import React from "react";
import { useFeedback, type Feedback } from "@/hooks/useFeedback";

export default function FeedbackBox() {
  const { list, remove } = useFeedback();

  if (!list.length) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 space-y-2">
      {list.map((f: Feedback) => (
        <div
          key={f.id}
          className="rounded-xl px-3 py-2 shadow-lg text-white flex items-center gap-3"
          style={{
            background:
              f.kind === "success" ? "#16a34a" :
              f.kind === "warning" ? "#f59e0b" :
              f.kind === "error"   ? "#dc2626" : "#334155",
          }}
        >
          <span className="text-sm">{f.message}</span>
          <button
            onClick={() => remove(f.id)}
            className="ml-auto opacity-80 hover:opacity-100"
            aria-label="Fechar"
            title="Fechar"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
