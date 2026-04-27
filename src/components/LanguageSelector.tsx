import React, { useState, useRef, useEffect } from "react";
// ✅ CORREÇÃO: Importamos a lib oficial em vez do arquivo deletado
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "pt-BR", label: "PT", name: "Português", flag: "🇧🇷" },
  { code: "en-US", label: "EN", name: "English", flag: "🇺🇸" },
  { code: "es", label: "ES", name: "Español", flag: "🇪🇸" },
  { code: "fr", label: "FR", name: "Français", flag: "🇫🇷" },
  { code: "de", label: "DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "ko", label: "KO", name: "한국어", flag: "🇰🇷" },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation(); // Hook do sistema correto
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Encontra o idioma atual ou usa PT como padrão
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code); // Comando oficial para trocar idioma
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 transition-all text-xs font-medium text-slate-300 hover:text-white"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span>{currentLang.label}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#0B0F19] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 text-xs font-medium transition-colors hover:bg-white/5 ${
                currentLang.code === lang.code ? "text-purple-400 bg-purple-500/10" : "text-slate-400"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}