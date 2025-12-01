// src/components/UserProfileMenu.tsx
import React, { useState } from "react";

type UserProfileMenuProps = {
  name?: string;
  planLabel?: string;
};

export default function UserProfileMenu({
  name = "Convidado",
  planLabel = "Plano Free",
}: UserProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const initial = name.charAt(0).toUpperCase() || "C";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-emerald-500/10 dark:bg-white/10
          border border-emerald-400/40 dark:border-white/20
          text-xs text-slate-900 dark:text-white
          hover:bg-emerald-500/20 dark:hover:bg-white/20
          transition
        "
      >
        <div
          className="
            h-7 w-7 rounded-full bg-emerald-500 text-white 
            flex items-center justify-center text-sm font-semibold
          "
        >
          {initial}
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs font-semibold">{name}</span>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-200">
            {planLabel}
          </span>
        </div>
        <span className="text-xs opacity-70">▾</span>
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-44 rounded-xl 
            bg-white dark:bg-[#050816]
            border border-black/5 dark:border-white/15
            shadow-lg z-50
          "
        >
          <div className="px-3 py-2 border-b border-black/5 dark:border-white/10">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              {name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-300">
              {planLabel}
            </div>
          </div>
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-xs hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-100"
          >
            Minha conta (em breve)
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-xs hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-100"
          >
            Sair (mock)
          </button>
        </div>
      )}
    </div>
  );
}
