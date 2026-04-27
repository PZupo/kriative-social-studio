import React, { useEffect, useRef } from "react";
import type { Preset, Idea, TextBundle, KssStyle } from "../lib/types";

type Props = {
  id: string;
  preset: Preset;
  styleKey: KssStyle;
  idea: Idea;
  text: TextBundle;
  seed: number;
  baseImage?: string | null;
  generatedImage?: string | null;   // Imagem pura gerada pela IA
  showTopBand?: boolean;
};

export default function VisualCanvas({
  id,
  preset,
  styleKey,
  idea,
  text,
  seed,
  baseImage,
  generatedImage,
  showTopBand = true,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const width = preset.w ?? 1080;
    const height = preset.h ?? 1080;
    cvs.width = width;
    cvs.height = height;
    ctx.clearRect(0, 0, width, height);

    // SE TIVER IMAGEM GERADA PELA IA → desenha PURA (sem texto nenhum)
    if (generatedImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let drawX = 0;
        let drawY = 0;
        let drawW = width;
        let drawH = height;

        // Cover mode: preenche sem distorcer, corta o excesso
        if (imgRatio > canvasRatio) {
          // Imagem mais larga → corta laterais
          drawW = height * imgRatio;
          drawX = (width - drawW) / 2;
        } else {
          // Imagem mais alta → corta topo/base
          drawH = width / imgRatio;
          drawY = (height - drawH) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        if (showTopBand) drawTopBand(ctx, width, height);
      };
      img.src = generatedImage;
    } else {
      // FALLBACK (sem IA ainda) → gradiente + baseImage + textos (como antes)
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(1, "#020617");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      if (baseImage) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          if (showTopBand) drawTopBand(ctx, width, height);
        };
        img.src = baseImage;
      } else {
        if (showTopBand) drawTopBand(ctx, width, height);
      }
    }
  }, [preset, styleKey, seed, baseImage, generatedImage, showTopBand]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-2xl">
      <canvas id={id} ref={ref} className="block w-full h-auto object-contain" />
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 select-none">
          KSS Social Studio — {styleKey}
        </span>
      </div>
    </div>
  );
}

function drawTopBand(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bandHeight = Math.round(h * 0.12);
  const gradient = ctx.createLinearGradient(0, 0, 0, bandHeight);
  gradient.addColorStop(0, "rgba(0,0,0,0.75)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, bandHeight);
}