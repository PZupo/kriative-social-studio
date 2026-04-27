import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ 1. Ativa o sistema de tradução oficial (react-i18next)
import './i18n/i18n';

// ✅ 2. Importa apenas a Autenticação (O idioma já está resolvido acima)
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
       {/* Removemos o LanguageProvider para não conflitar com o i18n */}
       <App />
    </AuthProvider>
  </React.StrictMode>
);