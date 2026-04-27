import React from 'react';
// ✅ CORREÇÃO: Importamos do i18next e não do contexto deletado
import { useTranslation } from 'react-i18next';

interface StepperProps {
  step: number;
  onStep: (step: any) => void;
}

export default function Stepper({ step, onStep }: StepperProps) {
  // ✅ Hook correto
  const { t } = useTranslation();

  const steps = [
    { idx: 0, label: t('step_idea') || 'Ideia' },
    { idx: 1, label: t('step_text') || 'Texto' },
    { idx: 2, label: t('step_visual') || 'Visual' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => {
        const isActive = step === s.idx;
        const isDone = step > s.idx;
        
        return (
          <React.Fragment key={s.idx}>
            <button
              onClick={() => onStep(s.idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-bold uppercase tracking-widest ${
                isActive
                  ? 'bg-slate-800 text-white border-purple-500/50 shadow-lg shadow-purple-900/20'
                  : isDone
                  ? 'bg-slate-900/50 text-slate-400 border-white/5 hover:text-white cursor-pointer'
                  : 'bg-transparent text-slate-600 border-transparent cursor-default'
              }`}
              disabled={!isDone && !isActive}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                isActive ? 'bg-purple-600 text-white' : 'bg-white/10'
              }`}>
                {s.idx + 1}
              </span>
              {s.label}
            </button>
            {i < steps.length - 1 && (
              <div className={`w-8 h-[1px] ${isDone ? 'bg-purple-900/50' : 'bg-white/5'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}