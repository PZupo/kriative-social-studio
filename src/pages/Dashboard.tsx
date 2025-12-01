// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ThemeToggle from "../components/ThemeToggle";
import UserProfileMenu from "../components/UserProfileMenu";

import KSPlansModal from "../components/billing/KSPlansModal";
import KSCheckoutModal from "../components/billing/KSCheckoutModal";
import type { KSPlanId } from "../lib/billing/plans";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // === KS BILLING CORE — estado dos modais ===
const [plansOpen, setPlansOpen] = useState(false);
const [checkoutOpen, setCheckoutOpen] = useState(false);
const [selectedPlan, setSelectedPlan] = useState<KSPlanId | null>(null);

const handleOpenPlans = () => {
  setPlansOpen(true);
  setCheckoutOpen(false);
  setSelectedPlan(null);
};

const handleSelectPlan = (planId: KSPlanId) => {
  setSelectedPlan(planId);
  setPlansOpen(false);
  setCheckoutOpen(true);
};

const handleCloseCheckout = () => {
  setCheckoutOpen(false);
};

const handleConfirmCheckout = (planId: KSPlanId) => {
  // FUTURO: aqui entra Stripe / link real
  console.log("[Social Studio] Confirmar plano:", planId);
  alert(`Mock de checkout para o plano: ${planId}`);
};


  // === NAVEGAÇÃO SIMPLES ENTRE TELAS DO APP ===
  const goToEditor = () => navigate("/editor");
  const goToLibrary = () => navigate("/library");

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50 flex flex-col">
        
        {/* CONTEÚDO */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
          {/* BLOCO HERO */}
          <section className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Organize, crie e publique seus conteúdos em um só lugar.
              </h1>
              <p className="text-sm md:text-base text-slate-300">
                Use o Kriative Social Studio para centralizar ideias, organizar
                roteiros, gerar artes e manter um fluxo constante de postagens
                com a sua identidade visual.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={goToEditor}
                  className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold bg-teal-400 text-slate-950 hover:opacity-90 transition"
                >
                  Abrir editor
                </button>
                <button
                  type="button"
                  onClick={goToLibrary}
                  className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-xs font-semibold border border-white/20 bg-white/5 hover:bg-white/10 transition"
                >
                  Ver biblioteca
                </button>
                <button
  type="button"
  onClick={handleOpenPlans}
  className="px-4 py-1.5 rounded-full border border-white/40 text-xs font-semibold hover:bg-white/10 transition"
>
  Planos
</button>


              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5 space-y-3">
              <h2 className="text-sm font-semibold">
                Seu status no ecossistema Kriative
              </h2>
              <p className="text-[13px] text-slate-300">
                Aqui você poderá acompanhar limites de criação, status de plano
                e atalhos para upgrade. Por enquanto, as informações de uso e
                créditos ainda estão em modo mock.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-black/30 border border-white/10 px-3 py-2">
                  <div className="text-[11px] text-slate-400">Criações</div>
                  <div className="text-sm font-semibold">Ilimitadas*</div>
                  <div className="text-[10px] text-slate-500">
                    Limites reais serão aplicados com Stripe + Supabase.
                  </div>
                </div>
                <div className="rounded-2xl bg-black/30 border border-white/10 px-3 py-2">
                  <div className="text-[11px] text-slate-400">Plano atual</div>
                  <div className="text-sm font-semibold">Mock / Dev</div>
                  <div className="text-[10px] text-slate-500">
                    Clique em &quot;Upgrade de plano&quot; para testar o fluxo.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CARDS DE ATALHO */}
          <section className="grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={goToEditor}
              className="group rounded-3xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10 hover:-translate-y-1 transition transform"
            >
              <div className="text-xs font-semibold text-teal-300">
                Criação
              </div>
              <div className="mt-1 text-sm font-semibold">
                Abrir estúdio de edição
              </div>
              <p className="mt-1 text-[13px] text-slate-300">
                Monte artes, textos e posts com a identidade visual da sua
                marca.
              </p>
              <div className="mt-3 text-[11px] text-slate-400">
                Atalho direto para a página de edição.
              </div>
            </button>

            <button
              type="button"
              onClick={goToLibrary}
              className="group rounded-3xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10 hover:-translate-y-1 transition transform"
            >
              <div className="text-xs font-semibold text-sky-300">
                Organização
              </div>
              <div className="mt-1 text-sm font-semibold">
                Biblioteca de criações
              </div>
              <p className="mt-1 text-[13px] text-slate-300">
                Veja, duplique e reutilize posts salvos em seu Social Studio.
              </p>
              <div className="mt-3 text-[11px] text-slate-400">
                Ideal para manter consistência de campanhas.
              </div>
            </button>

            <button
              type="button"
onClick={handleOpenPlans}
              className="group rounded-3xl border border-amber-500/40 bg-amber-500/10 p-4 text-left hover:bg-amber-500/20 hover:-translate-y-1 transition transform"
            >
              <div className="text-xs font-semibold text-amber-300">
                Planos & Billing
              </div>
              <div className="mt-1 text-sm font-semibold">
                Ver detalhes de planos
              </div>
              <p className="mt-1 text-[13px] text-amber-100/90">
                Veja condições, benefícios e prepare-se para a ativação real do
                Stripe.
              </p>
              <div className="mt-3 text-[11px] text-amber-100/80">
                Por enquanto, essa área pode ser usada como vitrine de planos.
              </div>
            </button>
          </section>
        </main>
      </div>

      {/* === MODAIS KS BILLING CORE === */}
      <KSPlansModal
        open={plansOpen}
        onClose={() => setPlansOpen(false)}
        onSelectPlan={handleSelectPlan}
      />

      <KSCheckoutModal
        open={checkoutOpen}
        planId={selectedPlan}
        onClose={handleCloseCheckout}
        onConfirm={handleConfirmCheckout}
      />
    </>
  );
};

export default Dashboard;
