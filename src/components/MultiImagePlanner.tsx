// src/components/MultiImagePlanner.tsx
import React from "react";
import type { BatchPlan } from "../lib/types";

type Props = {
  value: BatchPlan;
  onChange: (plan: BatchPlan) => void;
};

const modes: { id: BatchPlan["mode"]; label: string }[] = [
  { id: "single" as BatchPlan["mode"], label: "Single" },
  { id: "carousel" as BatchPlan["mode"], label: "Carousel" },
  // GRID removido do UI; se existir no tipo, continua válido internamente
];

export default function MultiImagePlanner({ value, onChange }: Props) {
  const handleModeChange = (mode: BatchPlan["mode"]) => {
    onChange({ ...value, mode });
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10);
    if (Number.isNaN(n) || n <= 0) {
      onChange({ ...value, count: 1 });
    } else {
      onChange({ ...value, count: n });
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="row" style={{ gap: 8 }}>
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            className={
              value.mode === m.id
                ? "btn btn--primary"
                : "btn"
            }
            onClick={() => handleModeChange(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="row" style={{ gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 13, opacity: 0.8 }}>Qtd.</span>
        <input
          type="number"
          min={1}
          className="input"
          style={{ maxWidth: 80 }}
          value={value.count}
          onChange={handleCountChange}
        />
      </div>
    </div>
  );
}
