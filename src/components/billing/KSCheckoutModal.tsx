// src/components/billing/KSCheckoutModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import type { KSPlanId } from "./KSPlansModal";

type KSCheckoutModalProps = {
  open: boolean;
  planId: KSPlanId | null;
  onClose: () => void;
  onConfirm: (planId: KSPlanId) => void;
};

type PlanMeta = {
  title: string;
  billingLabel: string;
  priceLabel: string;
};

const PLAN_META: Record<KSPlanId, PlanMeta> = {
  // PRO
  ind_pro_m: {
    title: "Individual PRO",
    billingLabel: "Ciclo mensal · valores promocionais.",
    priceLabel: "R$ 47/mês",
  },
  ind_pro_q: {
    title: "Individual PRO",
    billingLabel: "Ciclo trimestral · valores promocionais.",
    priceLabel: "R$ 129/trimestre",
  },
  ind_pro_a: {
    title: "Individual PRO",
    billingLabel: "Ciclo anual · valores promocionais.",
    priceLabel: "R$ 468/ano",
  },
  // STUDIO
  ind_studio_m: {
    title: "Individual STUDIO",
    billingLabel: "Ciclo mensal · valores promocionais.",
    priceLabel: "R$ 97/mês",
  },
  ind_studio_q: {
    title: "Individual STUDIO",
    billingLabel: "Ciclo trimestral · valores promocionais.",
    priceLabel: "R$ 267/trimestre",
  },
  ind_studio_a: {
    title: "Individual STUDIO",
    billingLabel: "Ciclo anual · valores promocionais.",
    priceLabel: "R$ 948/ano",
  },
  // EXCLUSIVE
  ind_exclusive_m: {
    title: "Individual EXCLUSIVE",
    billingLabel: "Ciclo mensal · valores promocionais.",
    priceLabel: "R$ 197/mês",
  },
  ind_exclusive_q: {
    title: "Individual EXCLUSIVE",
    billingLabel: "Ciclo trimestral · valores promocionais.",
    priceLabel: "R$ 537/trimestre",
  },
  ind_exclusive_a: {
    title: "Individual EXCLUSIVE",
    billingLabel: "Ciclo anual · valores promocionais.",
    priceLabel: "R$ 1.896/ano",
  },
};

export default function KSCheckoutModal({
  open,
  planId,
  onClose,
  onConfirm,
}: KSCheckoutModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [clubAdded, setClubAdded] = useState(false);

  if (!open || !planId) return null;

  const meta = PLAN_META[planId];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-emerald-400/40 bg-[#020617] text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
              Confirmar assinatura — {meta.title}
            </div>
            <h2 className="mt-1 text-xl font-semibold">
              Revise seus dados antes de concluir
            </h2>
            <p className="text-sm text-white/70">
              Este fluxo ainda é de teste (mock). Na versão final, o botão de confirmação
              chamará o checkout oficial do Stripe / KS-Core.
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

        {/* Content */}
        <div className="grid gap-6 px-6 py-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Dados do assinante */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Dados do assinante
            </h3>
            <p className="text-xs text-white/70">
              Preencha para registrar esta assinatura no ecossistema Afiliattuz / Kriative
              (mock visual).
            </p>

            <div className="space-y-3 text-sm">
              <label className="block space-y-1">
                <span className="text-xs text-white/80">Nome completo</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  placeholder="Seu nome ou responsável pelo plano"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </label>

              <label className="block space-y-1">
                <span className="text-xs text-white/80">E-mail</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs text-white/80">Profissão / Empresa</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    placeholder="Ex: Social Media, Estúdio X..."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-xs text-white/80">Cel / Whats</span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-xs text-white/80">
                  Observações (opcional)
                </span>
                <textarea
                  className="min-h-[96px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  placeholder="Ex: como pretende usar o ecossistema, dúvidas específicas, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Resumo do plano + Upsell Club */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-400/60 bg-emerald-500/5 px-4 py-3 text-sm">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Resumo do plano
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                {meta.title}
              </div>
              <div className="text-xs text-white/70">{meta.billingLabel}</div>

              <div className="mt-3 text-2xl font-extrabold text-emerald-400">
                {meta.priceLabel}
              </div>

              <ul className="mt-3 space-y-1.5 text-xs text-white/80">
                <li>• Acesso aos recursos do Kriative Social Studio conforme o plano.</li>
                <li>• Uso dedicado para criação de posts e carrosséis com IA.</li>
                <li>• Você poderá ajustar ou cancelar a assinatura em versões futuras.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/5 px-4 py-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    AfiliattuzClub — Membro do ecossistema
                  </div>
                  <p className="mt-2 text-xs text-white/80">
                    Some ao seu plano o poder do AfiliattuzClub com comissão recorrente e
                    estrutura de revenda (mock).
                  </p>
                  <p className="mt-2 text-xs text-emerald-300">
                    Total com Club (mock): {meta.priceLabel.replace("R$", "R$ +50,00 / ")}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-semibold text-black">
                  Upsell opcional
                </span>
              </div>

              <button
                type="button"
                onClick={() => setClubAdded((v) => !v)}
                className={`mt-3 w-full rounded-full px-4 py-2 text-sm font-semibold ${
                  clubAdded
                    ? "bg-emerald-400 text-black"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {clubAdded
                  ? "AfiliattuzClub marcado (mock)"
                  : "Adicionar AfiliattuzClub ao plano (mock)"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-3 text-[11px] text-white/60 md:flex-row md:items-center md:justify-between">
          <div>
            * Fluxo de teste (mock). Na versão final, este modal chamará o checkout oficial
            do Stripe e registrará a assinatura no backend oficial do ecossistema.
          </div>

          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onConfirm(planId)}
              className="rounded-full bg-emerald-400 px-5 py-2 text-xs font-semibold text-black hover:bg-emerald-300"
            >
              Confirmar assinatura (mock)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
