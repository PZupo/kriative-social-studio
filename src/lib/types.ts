// src/lib/types.ts
export type Preset = { name: string; w: number; h: number };

export type Idea = {
  topic: string;
  audience: string;
  goal: string;
};

export type TextBundle = {
  title: string;
  copy: string;
  caption: string;
  hashtags: string[];
};

export type BatchPlan = {
  mode: "carousel" | "grid" | "single";
  count: number;
};

/** 🎨 Estilos visuais suportados no app */
export type KssStyle =
  | "disney"
  | "cyberpunk"
  | "ghibli"
  | "noir"
  | "watercolor"   // novo
  | "neon"         // novo
  | "papercut";    // novo
