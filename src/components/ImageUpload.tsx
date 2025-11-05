import React, { useRef } from 'react';

export default function ImageUpload({value, onChange}:{value:string|null; onChange:(v:string|null)=>void}){
  const inputRef = useRef<HTMLInputElement|null>(null);
  const clear = () => onChange(null);
  const pick = () => inputRef.current?.click();
  const onFile = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const f = e.target.files?.[0];
    if(!f) return;
    const rdr = new FileReader();
    rdr.onload = () => onChange(String(rdr.result));
    rdr.readAsDataURL(f);
  };
  return (
    <div className="card" style={{marginTop:8}}>
      <strong>Imagem base (opcional)</strong>
      <div className="row" style={{marginTop:8}}>
        <button className="btn" onClick={pick}>📤 Enviar imagem</button>
        <button className="btn" onClick={clear} disabled={!value}>🗑 Remover</button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} hidden />
      {value && <div style={{marginTop:8, fontSize:12, opacity:.7}}>Imagem carregada ✓ (será ajustada ao canvas)</div>}
    </div>
  );
}
