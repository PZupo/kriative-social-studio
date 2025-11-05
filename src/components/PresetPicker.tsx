import React from "react";
import { Preset } from "../lib/types";

const PRESETS: Preset[] = [
  { name: "Instagram Post", w: 1080, h: 1080 },
  { name: "Instagram Reel", w: 1080, h: 1920 },
  { name: "YouTube Thumbnail", w: 1280, h: 720 },
  { name: "Stories", w: 1080, h: 1920 },
];

export default function PresetPicker({
  preset,
  onChange,
}: {
  preset: Preset;
  onChange: (p: Preset) => void;
}) {
  return (
    <div className="row" aria-label="Formatos" role="group">
      {PRESETS.map((p) => {
        const active = p.name === preset.name;
        return (
          <button
            key={p.name}
            type="button"
            className={`chip ${active ? "is-active" : ""}`}
            aria-pressed={active}
            onClick={() => onChange(p)}
          >
            {p.name} {p.w}×{p.h}
          </button>
        );
      })}
    </div>
  );
}
