import React from "react";
import { KssStyle } from "../lib/types";

interface StylePickerProps {
  value: KssStyle;          // agora sempre string
  onChange: (val: KssStyle) => void;  // tipado como string
}

// Lista fixa de estilos
const STYLES = [
  { id: "disney", name: "Disney 3D", emoji: "✨" },
  { id: "realistic", name: "Realista", emoji: "📸" },
  { id: "anime", name: "Anime", emoji: "🌸" },
  { id: "cyberpunk", name: "Cyberpunk", emoji: "🤖" },
  { id: "watercolor", name: "Aquarela", emoji: "🎨" },
  { id: "minimal", name: "Minimalista", emoji: "⚪" },
  { id: "popart", name: "Pop Art", emoji: "💥" },
  { id: "pixel", name: "Pixel Art", emoji: "👾" },
];

export default function StylePicker({ value, onChange }: StylePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => onChange(style.id)}  // passa string
          className={`
            flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all text-left
            ${value === style.id 
              ? "bg-teal-500/10 border-teal-500 text-teal-400" 
              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"}
          `}
        >
          <span className="text-lg">{style.emoji}</span>
          <span>{style.name}</span>
        </button>
      ))}
    </div>
  );
}