import React from 'react';

export default function Stepper({step,onStep}:{step:0|1|2; onStep:(s:0|1|2)=>void}){
  // Ordem corrigida: Ideia → Texto → Visual
  const steps = ['Ideia','Texto','Visual'];
  return (
    <div className="row">
      {steps.map((s,i)=>(
        <button
          key={s}
          className="btn"
          onClick={()=>onStep(i as any)}
          style={{background: step===i?'var(--card)':'', borderColor: step===i?'#93c5fd':'var(--border)'}}
        >
          {i+1}. {s}
        </button>
      ))}
    </div>
  );
}
