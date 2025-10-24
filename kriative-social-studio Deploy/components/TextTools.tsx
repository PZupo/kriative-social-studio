import React from 'react';
import { Idea, TextBundle } from '../lib/types';
import { mockCaption, mockHashtags, mockTitle, mockCopy } from '../lib/utils';
export default function TextTools({value,onChange,idea}:{value:TextBundle; onChange:(v:TextBundle)=>void; idea:Idea}){
  const set = (k:keyof TextBundle)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>onChange({...value,[k]: (k==='hashtags')? (e.target as any).value.split(/\s+/) : e.target.value});
  const genTitle = ()=> onChange({...value, title: mockTitle(idea)});
  const genCopy = ()=> onChange({...value, copy: mockCopy(idea)});
  const genCaption = ()=> onChange({...value, caption: mockCaption(idea)});
  const genTags = ()=> onChange({...value, hashtags: mockHashtags(idea)});
  return (
    <div className="card" style={{margin:'12px 0'}}>
      <label style={{display:'block', margin:'6px 0'}}><div style={{fontSize:12, opacity:.8, marginBottom:4}}>Título</div>
        <input value={value.title} onChange={set('title')} placeholder="Título cativante..." style={{width:'100%', padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}/>
      </label>
      <label style={{display:'block', margin:'6px 0'}}><div style={{fontSize:12, opacity:.8, marginBottom:4}}>Copy</div>
        <textarea value={value.copy} onChange={set('copy')} placeholder="Texto do post..." style={{width:'100%', minHeight:100, padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}/>
      </label>
      <div className="row" style={{margin:'8px 0'}}>
        <button className="btn" onClick={genTitle}>Gerar Título (mock)</button>
        <button className="btn" onClick={genCopy}>Gerar Copy (mock)</button>
        <button className="btn" onClick={genCaption}>Gerar Legenda (mock)</button>
        <button className="btn" onClick={genTags}>Gerar Hashtags (mock)</button>
      </div>
      <label style={{display:'block', margin:'6px 0'}}><div style={{fontSize:12, opacity:.8, marginBottom:4}}>Legenda</div>
        <textarea value={value.caption} onChange={set('caption')} placeholder="Legenda do post..." style={{width:'100%', minHeight:90, padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}/>
      </label>
      <label style={{display:'block', margin:'6px 0'}}><div style={{fontSize:12, opacity:.8, marginBottom:4}}>Hashtags (separadas por espaço)</div>
        <input value={value.hashtags.join(' ')} onChange={set('hashtags')} placeholder="#marketing #socialmedia ..." style={{width:'100%', padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}/>
      </label>
    </div>
  );
}