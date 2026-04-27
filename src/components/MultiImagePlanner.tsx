import React from "react";
import type { BatchPlan } from "../lib/types";

type Props = {
  value: BatchPlan;
  onChange: (plan: BatchPlan) => void;
};

const modes: { id: BatchPlan["mode"]; label: string }[] = [
  { id: "single" as BatchPlan["mode"], label: "Single" },
  { id: "carousel" as BatchPlan["mode"], label: "Carousel" },
];

export default function MultiImagePlanner({ value, onChange }: Props) {
  const handleModeChange = (mode: BatchPlan["mode"]) => {
    // Se mudar para Single, força a quantidade para 1 para evitar erros de lógica
    const count = mode === "single" ? 1 : value.count;
    onChange({ ...value, mode, count });
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10);
    // Validação para garantir que no modo Carousel o mínimo seja 2, ou 1 no Single
    const minVal = value.mode === "carousel" ? 2 : 1;
    
    if (Number.isNaN(n) || n < minVal) {
      onChange({ ...value, count: minVal });
    } else {
      onChange({ ...value, count: n });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-slate-950/30 p-4 rounded-xl border border-white/5">
      <h4 className="text-[10px] uppercase tracking-widest font-black opacity-40 mb-1">
        Seletores de Geração
      </h4>
      
      {/* Seleção de Modo (Single vs Carousel) */}
      <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-white/5">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`flex-1 py-2 px-3 rounded-md text-xs font-bold transition-all duration-200 ${
              value.mode === m.id
                ? "bg-teal-500 text-black shadow-lg shadow-teal-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => handleModeChange(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Controle de Quantidade */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">Quantidade</span>
          <span className="text-[10px] opacity-50 uppercase">Imagens por geração</span>
        </div>
        
        <div className="relative">
          <input
            type="number"
            min={value.mode === "carousel" ? 2 : 1}
            max={10}
            className="input bg-slate-900 border-white/10 text-center font-mono font-bold text-teal-400 w-20 py-2 rounded-lg focus:border-teal-500 transition-colors"
            value={value.count}
            onChange={handleCountChange}
            disabled={value.mode === "single"}
          />
          {value.mode === "single" && (
            <div className="absolute inset-0 bg-slate-900/80 rounded-lg flex items-center justify-center border border-white/5 cursor-not-allowed">
              <span className="text-[10px] font-bold opacity-30">FIXO 1</span>
            </div>
          )}
        </div>
      </div>

     {/* Alerta Visual de Custo */}
<div className="pt-2 border-t border-white/5">
  <p className="text-[10px] text-slate-500 italic leading-tight text-center">
    Esta ação consumirá <span className="text-teal-400 font-bold">{value.count * 2}</span> créditos do seu saldo atual.
    <br />
    <span className="text-[9px] opacity-60">(2 créditos por imagem: 1 geração + 1 regeneração gratuita)</span>
  </p>
</div>
    </div>
  );
}