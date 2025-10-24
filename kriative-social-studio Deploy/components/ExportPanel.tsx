import React from 'react';
import JSZip from 'jszip';
import { Preset, Idea, TextBundle, KssStyle, BatchPlan } from '../lib/types';

export default function ExportPanel({preset, idea, text, styleKey, plan, seeds}:{preset:Preset; idea:Idea; text:TextBundle; styleKey:KssStyle; plan:BatchPlan; seeds:number[]}){
  const capturePNG = (canvas:HTMLCanvasElement)=> canvas.toDataURL('image/png');
  const captureJPG = (canvas:HTMLCanvasElement)=> canvas.toDataURL('image/jpeg', 0.92);

  const collectCanvases = ()=> Array.from(document.querySelectorAll('canvas')) as HTMLCanvasElement[];

  const downloadZip = async ()=>{
    const canvases = collectCanvases();
    if(!canvases.length) return alert('Nenhuma imagem gerada');
    const zip = new JSZip();
    const meta = { preset, idea, text, styleKey, plan, seeds, createdAt: new Date().toISOString() };
    zip.file('metadata.json', JSON.stringify(meta,null,2));
    canvases.forEach((cv, i)=>{
      const png = capturePNG(cv).split(',')[1];
      const jpg = captureJPG(cv).split(',')[1];
      zip.file(`image_${i+1}.png`, png, {base64:true});
      zip.file(`image_${i+1}.jpg`, jpg, {base64:true});
    });
    const blob = await zip.generateAsync({type:'blob'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='kss-package.zip'; a.click();
  };

  return (
    <div className="card" style={{margin:'12px 0'}}>
      <strong>Exportar Lote</strong>
      <div className="row" style={{marginTop:8}}>
        <button className="btn" onClick={downloadZip}>ZIP (todas as imagens + metadata)</button>
      </div>
      <p style={{opacity:.7, marginTop:6}}>ZIP contém PNG/JPEG de cada canvas (#1..N) + metadata.json (título, copy, legenda, hashtags, preset, estilo, plano, seeds).</p>
    </div>
  );
}
