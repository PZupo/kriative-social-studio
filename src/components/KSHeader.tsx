// src/components/KSHeader.tsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import UserProfileMenu from "./UserProfileMenu";
import { useCredits } from "../lib/credits";

export type KSTab = { to: string; label: string };

type Props = {
  appName: string;
  subtitle?: string;
  tabs?: KSTab[];
  showLanguage?: boolean;
  showThemeToggle?: boolean;
  onOpenPlans?: () => void; // abre modal de planos
};

export default function KSHeader({
  appName,
  subtitle,
  tabs,
  showLanguage = true,
  showThemeToggle = true,
  onOpenPlans,
}: Props) {
  const [open, setOpen] = useState(false);
  const { credits } = useCredits();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-500 via-emerald-400 to-orange-500">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div
          className="
            flex items-center justify-between
            rounded-2xl px-3 md:px-4 py-2 md:py-3
            bg-slate-950/90
            backdrop-blur
            border border-white/15
            shadow-sm
          "
        >
          {/* Brand */}
          <Link
            to="/editor"
            className="flex items-center gap-3 group"
            aria-label="Home"
          >
            <KSLogo />
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                {appName}
              </div>
              {subtitle ? (
                <div className="text-[11px] sm:text-xs text-slate-200/80">
                  {subtitle}
                </div>
              ) : null}
            </div>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs?.map((t) => (
              <HeaderTab key={t.to} to={t.to} label={t.label} />
            ))}
          </nav>

          {/* Ações (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Créditos compactos */}
            <div className="hidden sm:flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-100">
              <span className="mr-1 opacity-80">Créditos</span>
              <span className="font-semibold">{credits}</span>
            </div>

            {/* Botão Planos */}
            {onOpenPlans && (
              <button
                type="button"
                onClick={onOpenPlans}
                className="text-xs font-semibold rounded-full px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-400 transition"
              >
                Planos
              </button>
            )}

            {showLanguage && <LanguageSelector />}
            {showThemeToggle && <ThemeToggle />}
            <UserProfileMenu />
          </div>

          {/* Trigger mobile */}
          <button
            className="md:hidden px-3 py-2 rounded-xl border border-white/15 text-slate-50"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <div className="w-5 h-[2px] bg-current mb-1" />
            <div className="w-5 h-[2px] bg-current mb-1" />
            <div className="w-5 h-[2px] bg-current" />
          </button>
        </div>

        {/* Drawer mobile */}
        {open && (
          <div className="md:hidden mt-2 rounded-2xl bg-slate-950/95 backdrop-blur border border-white/15 shadow-sm">
            <div className="px-3 py-3 flex flex-col gap-2">
              {tabs?.map((t) => (
                <HeaderTabMobile
                  key={t.to}
                  to={t.to}
                  label={t.label}
                  onClick={() => setOpen(false)}
                />
              ))}

              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {showLanguage && <LanguageSelector />}
                  {showThemeToggle && <ThemeToggle />}
                </div>
                <UserProfileMenu />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-slate-200/80">
                  Créditos:{" "}
                  <span className="font-semibold text-emerald-300">
                    {credits}
                  </span>
                </span>
                {onOpenPlans && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onOpenPlans();
                    }}
                    className="text-[11px] font-semibold rounded-full px-3 py-1 bg-emerald-500 text-white"
                  >
                    Ver planos
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function HeaderTab({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative px-3 py-2 rounded-xl text-sm transition",
          isActive
            ? "text-white bg-gradient-to-r from-teal-500 to-orange-500 shadow-sm"
            : "text-slate-100 hover:bg-white/5",
        ].join(" ")
      }
    >
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}

function HeaderTabMobile({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "w-full text-left px-3 py-2 rounded-xl text-sm transition",
          isActive
            ? "text-white bg-gradient-to-r from-teal-500 to-orange-500"
            : "text-slate-100 hover:bg-white/5",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

function KSLogo() {
  return (
    <svg
      className="w-9 h-9 rounded-xl shadow-sm"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ks-teal-orange" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="32"
        height="32"
        rx="8"
        fill="url(#ks-teal-orange)"
      />
      <path
        d="M9 7h3v8l6-8h4l-6 8 7 10h-4l-7-10v10H9V7z"
        fill="white"
        fillOpacity="0.95"
      />
    </svg>
  );
}
