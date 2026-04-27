import React from "react";
import { Coins } from "lucide-react";

interface UserBalanceProps {
  balance?: number;      // Saldo atual (opcional)
  label?: string;        // Texto ao lado (ex: "CRÉDITOS")
  themeColor?: string;   // Cor do tema (ex: "purple-400")
  operationCost?: number; // Novo: custo da operação atual (ex: do Editor)
}

export default function UserBalance({
  balance = 0,
  label = "CRÉDITOS",
  themeColor = "purple-400",
  operationCost = 0,
}: UserBalanceProps) {
  // Custo real (prioriza prop do Editor, fallback 0)
  const displayCost = operationCost > 0 ? operationCost : 0;

  return (
    <div className="flex items-center gap-3">
      {/* Saldo atual */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border border-purple-500/30 rounded-xl shadow-sm">
        <Coins size={18} className={`text-${themeColor}`} />
        <span className="text-sm font-bold text-white">
          {balance} <span className="text-[10px] opacity-70">{label}</span>
        </span>
      </div>

      {/* BADGE DE CUSTO (só mostra se houver custo válido) */}
      {displayCost > 0 && balance > 0 && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg animate-pulse">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-tighter">
            CUSTO: -{displayCost}
          </span>
          <span className="text-[9px] opacity-60">(operação atual)</span>
        </div>
      )}
    </div>
  );
}