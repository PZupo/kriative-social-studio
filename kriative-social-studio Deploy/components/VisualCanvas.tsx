import React, { useEffect, useRef } from 'react';
import { Preset, Idea, TextBundle, KssStyle } from '../lib/types';
import { renderStyled } from '../lib/render';

export default function VisualCanvas({
  id,
  preset, idea, text, styleKey, seed, baseImage, showTopBand = true
}:{
  id?: string;
  preset: Preset;
  idea: Idea;
  text: TextBundle;
  styleKey: KssStyle;
  seed: number;
  baseImage?: string | null;
  showTopBand?: boolean;
}){
  const ref = useRef<HTMLCanvasElement|null>(null);

  useEffect(()=>{
    const c = ref.current!; const ctx = c.getContext('2d')!;
    // fundo
    ctx.clearRect(0,0,preset.w,preset.h);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,preset.w,preset.h);

    const draw = () => {
      if (baseImage) {
        const img = new Image();
        img.onload = () => {
          const {width:W, height:H} = img;
          const rCanvas = preset.w / preset.h;
          const rImg = W / H;
          let sw=0, sh=0, sx=0, sy=0;
          if (rImg > rCanvas) { sh = H; sw = H * rCanvas; sx = (W - sw) / 2; sy = 0; }
          else { sw = W; sh = W / rCanvas; sx = 0; sy = (H - sh) / 2; }
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, preset.w, preset.h);
          renderStyled(ctx, preset, idea, text, styleKey, seed, /*overlayOnly*/ true, showTopBand);
        };
        img.src = baseImage;
      } else {
        renderStyled(ctx, preset, idea, text, styleKey, seed, /*overlayOnly*/ false, showTopBand);
      }
    };
    draw();
  },[preset, idea, text, styleKey, seed, baseImage, showTopBand]);

  const scale = Math.min(520/preset.w, 520/preset.h);
  return <canvas id={id} ref={ref} width={preset.w} height={preset.h} style={{width:preset.w*scale, height:preset.h*scale, display:'block'}}/>;
}
