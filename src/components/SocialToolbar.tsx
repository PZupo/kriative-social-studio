import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SocialToolbar() {
  const location = useLocation();
  const { t } = useTranslation();

  const tabs = [
    { id: "editor", label: t('tab_creation') || "Criação", path: "/editor" },
    { id: "library", label: t('tab_gallery') || "Minha Galeria", path: "/library" },
  ];

  return (
    // Barra escura/arredondada
    <div className="w-full bg-[#1e1b4b]/80 border border-white/10 rounded-xl p-1.5 flex items-center justify-between backdrop-blur-sm mb-6">
      
      {/* Botões de Navegação */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? "bg-white text-purple-900 shadow-lg shadow-purple-900/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Lado Direito */}
      <div className="hidden sm:flex items-center gap-3 px-3">
        <span className="text-[10px] text-purple-300/50 uppercase font-bold tracking-widest">
            {t('workflow_label') || "Fluxo de Trabalho"}
        </span>
      </div>
      
    </div>
  );
}