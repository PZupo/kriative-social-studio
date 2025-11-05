import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "./translations";

const KEY = "ks_lang";
const saved = (typeof window !== "undefined" && localStorage.getItem(KEY)) || "pt-BR";
const supported = ["pt-BR", "en-US"] as const;
const initial = (supported as readonly string[]).includes(saved) ? saved : "pt-BR";

i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": { translation: translations["pt-BR"] },
    "en-US": { translation: translations["en-US"] },
  },
  lng: initial,
  fallbackLng: "pt-BR",
  interpolation: { escapeValue: false },
});

export default i18n;
