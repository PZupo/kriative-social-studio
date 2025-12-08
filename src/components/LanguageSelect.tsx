import { useTranslation } from "react-i18next";

const KEY = "ks_lang";
const languages = [
  { code: "pt-BR", label: "PT-BR" },
  { code: "en-US", label: "EN-US" },
] as const;

export default function LanguageSelect() {
  const { i18n } = useTranslation();

  const onChange = (lang: "pt-BR" | "en-US") => {
    i18n.changeLanguage(lang);
    try { localStorage.setItem(KEY, lang); } catch {}
  };

  return (
    <select
      className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
      value={i18n.language}
      onChange={(e) => onChange(e.target.value as "pt-BR" | "en-US")}
      aria-label="Selecionar idioma"
      title="Idioma"
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
