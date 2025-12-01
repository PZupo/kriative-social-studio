// src/components/billing/IndividualPricingTable.tsx
import React from "react";
import {
  INDIVIDUAL_PRICES,
  formatBRL,
  type IndividualPlanPrice,
} from "@/lib/afiliattuzPricing";

function cicloLabel(cycle: IndividualPlanPrice["cycle"]) {
  if (cycle === "mensal") return "Mensal";
  if (cycle === "trimestral") return "Trimestral";
  return "Anual";
}

function tierLabel(tier: IndividualPlanPrice["tier"]) {
  if (tier === "pro") return "Individual PRO";
  if (tier === "studio") return "Individual STUDIO";
  return "Individual EXCLUSIVE";
}

export default function IndividualPricingTable() {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm">
      <table className="min-w-full text-left border-collapse">
        <thead className="text-xs uppercase text-white/60 border-b border-white/15">
          <tr>
            <th className="py-2 pr-4">Plano</th>
            <th className="py-2 pr-4">Ciclo</th>
            <th className="py-2 pr-4">Preço sem Club</th>
            <th className="py-2 pr-4">Preço com Club</th>
          </tr>
        </thead>
        <tbody className="text-[13px] text-white/80">
          {INDIVIDUAL_PRICES.map((p) => (
            <tr key={`${p.tier}-${p.cycle}`} className="border-b border-white/5">
              <td className="py-2 pr-4">{tierLabel(p.tier)}</td>
              <td className="py-2 pr-4">{cicloLabel(p.cycle)}</td>
              <td className="py-2 pr-4">{formatBRL(p.base)}</td>
              <td className="py-2 pr-4 font-semibold">
                {formatBRL(p.totalWithClub)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-white/60">
        * Valores já considerados com Club aplicado pelo número de meses do
        ciclo (1, 3 ou 12).
      </p>
    </div>
  );
}
