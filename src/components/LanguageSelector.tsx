// src/components/LanguageSelector.tsx
import React, { useEffect, useState } from "react";
import i18n from "../i18n/i18n";

const LANG_OPTIONS = [
  { value: "pt-BR", label: "Português (BR)" },
  { value: "en-US", label: "English (US)" },
];

export default function LanguageSelector() {
  const [lang, setLang] = useState<string>(i18n.language || "pt-BR");

  // Mantém em sincronia caso o i18n mude por outro lugar
  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLang(value);
    i18n.changeLanguage(value);
    localStorage.setItem("ks-social-lang", value);
  };

  return (
    <select
      value={lang}
      onChange={handleChange}
      className="px-2.5 py-1.5 rounded-lg border border-white/20 bg-slate-900/90 text-xs text-slate-50"
      aria-label="Selecionar idioma"
      title="Selecionar idioma"
    >
      {LANG_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
