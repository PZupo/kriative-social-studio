import React from 'react';
import { KssStyle } from '../lib/types';
const STYLES: {key:KssStyle; label:string}[] = [
  { key:'disney', label:'Disney' },
  { key:'cyberpunk', label:'Cyberpunk' },
  { key:'ghibli', label:'Ghibli' },
  { key:'aquarela', label:'Aquarela' },
  { key:'noir', label:'Noir' },
];
export default function StylePicker({value,onChange}:{value:KssStyle; onChange:(s:KssStyle)=>void}){
  return (
    <div className="row">
      {STYLES.map(s=>(
        <button key={s.key} className="btn" onClick={()=>onChange(s.key)} style={{background: s.key===value?'#ffe4e6':''}}>
          🎨 {s.label}
        </button>
      ))}
    </div>
  );
}
