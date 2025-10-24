import { Preset, Idea, TextBundle, KssStyle } from './types';

// PRNG
function rng(seed: number) {
  return () => (seed = (seed * 1664525 + 1013904223) % 4294967296, seed / 4294967296);
}

export function renderStyled(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  idea: Idea,
  text: TextBundle,
  style: KssStyle,
  seed: number,
  overlayOnly = false,
  showTopBand = true
) {
  const R = rng(seed);
  const { w, h } = preset;

  if (!overlayOnly) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  }

  // Tarja/cabeçalho opcional
  if (showTopBand) {
    const grad = ctx.createLinearGradient(0, 0, w, h * 0.25);
    const hues: Record<KssStyle, [string, string]> = {
      disney: ['#60a5fa', '#a78bfa'],
      cyberpunk: ['#06b6d4', '#f43f5e'],
      ghibli: ['#34d399', '#93c5fd'],
      aquarela: ['#fcd34d', '#f472b6'],
      noir: ['#111827', '#6b7280'],
    };
    const [c1, c2] = hues[style];
    grad.addColorStop(0, c1); grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, Math.floor(h * 0.22));
  }

  // Overlays por estilo
  const overlays: Record<KssStyle, (ctx: CanvasRenderingContext2D) => void> = {
    disney: (c) => swirl(c, w, h, 6, 0.08, 0.12, R),
    cyberpunk: (c) => scanlines(c, w, h, 4, 0.06),
    ghibli: (c) => clouds(c, w, h, 8, R),
    aquarela: (c) => watercolor(c, w, h, 0.04, R),
    noir: (c) => vignette(c, w, h, 0.6),
  };
  overlays[style](ctx);

  // Título
  ctx.fillStyle = style === 'noir' ? '#f9fafb' : '#111827';
  ctx.font = 'bold ' + Math.max(48, Math.floor(w * 0.05)) + 'px Poppins, Arial';
  ctx.fillText(text.title || 'Seu Título Aqui', 32, Math.floor(h * 0.22) + 96, w - 64);

  // Copy
  ctx.fillStyle = style === 'noir' ? '#e5e7eb' : '#374151';
  ctx.font = Math.max(22, Math.floor(w * 0.022)) + 'px Poppins, Arial';
  wrapText(ctx, text.copy || 'Sua copy chamativa…', 32, Math.floor(h * 0.22) + 140, w - 64, Math.max(28, Math.floor(w * 0.028)));

  // Rodapé
  ctx.fillStyle = style === 'noir' ? '#cbd5e1' : '#6b7280';
  ctx.font = Math.max(18, Math.floor(w * 0.018)) + 'px Poppins, Arial';
  ctx.fillText((idea.topic || 'Tema') + ' • ' + (idea.goal || 'Objetivo'), 32, h - 32);
}

// Helpers
function wrapText(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, maxW: number, lh: number) {
  const words = t.split(' '); let line = ''; let yy = y;
  for (const w of words) {
    const test = line + w + ' ';
    if (ctx.measureText(test).width > maxW) { ctx.fillText(line, x, yy); line = w + ' '; yy += lh; }
    else line = test;
  }
  ctx.fillText(line, x, yy);
}
function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength = 0.5) {
  const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.7);
  grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
}
function scanlines(ctx: CanvasRenderingContext2D, w: number, h: number, gap = 4, alpha = 0.06) {
  ctx.fillStyle = `rgba(0,0,0,${alpha})`; for (let y = 0; y < h; y += gap) ctx.fillRect(0, y, w, 1);
}
function clouds(ctx: CanvasRenderingContext2D, w: number, h: number, blobs: number, R: () => number) {
  for (let i = 0; i < blobs; i++) {
    const x = R() * w, y = R() * h * 0.5 + h * 0.15, r = Math.max(40, R() * 120);
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
}
function watercolor(ctx: CanvasRenderingContext2D, w: number, h: number, alpha = 0.04, R: () => number) {
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = `rgba(${200 + R() * 55}, ${150 + R() * 80}, ${150 + R() * 80}, ${alpha})`;
    const x = R() * w, y = R() * h; const rw = 60 + R() * 180, rh = 30 + R() * 120;
    ctx.beginPath(); ctx.ellipse(x, y, rw, rh, R() * Math.PI, 0, Math.PI * 2); ctx.fill();
  }
}
function swirl(ctx: CanvasRenderingContext2D, w: number, h: number, arms: number, minR = 0.08, maxR = 0.18, R: () => number) {
  ctx.save(); ctx.globalAlpha = 0.12; ctx.strokeStyle = 'white'; ctx.lineWidth = 4;
  const cx = w * 0.85, cy = h * 0.18;
  for (let a = 0; a < arms; a++) {
    ctx.beginPath();
    for (let t = 0; t < Math.PI * 2; t += 0.15) {
      const r = (minR + (maxR - minR) * (t / (Math.PI * 2))) * Math.min(w, h);
      const x = cx + r * Math.cos(t + a * 0.6), y = cy + r * Math.sin(t + a * 0.6);
      if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
