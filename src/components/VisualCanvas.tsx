import React from "react";
import { Idea, TextBundle, KssStyle, Preset } from "../lib/types";
import { useRef, useMemo, useEffect } from "react";
import { useCreations } from "@/lib/creationsStore";
import { captureThumbnail } from "@/lib/captureThumb";
import { useFeedback } from "@/hooks/useFeedback";

/**
 * Renderização ESTÁVEL no canvas (sem overlays):
 * - Desenha fundo (imagem enviada ou fundo procedural)
 * - Aplica efeitos por estilo (saturação/contraste/tint/vignette)
 * - Opcional: tarja superior com título do post
 * - Desenha TODOS os campos de texto: title, copy, caption, hashtags
 *
 * Inclui botão "Salvar criação" que captura miniatura (JPEG) e salva em Minhas Criações.
 */

type Props = {
  id: string;
  preset: Preset;
  styleKey: KssStyle;
  idea: Idea;
  text: TextBundle;
  seed: number;
  baseImage: string | null;
  showTopBand: boolean;
};

export default function VisualCanvas({
  id,
  preset,
  styleKey,
  idea,
  text,
  seed,
  baseImage,
  showTopBand,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const { add } = useCreations();
  const { push } = useFeedback();

  // RNG determinístico para o fundo procedural
  const rng = useMemo(() => {
    let s = seed >>> 0;
    return () => {
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17; s >>>= 0;
      s ^= s << 5;  s >>>= 0;
      return (s >>> 0) / 0xffffffff;
    };
  }, [seed]);

  // Render
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    const { w, h } = preset;
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    // 1) Base
    const drawBase = async () => {
      if (baseImage) {
        try {
          const img = await loadImage(baseImage);
          const scale = Math.max(w / img.width, h / img.height);
          const dw = img.width * scale,
            dh = img.height * scale;
          const dx = (w - dw) / 2,
            dy = (h - dh) / 2;
          ctx.drawImage(img, dx, dy, dw, dh);
        } catch {
          drawBackground(ctx, w, h, styleKey, rng);
        }
      } else {
        drawBackground(ctx, w, h, styleKey, rng);
      }
    };

    // 2) Efeitos
    const applyStyle = () => {
      const p = styleParams(styleKey);
      applyColorGrade(ctx, w, h, p.sat, p.contrast, p.tint);
      applyGrain(ctx, w, h, styleKey === "noir" ? 0.1 : 0.06, rng);
      drawVignette(ctx, w, h, p.vignette);
    };

    // 3) Tarja
    const drawBand = () => {
      if (!showTopBand) return;
      const t = (text?.title || idea?.topic || "Kriative Social Studio").trim();
      drawTopBand(ctx, w, h, t);
    };

    // 4) Texto
    const drawTextBlocks = () => {
      const pack = buildTextBlocks(preset, text, idea);

      // Tema
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";

      const plate = isDark ? "rgba(0,0,0,0.44)" : "rgba(0,0,0,0.38)";
      const ink = "#fff";

      pack.forEach((block) => {
        // Quebra em linhas
        setFont(ctx, block.fontSize, block.weight);
        ctx.textAlign = block.align;
        ctx.textBaseline = "top";
        const lines = wrapText(ctx, block.text, block.maxWidth);

        // Dimensão da placa
        const padX = 14;
        const padY = 10;
        const lineH = Math.round(block.fontSize * block.lineHeight);
        const plateH = padY * 2 + lineH * lines.length;

        // Fundo
        ctx.fillStyle = plate;
        roundRect(
          ctx,
          block.x,
          block.y,
          block.maxWidth + padX * 2,
          plateH,
          12
        );
        ctx.fill();

        // Texto
        ctx.fillStyle = ink;
        let ty = block.y + padY;
        const tx = block.x + padX;
        lines.forEach((ln) => {
          ctx.fillText(ln, tx, ty);
          ty += lineH;
        });
      });
    };

    (async () => {
      ctx.clearRect(0, 0, w, h);
      await drawBase();
      applyStyle();
      drawBand();
      drawTextBlocks();
    })();
  }, [preset, styleKey, baseImage, showTopBand, idea, text, rng]);

  // Salvar criação (miniatura comprimida usando o container root)
  async function handleSave() {
    try {
      const el = rootRef.current;
      const cvs = canvasRef.current;
      if (!el || !cvs) return;

      // Preferimos capturar o "card" (root) para dar contexto visual se houver bordas/sombra
      // mas poderíamos usar cvs.toDataURL("image/jpeg", 0.85) se quiser só o canvas.
      const dataUrl = await captureThumbnail(el, 360);

      const res = add({ dataUrl, title: (text?.title || idea?.topic || "Post") });
      if (res.ok) {
        push({ kind: "success", message: "Criação salva em Minhas Criações." });
      } else {
        push({
          kind: "warning",
          message: res.error ?? "Falha ao salvar.",
        });
      }
    } catch {
      push({ kind: "error", message: "Erro ao capturar miniatura." });
    }
  }

  return (
    <div ref={rootRef} className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm"
        >
          Salvar criação
        </button>
      </div>

      <canvas
        id={id}
        ref={canvasRef}
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </div>
  );
}

/* ================= helpers ================= */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function clampByte(n: number) {
  return Math.max(0, Math.min(255, n | 0));
}

function setFont(
  ctx: CanvasRenderingContext2D,
  px: number,
  weight: number = 600
) {
  ctx.font = `${weight} ${px}px Poppins, system-ui, sans-serif`;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width <= maxWidth) line = test;
    else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawVignette(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  strength: number
) {
  const grd = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.3,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.65
  );
  grd.addColorStop(0, "rgba(0,0,0,0)");
  grd.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
}

function applyGrain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  amount = 0.06,
  rng: () => number
) {
  const idata = ctx.getImageData(0, 0, w, h);
  const data = idata.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (rng() - 0.5) * 255 * amount;
    data[i] = clampByte(data[i] + n);
    data[i + 1] = clampByte(data[i + 1] + n);
    data[i + 2] = clampByte(data[i + 2] + n);
  }
  ctx.putImageData(idata, 0, 0);
}

function applyColorGrade(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  sat: number,
  contrast: number,
  tint: [number, number, number]
) {
  const idata = ctx.getImageData(0, 0, w, h);
  const data = idata.data;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const avg = (r + g + b) / 3;
    r = avg + (r - avg) * sat;
    g = avg + (g - avg) * sat;
    b = avg + (b - avg) * sat;
    r = (r - 128) * contrast + 128;
    g = (g - 128) * contrast + 128;
    b = (b - 128) * contrast + 128;
    r = r * 0.92 + tint[0] * 0.08;
    g = g * 0.92 + tint[1] * 0.08;
    b = b * 0.92 + tint[2] * 0.08;
    data[i] = clampByte(r);
    data[i + 1] = clampByte(g);
    data[i + 2] = clampByte(b);
  }
  ctx.putImageData(idata, 0, 0);
}

function styleParams(styleKey: KssStyle) {
  switch (styleKey) {
    case "disney":
      return {
        sat: 1.15,
        contrast: 1.05,
        tint: [255, 220, 200] as [number, number, number],
        vignette: 0.15,
      };
    case "cyberpunk":
      return {
        sat: 1.35,
        contrast: 1.12,
        tint: [120, 180, 255] as [number, number, number],
        vignette: 0.25,
      };
    case "ghibli":
      return {
        sat: 1.1,
        contrast: 1.03,
        tint: [210, 240, 200] as [number, number, number],
        vignette: 0.12,
      };
    case "noir":
      return {
        sat: 0.0,
        contrast: 1.2,
        tint: [220, 220, 220] as [number, number, number],
        vignette: 0.3,
      };
    case "watercolor":
      return {
        sat: 1.05,
        contrast: 0.98,
        tint: [235, 245, 255] as [number, number, number],
        vignette: 0.1,
      };
    case "neon":
      return {
        sat: 1.45,
        contrast: 1.18,
        tint: [140, 190, 255] as [number, number, number],
        vignette: 0.22,
      };
    case "papercut":
      return {
        sat: 1.0,
        contrast: 1.06,
        tint: [250, 240, 220] as [number, number, number],
        vignette: 0.14,
      };
    default:
      return {
        sat: 1.0,
        contrast: 1.0,
        tint: [255, 255, 255] as [number, number, number],
        vignette: 0.18,
      };
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  styleKey: KssStyle,
  rng: () => number
) {
  let g: CanvasGradient | null = null;
  if (styleKey === "cyberpunk") {
    g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0f172a");
    g.addColorStop(1, "#0ea5e9");
  } else if (styleKey === "ghibli") {
    g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#e0f2fe");
    g.addColorStop(1, "#bbf7d0");
  } else if (styleKey === "noir") {
    ctx.fillStyle = "#111827";
  } else if (styleKey === "watercolor") {
    g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#fafafa");
    g.addColorStop(1, "#e6f2ff");
  } else if (styleKey === "neon") {
    g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#0b0f19");
    g.addColorStop(1, "#7dd3fc");
  } else if (styleKey === "papercut") {
    g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#fff7ed");
    g.addColorStop(1, "#fde68a");
  } else {
    g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#f8fafc");
    g.addColorStop(1, "#e2e8f0");
  }
  if (g) {
    ctx.fillStyle = g;
  }
  ctx.fillRect(0, 0, w, h);

  // manchas/luzes suaves
  for (let i = 0; i < 6; i++) {
    const xx = rng() * w,
      yy = rng() * h,
      rr = Math.max(w, h) * (0.05 + rng() * 0.12);
    ctx.beginPath();
    ctx.arc(xx, yy, rr, 0, Math.PI * 2);
    const alpha = 0.06 + rng() * 0.08;
    ctx.fillStyle = `rgba(${Math.floor(120 + rng() * 100)},${Math.floor(
      120 + rng() * 100
    )},${Math.floor(120 + rng() * 100)},${alpha})`;
    ctx.fill();
  }
}

function drawTopBand(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string
) {
  const bandH = Math.floor(h * 0.08);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, w, bandH);
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  setFont(ctx, Math.floor(bandH * 0.45), 800);
  ctx.fillText(
    title || "Kriative Social Studio",
    Math.floor(w * 0.04),
    Math.floor(bandH / 2)
  );
}

/** Constrói os blocos de texto com tamanhos proporcionais ao preset */
function buildTextBlocks(preset: Preset, text: TextBundle, idea: Idea) {
  const { w, h } = preset;
  const padX = Math.floor(w * 0.04);
  const maxW = w >= h ? Math.floor(w * 0.68) : Math.floor(w * 0.78);

  const title = (text?.title || idea?.topic || "Título").trim();
  const copy = (text?.copy || "").trim();
  const caption = (text?.caption || "").trim();
  const tags = (text?.hashtags || [])
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : "#" + t))
    .join("  ");

  const fsTitle = clamp(Math.floor(w * 0.048), 22, 56);
  const fsCopy = clamp(Math.floor(w * 0.024), 16, 32);
  const fsCaption = clamp(Math.floor(w * 0.02), 14, 24);
  const fsTags = clamp(Math.floor(w * 0.018), 12, 20);

  const blocks: Array<{
    id: string;
    text: string;
    x: number;
    y: number;
    maxWidth: number;
    fontSize: number;
    weight: number;
    lineHeight: number;
    align: CanvasTextAlign;
  }> = [];

  let cursorY = Math.floor(h * 0.1); // início abaixo da tarja (quando houver)

  if (title) {
    blocks.push({
      id: "title",
      text: title,
      x: padX,
      y: cursorY,
      maxWidth: maxW,
      fontSize: fsTitle,
      weight: 800,
      lineHeight: 1.3,
      align: "left",
    });
    cursorY += estimateBlockHeight(fsTitle, 1.3, title, maxW) + Math.floor(h * 0.02);
  }

  if (copy) {
    blocks.push({
      id: "copy",
      text: copy,
      x: padX,
      y: cursorY,
      maxWidth: maxW,
      fontSize: fsCopy,
      weight: 600,
      lineHeight: 1.35,
      align: "left",
    });
    cursorY += estimateBlockHeight(fsCopy, 1.35, copy, maxW) + Math.floor(h * 0.018);
  }

  if (caption) {
    blocks.push({
      id: "caption",
      text: caption,
      x: padX,
      y: cursorY,
      maxWidth: maxW,
      fontSize: fsCaption,
      weight: 500,
      lineHeight: 1.35,
      align: "left",
    });
    cursorY +=
      estimateBlockHeight(fsCaption, 1.35, caption, maxW) + Math.floor(h * 0.016);
  }

  if (tags) {
    const bottomPad = Math.floor(h * 0.06);
    const yTags = Math.min(cursorY, h - bottomPad - fsTags * 2.2);
    blocks.push({
      id: "hashtags",
      text: tags,
      x: padX,
      y: yTags,
      maxWidth: maxW,
      fontSize: fsTags,
      weight: 700,
      lineHeight: 1.3,
      align: "left",
    });
  }

  return blocks;
}

/** estimativa de altura total (placa) para espaçamento progressivo */
function estimateBlockHeight(
  fontSize: number,
  lh: number,
  text: string,
  maxW: number
) {
  // estimativa leve para espaçamento
  const avgChar = fontSize * 0.52;
  const approxCharsPerLine = Math.max(1, Math.floor(maxW / avgChar));
  const words = (text || "").split(/\s+/).filter(Boolean);
  let lines = 0,
    len = 0;
  words.forEach((w) => {
    const add = (len ? 1 : 0) + w.length;
    if (len + add <= approxCharsPerLine) len += add;
    else {
      lines++;
      len = w.length;
    }
  });
  if (len) lines++;
  const lineH = Math.round(fontSize * lh);
  const padY = 10 * 2; // mesmo que drawTextBlocks (padY*2)
  return padY + lineH * lines;
}
