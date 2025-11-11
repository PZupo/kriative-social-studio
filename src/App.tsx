import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./i18n/i18n";

import KSHeader, { type KSTab } from "./components/KSHeader";
import FeedbackBox from "./components/FeedbackBox";

import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Library from "./pages/Library";
import Plans from "./pages/Plans";
import Login from "./pages/Login";

export default function App() {
  const tabs: KSTab[] = [
    { to: "/editor", label: "Criação" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/library", label: "Biblioteca" },
    { to: "/plans", label: "Planos" },
  ];

  return (
    <BrowserRouter>
      {/* Sem classes de bg/text aqui: herdamos do CSS global (var(--bg)/var(--fg)) */}
      <div className="min-h-dvh">
        <KSHeader
          appName="Kriative Social Studio"
          subtitle="Criação de Posts e Carrosséis com IA"
          tabs={tabs}
        />

        {/* Altura do header ~= 64px ⇒ pt-16 */}
        <main className="pt-8 pb-10">
          <Routes>
            <Route path="/" element={<Editor />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="py-8 text-center opacity-70">
          Kriative • Social Studio
        </footer>

        {/* ✅ Feedback elegante global */}
        <FeedbackBox />
      </div>
    </BrowserRouter>
  );
}
