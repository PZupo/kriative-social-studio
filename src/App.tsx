// src/App.tsx - VERSÃO LIMPA SEM SISTEMA ANTIGO
import React from "react";
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
import Pricing from "./pages/Pricing";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RequirePlan from "./components/RequirePlan";

function AppShell() {
  // Tabs do header
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
        // ← REMOVI onOpenPlans - agora vai direto pra /pricing
        onOpenPlans={() => window.location.href = '/pricing'}
      />

      <main className="pt-8 pb-10">
        <Routes>
          {/* ========== ROTAS PÚBLICAS ========== */}
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* ========== ROTAS PROTEGIDAS ========== */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/editor" replace />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/editor" 
            element={
              <ProtectedRoute>
                <RequirePlan>
                  <Editor />
                </RequirePlan>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <RequirePlan>
                  <Dashboard />
                </RequirePlan>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <RequirePlan>
                  <Library />
                </RequirePlan>
              </ProtectedRoute>
            } 
          />

          {/* Rota não encontrada */}
          <Route path="*" element={<Navigate to="/editor" replace />} />
        </Routes>
      </main>

      <footer className="py-8 text-center opacity-70">
        Kriative • Social Studio
      </footer>

      <FeedbackBox />

      {/* ← REMOVI todos os modais antigos (KSPlansModal, KSCheckoutModal) */}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}