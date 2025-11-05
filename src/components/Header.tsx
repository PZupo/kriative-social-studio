import { NavLink, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LanguageSelect from "./LanguageSelect";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getUserTierFor } from "@/lib/entitlements";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm transition
         text-gray-700 dark:text-gray-200
         ${isActive ? "bg-black/5 dark:bg-white/10 font-semibold" : "hover:bg-black/5 dark:hover:bg-white/10"}`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Header() {
  const { t } = useTranslation();

  // Badge de plano (PRO/STUDIO/EXCLUSIVE)
  const [tier, setTier] = useState<"PRO" | "STUDIO" | "EXCLUSIVE" | null>(null);
  const [loadingTier, setLoadingTier] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingTier(true);
      try {
        const t = await getUserTierFor("social");
        if (mounted) setTier(t);
      } finally {
        if (mounted) setLoadingTier(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur text-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="h-7 w-7 rounded-xl"
            style={{ background: "linear-gradient(90deg,#0f766e,#f97316)" }}
          />
          <div className="text-sm leading-tight">
            <div className="font-extrabold tracking-tight">{t("app.brand")}</div>
            <div className="text-xs opacity-60 -mt-0.5">{t("app.subtitle")}</div>
          </div>
        </Link>

        {/* Navegação */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/" label={t("app.nav.editor")} />
          <NavItem to="/dashboard" label={t("app.nav.dashboard")} />
          <NavItem to="/library" label={t("app.nav.library")} />
          <NavItem to="/plans" label={t("app.nav.plans")} />
          <NavItem to="/login" label={t("app.nav.login")} />
        </nav>

        {/* Ações + Badge de Plano */}
        <div className="flex items-center gap-2">
          <span className="chip mr-1">Plano: {loadingTier ? "…" : (tier ?? "—")}</span>
          <LanguageSelect />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
