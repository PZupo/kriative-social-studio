// src/App.tsx
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./i18n/i18n";

import KSHeader, { type KSTab } from "./components/KSHeader";
import FeedbackBox from "./components/FeedbackBox";

import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Library from "./pages/Library";
import Login from "./pages/Login";

import KSPlansModal from "./components/billing/KSPlansModal";
import KSCheckoutModal from "./components/billing/KSCheckoutModal";
import type { KSPlanId } from "./lib/billing/plans";
import { useCredits } from "./lib/credits";

function AppShell() {
  const { setCredits } = useCredits();

  const [plansOpen, setPlansOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<KSPlanId | null>(null);

  // Créditos por plano (mesma regra dos outros apps)
  function getCreditsForPlan(planId: KSPlanId): number {
    if (planId.startsWith("ind_pro_")) return 120;        // PRO
    if (planId.startsWith("ind_studio_")) return 360;     // STUDIO
    if (planId.startsWith("ind_exclusive_")) return 1200; // EXCLUSIVE
    return 0;
  }

  function handleConfirmCheckout(planId: KSPlanId) {
    const newCredits = getCreditsForPlan(planId);

    if (newCredits > 0) {
      setCredits(newCredits);
      alert(
        `Mock de checkout para o plano: ${planId}\nCréditos ajustados para ${newCredits}.`
      );
    } else {
      alert(`Mock de checkout para o plano: ${planId}`);
    }

    setCheckoutOpen(false);
  }

  // 👉 Tabs enxutas (Biblioteca só via CTA da tela, não no header)
  const tabs: KSTab[] = [
    { to: "/editor", label: "Criação" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <div className="min-h-dvh">
      <KSHeader
        appName="Kriative Social Studio"
        subtitle="Criação de Posts e Carrosséis com IA"
        tabs={tabs}
        onOpenPlans={() => setPlansOpen(true)}
      />

      {/* NENHUM outro header aqui ─ só conteúdo */}
      <main className="pt-8 pb-10">
        <Routes>
          <Route path="/" element={<Navigate to="/editor" replace />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/editor" replace />} />
        </Routes>
      </main>

      <footer className="py-8 text-center opacity-70">
        Kriative • Social Studio
      </footer>

      <FeedbackBox />

      {/* Modais de planos / checkout */}
      <KSPlansModal
        open={plansOpen}
        onClose={() => setPlansOpen(false)}
        onSelectPlan={(planId) => {
          setSelectedPlan(planId);
          setPlansOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <KSCheckoutModal
        open={checkoutOpen}
        planId={selectedPlan}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={handleConfirmCheckout}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
