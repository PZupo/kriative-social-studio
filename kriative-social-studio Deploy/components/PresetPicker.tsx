import React from 'react';
import { Preset } from '../lib/types';
const PRESETS: Preset[] = [
  { name:'Instagram Post', w:1080, h:1080 },
  { name:'Instagram Reel', w:1080, h:1920 },
  { name:'YouTube Thumbnail', w:1280, h:720 },
  { name:'Stories', w:1080, h:1920 },
];
export default function PresetPicker({preset,onChange}:{preset:Preset; onChange:(p:Preset)=>void}){
  return (
    <div className="row">
      {PRESETS.map(p=>(
        <button key={p.name} className="btn" onClick={()=>onChange(p)} style={{background: p.name===preset.name?'#e0f2fe':''}}>
          {p.name} {p.w}×{p.h}
        </button>
      ))}
    </div>
  );
}
