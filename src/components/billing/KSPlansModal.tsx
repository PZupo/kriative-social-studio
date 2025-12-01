// src/components/billing/KSPlansModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";

export type KSPlanId =
  // INDIVIDUAL — PRO
  | "ind_pro_m"
  | "ind_pro_q"
  | "ind_pro_a"
  // INDIVIDUAL — STUDIO
  | "ind_studio_m"
  | "ind_studio_q"
  | "ind_studio_a"
  // INDIVIDUAL — EXCLUSIVE
  | "ind_exclusive_m"
  | "ind_exclusive_q"
  | "ind_exclusive_a";

type BillingCycle = "m" | "q" | "a";

const BILLING_CYCLES: { id: BillingCycle; label: string; description: string }[] = [
  { id: "m", label: "Mensal", description: "Ciclo de 1 mês, ideal para começar." },
  { id: "q", label: "Trimestral", description: "3 meses com leve economia." },
  { id: "a", label: "Anual", description: "12 meses com melhor custo efetivo." },
];

type TierKey = "pro" | "studio" | "exclusive";

const TIER_LABEL: Record<TierKey, string> = {
  pro: "Individual PRO",
  studio: "Individual STUDIO",
  exclusive: "Individual EXCLUSIVE",
};

const TIER_BADGE: Record<TierKey, string> = {
  pro: "Para começar",
  studio: "Mais usado",
  exclusive: "Alta performance",
};

const PLAN_PRICE: Record<KSPlanId, string> = {
  // PRO
  ind_pro_m: "R$ 47/mês",
  ind_pro_q: "R$ 129/tri",
  ind_pro_a: "R$ 468/ano",
  // STUDIO
  ind_studio_m: "R$ 97/mês",
  ind_studio_q: "R$ 267/tri",
  ind_studio_a: "R$ 948/ano",
  // EXCLUSIVE
  ind_exclusive_m: "R$ 197/mês",
  ind_exclusive_q: "R$ 537/tri",
  ind_exclusive_a: "R$ 1.896/ano",
};

const PLAN_CREDITS_INFO: Record<TierKey, string> = {
  pro: "Inclui aproximadamente 120 créditos de imagem por mês.",
  studio: "Inclui aproximadamente 360 créditos de imagem por mês.",
  exclusive: "Inclui aproximadamente 1200 créditos de imagem por mês.",
};

type KSPlansModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectPlan: (planId: KSPlanId) => void;
};

function getPlanId(tier: TierKey, cycle: BillingCycle): KSPlanId {
  const prefix =
    tier === "pro" ? "ind_pro_" : tier === "studio" ? "ind_studio_" : "ind_exclusive_";
  const suffix = cycle; // "m" | "q" | "a"
  return `${prefix}${suffix}` as KSPlanId;
}

export default function KSPlansModal({
  open,
  onClose,
  onSelectPlan,
}: KSPlansModalProps) {
  const [cycle, setCycle] = useState<BillingCycle>("m");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl border border-teal-400/40 bg-[#020617] text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-teal-300">
              PLANOS KS • SOCIAL STUDIO
            </div>
            <h2 className="mt-1 text-xl font-semibold">
              Escolha o plano ideal para você
            </h2>
            <p className="text-sm text-white/70">
              Fluxo mock — na versão final chamará o checkout real do Stripe.
            </p>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            <X className="h-4 w-4" />
            Fechar
          </button>
        </div>

        {/* Ciclos */}
        <div className="border-b border-white/10 px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-white/70">
              Selecione o <span className="font-medium text-teal-300">ciclo</span> de cobrança:
            </div>
            <div className="inline-flex rounded-full bg-white/5 p-1 text-sm">
              {BILLING_CYCLES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCycle(c.id)}
                  className={`rounded-full px-4 py-1.5 transition ${
                    c.id === cycle
                      ? "bg-emerald-400 text-black shadow-sm"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-1 text-xs text-white/60">
            {BILLING_CYCLES.find((c) => c.id === cycle)?.description}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 px-6 py-5 md:grid-cols-3">
          {(["pro", "studio", "exclusive"] as TierKey[]).map((tier) => {
            const planId = getPlanId(tier, cycle);
            const price = PLAN_PRICE[planId];

            return (
              <div
                key={tier}
                className={`flex h-full flex-col rounded-3xl border bg-white/5 p-5 text-sm shadow-sm ${
                  tier === "studio"
                    ? "border-emerald-400/70 bg-emerald-500/5"
                    : "border-white/10"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold tracking-tight text-white">
                    {TIER_LABEL[tier]}
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      tier === "studio"
                        ? "bg-emerald-400 text-black"
                        : "bg-white/10 text-white/80"
                    }`}
                  >
                    {TIER_BADGE[tier]}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-extrabold text-emerald-400">
                    {price}
                  </div>
                  <div className="text-xs text-white/70">
                    Valores promocionais para o ciclo selecionado.
                  </div>
                  <div className="mt-1 text-xs font-medium text-emerald-300">
                    {PLAN_CREDITS_INFO[tier]}
                  </div>
                </div>

                <ul className="mb-5 space-y-1.5 text-xs text-white/80">
                  {tier === "pro" && (
                    <>
                      <li>• Criações ilimitadas em modo rascunho</li>
                      <li>• Exportação básica (imagem ou PDF, conforme o app)</li>
                      <li>• Suporte via e-mail em horário comercial</li>
                      <li>• Ideal para profissionais autônomos no início</li>
                    </>
                  )}
                  {tier === "studio" && (
                    <>
                      <li>• Todas as funções do Plano PRO</li>
                      <li>• Créditos extras para IA (imagens / mangá / looks / páginas)</li>
                      <li>• Exportações avançadas e templates premium</li>
                      <li>• Prioridade no suporte e melhorias</li>
                    </>
                  )}
                  {tier === "exclusive" && (
                    <>
                      <li>• Todos os recursos do Studio</li>
                      <li>• Limites muito mais altos de uso de IA</li>
                      <li>• Recursos avançados (branding, presets e pastas)</li>
                      <li>• Canal de suporte prioritário (quando disponível)</li>
                    </>
                  )}
                </ul>

                <button
                  onClick={() => onSelectPlan(planId)}
                  className="mt-auto w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-emerald-300"
                >
                  Selecionar plano
                </button>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 px-6 py-3 text-[11px] text-white/60">
          * Fluxo ainda mock. Na versão final, o botão de confirmar chamará o checkout
          oficial do Stripe / KS-Core e registrará a assinatura no backend do
          ecossistema Afiliattuz.
        </div>
      </div>
    </div>
  );
}
