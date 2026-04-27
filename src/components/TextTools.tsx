import React from 'react';
import { useTranslation } from 'react-i18next'; // ✅ 1. Importação Necessária
import { Idea, TextBundle } from '../lib/types';
import { mockCaption, mockHashtags, mockTitle, mockCopy } from '../lib/utils';

export default function TextTools({value,onChange,idea}:{value:TextBundle; onChange:(v:TextBundle)=>void; idea:Idea}){
  const { t } = useTranslation(); // ✅ 2. Hook de Tradução

  const set = (k:keyof TextBundle)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>onChange({...value,[k]: (k==='hashtags')? (e.target as any).value.split(/\s+/) : e.target.value});
  const genTitle = ()=> onChange({...value, title: mockTitle(idea)});
  const genCopy = ()=> onChange({...value, copy: mockCopy(idea)});
  const genCaption = ()=> onChange({...value, caption: mockCaption(idea)});
  const genTags = ()=> onChange({...value, hashtags: mockHashtags(idea)});
  
  return (
    <div className="card" style={{margin:'12px 0'}}>
      <label style={{display:'block', margin:'6px 0'}}><div style={{fontSize:12, opacity:.8, marginBottom:4}}>{t('title_label')}</div>
        <input value={value.title} onChange={set('title')} placeholder={t('title_placeholder')} style={{width:'100%', padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}/>
      </label>
      
      <label style={{display:'block', margin:'6px 0'}}><div style={{fontSize:12, opacity:.8, marginBottom:4}}>{t('copy_label')}</div>
        <textarea value={value.copy} onChange={set('copy')} placeholder={t('copy_placeholder')} style={{width:'100%', minHeight:100, padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}/>
      </label>
      
      {/* Botões mantidos no local original */}
      <div className="row" style={{margin:'8px 0'}}>
        <button className="btn" onClick={genTitle}>{t('btn_gen_title')}</button>
        <button className="btn" onClick={genCopy}>{t('btn_gen_copy')}</button>
        <button className="btn" onClick={genCaption}>{t('btn_gen_legend')}</button>
        <button className="btn" onClick={genTags}>{t('btn_gen_hashtags')}</button>
      </div>
      
      <label style={{display:'block', margin:'6px 0'}}><div style={{fontSize:12, opacity:.8, marginBottom:4}}>{t('caption_label')}</div>
        <textarea value={value.caption} onChange={set('caption')} placeholder={t('caption_placeholder')} style={{width:'100%', minHeight:90, padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}/>
      </label>
      
      <label style={{display:'block', margin:'6px 0'}}><div style={{fontSize:12, opacity:.8, marginBottom:4}}>{t('hashtags_label')}</div>
        <input value={value.hashtags.join(' ')} onChange={set('hashtags')} placeholder="#marketing #socialmedia ..." style={{width:'100%', padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}/>
      </label>
    </div>
  );
}