// src/components/SocialTopBar.tsx
import React from "react";
import SocialHeaderImage from "../assets/social-studio-header.png";

type SocialTopBarProps = {
  onNewPost?: () => void;
  onGoToLibrary?: () => void;
  onOpenTemplates?: () => void;
};

export default function SocialTopBar({
  onNewPost,
  onGoToLibrary,
  onOpenTemplates,
}: SocialTopBarProps) {
  return (
    <section className="w-full border-t border-black/5 dark:border-white/5 bg-gradient-to-b from-black/5 via-transparent to-transparent">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-3 pb-2">
        <div className="flex flex-col xl:flex-row items-stretch gap-4 xl:gap-6 w-full">
          {/* COLUNA 1 — LOGO / IDENTIDADE DO APP (PADRÃO KS MANGÁ) */}
          <div
            className="w-full xl:w-[260px] 2xl:w-[280px] shrink-0 rounded-2xl 
                       border border-black/10 dark:border-white/10 
                       bg-white/70 dark:bg-black/40 
                       backdrop-blur-sm px-4 py-3 flex flex-col gap-3"
          >
            <div
              className="relative w-full h-[140px] rounded-2xl overflow-hidden
                         bg-black/40 border border-black/10 dark:border-white/20"
            >
              <img
                src={SocialHeaderImage}
                alt="Kriative Social Studio"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                Kriative Social Studio
              </h2>
              <p className="text-xs text-slate-600 dark:text-white/70">
                Painel rápido para criar posts, testar formatos e acessar suas
                criações.
              </p>
            </div>
          </div>

          {/* COLUNA 2 — AÇÕES PRINCIPAIS (CRIAÇÃO / BIBLIOTECA) */}
          <div
            className="flex-1 min-w-0 rounded-2xl border border-black/10 dark:border-white/10 
                       bg-white/70 dark:bg-black/40 backdrop-blur-sm px-4 py-3
                       flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base md:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  Fluxo de criação
                </h2>
                <p className="text-xs text-slate-600 dark:text-white/70">
                  Comece um novo post ou retome algo que você já criou.
                </p>
              </div>
            </div>

            <div className="mt-1 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNewPost?.()}
                className="inline-flex items-center justify-center gap-2 rounded-xl 
                           bg-emerald-500 hover:bg-emerald-400 
                           text-sm font-semibold px-4 py-2
                           text-black shadow-sm shadow-emerald-500/40
                           focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
              >
                <span>+ Novo post</span>
              </button>

              <button
                type="button"
                onClick={() => onGoToLibrary?.()}
                className="inline-flex items-center justify-center rounded-xl 
                           border border-black/10 dark:border-white/20 
                           bg-black/5 dark:bg-white/5 
                           hover:bg-black/10 dark:hover:bg-white/10
                           text-xs md:text-sm font-medium px-3 py-2 text-slate-800 dark:text-white"
              >
                Minhas criações
              </button>

              <button
                type="button"
                onClick={() => onOpenTemplates?.()}
                className="inline-flex items-center justify-center rounded-xl 
                           border border-indigo-400/60 bg-indigo-500/10 
                           hover:bg-indigo-500/20
                           text-xs md:text-sm font-medium px-3 py-2
                           text-indigo-800 dark:text-indigo-100"
              >
                Modelos rápidos
              </button>
            </div>
          </div>

          {/* COLUNA 3 — FORMATOS / ESTILOS (chips compactos) */}
          <div
            className="w-full xl:w-[260px] 2xl:w-[280px] rounded-2xl border 
                       border-black/10 dark:border-white/10 
                       bg-white/70 dark:bg-black/40 backdrop-blur-sm 
                       px-4 py-3 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base md:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  Formatos & estilos
                </h2>
                <p className="mt-1 text-xs text-slate-600 dark:text-white/70">
                  Selecione os formatos que você mais usa.
                </p>
              </div>
            </div>

            <div className="mt-1 flex flex-wrap gap-2">
              {[
                "Reels / Shorts 9:16",
                "Feed 1:1",
                "Story 9:16",
                "YouTube 16:9",
                "Carrossel 1:1",
                "Carrossel 4:5",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="px-3 py-1 rounded-full text-[0.7rem] md:text-xs border
                             border-black/10 dark:border-white/15 
                             bg-black/5 dark:bg-white/5
                             text-slate-900 dark:text-white
                             hover:bg-black/10 dark:hover:bg-white/10 transition"
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Serve como referência visual enquanto você planeja os conteúdos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
