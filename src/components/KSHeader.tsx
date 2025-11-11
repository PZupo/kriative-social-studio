// src/components/KSHeader.tsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export type KSTab = { to: string; label: string };

type Props = {
  appName: string;
  subtitle?: string;
  tabs: KSTab[];
};

export default function KSHeader({ appName, subtitle, tabs }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-500 via-emerald-400 to-orange-500">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div
          className="
            flex items-center justify-between
            rounded-2xl px-3 md:px-4 py-2 md:py-3
            bg-white/80 dark:bg-[#0b0f19]/80
            backdrop-blur
            border border-white/30 dark:border-white/10
            shadow-sm
          "
        >
          {/* Brand */}
          {/* Brand */}
<Link to="/" className="flex items-center gap-3 group" aria-label="Home">
  <KSLogo />
  <div className="leading-tight">
    <div className="font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
      {appName}
    </div>
    {subtitle ? (
      <div className="text-xs text-gray-700 dark:text-gray-200 opacity-90">
        {subtitle}
      </div>
    ) : null}
  </div>
</Link>


          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {tabs.map((t) => (
              <HeaderTab key={t.to} to={t.to} label={t.label} />
            ))}
          </nav>

          {/* Mobile trigger */}
          <button
            className="md:hidden btn-ghost px-3 py-2 rounded-xl ring-1 ring-black/5 dark:ring-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <div className="w-5 h-[2px] bg-current mb-1" />
            <div className="w-5 h-[2px] bg-current mb-1" />
            <div className="w-5 h-[2px] bg-current" />
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden mt-2 rounded-2xl bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur border border-white/30 dark:border-white/10 shadow-sm">
            <div className="px-3 py-3 flex flex-col gap-2">
              {tabs.map((t) => (
                <HeaderTabMobile
                  key={t.to}
                  to={t.to}
                  label={t.label}
                  onClick={() => setOpen(false)}
                />
              ))}
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
          "relative px-3 py-2 rounded-xl transition",
          isActive
            ? "text-white bg-gradient-to-r from-teal-500 to-orange-500 shadow-sm"
            : "text-gray-800 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10",
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
          "w-full text-left px-3 py-2 rounded-xl transition",
          isActive
            ? "text-white bg-gradient-to-r from-teal-500 to-orange-500"
            : "hover:bg-black/5 dark:hover:bg-white/10",
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
      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#ks-teal-orange)" />
      <path
        d="M9 7h3v8l6-8h4l-6 8 7 10h-4l-7-10v10H9V7z"
        fill="white"
        fillOpacity="0.95"
      />
    </svg>
  );
}
