// src/components/MultiImagePlanner.tsx
import React from "react";
import { BatchPlan } from "@/lib/types";

type Props = {
  value: BatchPlan;
  onChange: (p: BatchPlan) => void;
};

export default function MultiImagePlanner({ value, onChange }: Props) {
  const setMode = (mode: BatchPlan["mode"]) => onChange({ ...value, mode });
  const setCount = (count: number) => onChange({ ...value, count });

  // saneamento leve
  const safeCount =
    value.mode === "single" ? 1 : Math.max(1, Math.min(10, value.count || 1));

  return (
    <div className="row" style={{ gap: 8 }}>
      {/* modos */}
      <div className="row" style={{ gap: 6 }}>
        <button
          className={`btn ${value.mode === "single" ? "btn--primary" : ""}`}
          onClick={() => setMode("single")}
          type="button"
        >
          Single
        </button>
        <button
          className={`btn ${value.mode === "carousel" ? "btn--primary" : ""}`}
          onClick={() => setMode("carousel")}
          type="button"
        >
          Carousel
        </button>
        <button
          className={`btn ${value.mode === "grid" ? "btn--primary" : ""}`}
          onClick={() => setMode("grid")}
          type="button"
        >
          Grid
        </button>
      </div>

      {/* quantidade (quando aplica) */}
      {value.mode !== "single" && (
        <div className="row" style={{ gap: 6, alignItems: "center" }}>
          <span className="chip">Qtd.</span>
          <input
            type="number"
            min={1}
            max={10}
            value={safeCount}
            onChange={(e) => setCount(parseInt(e.target.value || "1", 10))}
            className="input"
            style={{ width: 80 }}
          />
        </div>
      )}
    </div>
  );
}
