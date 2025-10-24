import React from 'react';
import { Idea } from '../lib/types';
export default function IdeaForm({value,onChange}:{value:Idea; onChange:(v:Idea)=>void}){
  const set=(k:keyof Idea)=>(e:React.ChangeEvent<HTMLInputElement>)=>onChange({...value,[k]:e.target.value});
  const input=(label:string, k:keyof Idea, ph:string)=>(
    <label style={{display:'block', margin:'6px 0'}}>
      <div style={{fontSize:12, opacity:0.8, marginBottom:4}}>{label}</div>
      <input value={value[k]} onChange={set(k)} placeholder={ph} style={{width:'100%', padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}/>
    </label>
  );
  return (
    <div className="card">
      {input('Tópico','topic','Ex.: Lançamento de produto')}
      {input('Audiência','audience','Ex.: Donos de pequenos negócios')}
      {input('Objetivo','goal','Ex.: Gerar tráfego para página')}
    </div>
  );
}