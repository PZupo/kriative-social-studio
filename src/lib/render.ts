// src/lib/render.ts
import { KssStyle } from "./types";

/**
 * Paletas por estilo (usadas em thumbnails simples ou fundos auxiliares)
 */
export const STYLE_PALETTES: Record<KssStyle, [string, string]> = {
  disney: ["#fef3c7", "#fde68a"],
  cyberpunk: ["#0f172a", "#0ea5e9"],
  ghibli: ["#e0f2fe", "#bbf7d0"],
  noir: ["#111827", "#1f2937"],
  watercolor: ["#fafafa", "#e6f2ff"], // (antes "aquarela")
  neon: ["#0b0f19", "#7dd3fc"],
  papercut: ["#fff7ed", "#fde68a"],
};

/**
 * Desenhos de fundo simples por estilo (opcional)
 */
export const STYLE_BACKGROUND_DRAW: Record<
  KssStyle,
  (ctx: CanvasRenderingContext2D, w: number, h: number) => void
> = {
  disney(c, w, h) {
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#fef3c7");
    g.addColorStop(1, "#fde68a");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  },
  cyberpunk(c, w, h) {
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0f172a");
    g.addColorStop(1, "#0ea5e9");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  },
  ghibli(c, w, h) {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#e0f2fe");
    g.addColorStop(1, "#bbf7d0");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  },
  noir(c, w, h) {
    c.fillStyle = "#111827";
    c.fillRect(0, 0, w, h);
  },
  watercolor(c, w, h) {
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#fafafa");
    g.addColorStop(1, "#e6f2ff");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  },
  neon(c, w, h) {
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0b0f19");
    g.addColorStop(1, "#7dd3fc");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  },
  papercut(c, w, h) {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#fff7ed");
    g.addColorStop(1, "#fde68a");
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  },
};
