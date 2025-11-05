import React, { useState } from 'react';
export default function Scheduler(){
  const [dt,setDt] = useState<string>(localStorage.getItem('kss_schedule') || '');
  const save = ()=>{ localStorage.setItem('kss_schedule', dt); alert('Agendamento salvo (mock).'); };
  return (
    <div className="card" style={{margin:'12px 0'}}>
      <strong>Agendar Publicação (mock)</strong>
      <div style={{marginTop:8, display:'flex', gap:8, alignItems:'center'}}>
        <input type="datetime-local" value={dt} onChange={e=>setDt(e.target.value)} className="btn" style={{padding:'8px 10px'}}/>
        <button className="btn" onClick={save}>Salvar agendamento</button>
      </div>
      <p style={{opacity:.7, marginTop:6}}>Isto é local (sem servidor). Depois integraremos Calendário/Drive e APIs reais.</p>
    </div>
  );
}