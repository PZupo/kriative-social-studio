import React, { useEffect, useState } from 'react';

type PlannerData = {
  scheduledAt: string | null; // ISO local (ex.: "2025-01-15T10:30")
  notes: string;
};

function toICS(dtLocal: string, title: string, desc: string) {
  // Converte "YYYY-MM-DDTHH:mm" local para UTC básico YYYYMMDDTHHMMSSZ
  const dt = new Date(dtLocal);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth()+1).padStart(2,'0');
  const d = String(dt.getUTCDate()).padStart(2,'0');
  const hh = String(dt.getUTCHours()).padStart(2,'0');
  const mm = String(dt.getUTCMinutes()).padStart(2,'0');
  const start = `${y}${m}${d}T${hh}${mm}00Z`;
  // define duração de 30min
  const endDate = new Date(dt.getTime()+30*60*1000);
  const y2 = endDate.getUTCFullYear();
  const m2 = String(endDate.getUTCMonth()+1).padStart(2,'0');
  const d2 = String(endDate.getUTCDate()).padStart(2,'0');
  const hh2 = String(endDate.getUTCHours()).padStart(2,'0');
  const mm2 = String(endDate.getUTCMinutes()).padStart(2,'0');
  const end = `${y2}${m2}${d2}T${hh2}${mm2}00Z`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kriative Social Studio//Planner//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:kss-${Date.now()}@kriative`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export default function Planner({suggestedTitle, suggestedDesc}:{suggestedTitle:string; suggestedDesc:string}){
  const [data,setData] = useState<PlannerData>({
    scheduledAt: localStorage.getItem('kss_schedule') || '',
    notes: localStorage.getItem('kss_notes') || ''
  });

  useEffect(()=>{
    // sincroniza “agendamento global” usado no ExportPanel
    if (data.scheduledAt) localStorage.setItem('kss_schedule', data.scheduledAt);
    else localStorage.removeItem('kss_schedule');
    localStorage.setItem('kss_notes', data.notes || '');
  },[data]);

  const setAt = (v:string)=> setData(d=>({...d, scheduledAt:v}));
  const setNotes = (v:string)=> setData(d=>({...d, notes:v}));

  const quick = (mins:number)=>{
    const now = new Date();
    now.setMinutes(now.getMinutes()+mins);
    const val = now.toISOString().slice(0,16); // YYYY-MM-DDTHH:mm
    setAt(val);
  };

  const download = (filename:string, content:string, type:string)=>{
    const blob = new Blob([content], {type});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const exportICS = ()=>{
    if(!data.scheduledAt) return alert('Defina uma data/hora para exportar o .ics');
    const ics = toICS(data.scheduledAt, suggestedTitle || 'Publicar post', (data.notes || suggestedDesc));
    download('kss-event.ics', ics, 'text/calendar');
  };

  const exportJSON = ()=>{
    const json = JSON.stringify({ ...data, title: suggestedTitle, description: suggestedDesc }, null, 2);
    download('kss-planner.json', json, 'application/json');
  };

  return (
    <div className="card" style={{marginTop:12}}>
      <strong>Planner & Agendamento</strong>
      <div className="row" style={{marginTop:8, alignItems:'center'}}>
        <input
          type="datetime-local"
          value={data.scheduledAt || ''}
          onChange={e=>setAt(e.target.value)}
          className="btn"
          style={{padding:'8px 10px'}}
        />
        <button className="btn" onClick={()=>quick(60)}>+1h</button>
        <button className="btn" onClick={()=>quick(60*24)}>+24h</button>
        <button className="btn" onClick={()=>quick(60*24*7)}>+7d</button>
      </div>
      <label style={{display:'block', marginTop:8}}>
        <div style={{fontSize:12, opacity:.75, marginBottom:4}}>Notas</div>
        <textarea
          value={data.notes}
          onChange={e=>setNotes(e.target.value)}
          placeholder="Ex.: Checklist de publicação, links, menções…"
          style={{width:'100%', minHeight:80, padding:'10px', border:'1px solid var(--border)', borderRadius:10, background:'transparent', color:'inherit'}}
        />
      </label>
      <div className="row" style={{marginTop:8}}>
        <button className="btn" onClick={exportICS}>📆 Exportar .ICS</button>
        <button className="btn" onClick={exportJSON}>🗂 Exportar Planner JSON</button>
      </div>
      <p style={{opacity:.7, marginTop:6, fontSize:12}}>
        O horário é salvo localmente e usado no pacote de exportação (metadata.json).
        Depois integraremos Google Calendar/Drive para sincronizar online.
      </p>
    </div>
  );
}
