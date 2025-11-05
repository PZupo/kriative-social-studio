import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./i18n/i18n";

import Header from "./components/Header";
import FeedbackBox from "./components/FeedbackBox"; // ✅ adicionado

import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Library from "./pages/Library";
import Plans from "./pages/Plans";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      {/* Sem classes de bg/text aqui: herdamos do CSS global (var(--bg)/var(--fg)) */}
      <div className="min-h-dvh">
        <Header />
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
