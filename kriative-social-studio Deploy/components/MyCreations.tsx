// components/MyCreations.tsx
import React, { useEffect, useState } from 'react';
import { Creation, listCreations, removeCreation } from '../lib/storage';

export default function MyCreations(){
  const [items, setItems] = useState<Creation[]>([]);

  const reload = ()=> setItems(listCreations());

  useEffect(()=>{
    reload();
    const onChanged = ()=> reload();
    window.addEventListener('kss:creations:changed', onChanged as any);
    return ()=> window.removeEventListener('kss:creations:changed', onChanged as any);
  },[]);

  const doRemove = (id:string)=>{
    if(!confirm('Excluir esta criação?')) return;
    removeCreation(id);
  };

  if (items.length === 0) {
    return (
      <div className="card" style={{marginTop:12}}>
        <strong>Minhas Criações</strong>
        <p style={{opacity:.7, marginTop:6}}>Nada salvo ainda. Gere uma imagem e clique em <em>Salvar</em> no cartão.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{marginTop:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <strong>Minhas Criações</strong>
        <button className="btn" onClick={reload}>↻ Atualizar</button>
      </div>
      <div className="grid" style={{marginTop:12}}>
        {items.map(it=>(
          <div key={it.id} className="card">
            <div style={{fontSize:12, opacity:.7, marginBottom:8}}>
              {new Date(it.createdAt).toLocaleString()}
            </div>
            <img src={it.dataURL} alt="preview" style={{width:'100%', borderRadius:12, display:'block'}}/>
            <div className="row" style={{marginTop:8}}>
              <a className="btn" href={it.dataURL} download={`${it.id}.png`}>⬇ Baixar</a>
              <button className="btn" onClick={()=>doRemove(it.id)}>🗑 Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
