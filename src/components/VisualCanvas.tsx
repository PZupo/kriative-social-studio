// src/components/VisualCanvas.tsx
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
  showTopBand = true,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const width = preset.w;
    const height = preset.h;

    cvs.width = width;
    cvs.height = height;

    // limpa
    ctx.clearRect(0, 0, width, height);

    // fundo gradiente simples baseado no estilo + seed
    const grad = ctx.createLinearGradient(0, 0, width, height);
    const n = seed % 3;

    if (n === 0) {
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(1, "#020617");
    } else if (n === 1) {
      grad.addColorStop(0, "#10b981");
      grad.addColorStop(1, "#0f766e");
    } else {
      grad.addColorStop(0, "#f97316");
      grad.addColorStop(1, "#ea580c");
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // desenha imagem base, se existir (centralizada, cover)
    if (baseImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        if (showTopBand) {
          drawTopBand(ctx, width, height);
        }
      };
      img.src = baseImage;
    } else {
      if (showTopBand) {
        drawTopBand(ctx, width, height);
      }
    }

    // ⚠️ IMPORTANTE:
    // não desenhamos NENHUM texto aqui.
    // idea / text são ignorados de propósito para manter a arte limpa.
  }, [preset, styleKey, seed, baseImage, showTopBand]);

  return (
    <canvas
      id={id}
      ref={ref}
      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#020617]"
    />
  );
}

function drawTopBand(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const bandHeight = Math.round(height * 0.12);
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 0, width, bandHeight);
}
