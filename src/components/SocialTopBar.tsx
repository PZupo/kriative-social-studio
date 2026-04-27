import React from 'react';
import UniversalHeader from './UniversalHeader';

// Interface para aceitar ações opcionais vindas do Editor ou Dashboard
interface SocialTopBarProps {
  onNewPost?: () => void;
  onGoToLibrary?: () => void;
  onOpenTemplates?: () => void;
}

export default function SocialTopBar({ onNewPost, onGoToLibrary, onOpenTemplates }: SocialTopBarProps) {
  return (
    <div className="space-y-6">
      <UniversalHeader 
        appName="Kriative Social Studio"
        appDescription="Criação, agendamento e gestão de redes sociais com IA."
        logoSrc="/assets/social-studio-header.png" 
        themeColor="purple"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={onNewPost}
          className="bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 transition-all active:scale-95"
        >
          <span>✨</span> Criar Novo Post
        </button>
        
        <button className="bg-[#0B0F19] border border-white/10 hover:border-purple-500/50 text-slate-300 hover:text-white p-4 rounded-xl font-bold transition-all">
          📅 Ver Calendário
        </button>

        <button 
          onClick={onOpenTemplates}
          className="bg-[#0B0F19] border border-white/10 hover:border-purple-500/50 text-slate-300 hover:text-white p-4 rounded-xl font-bold transition-all"
        >
          🤖 Ideias & Templates
        </button>

        <button 
          onClick={onGoToLibrary}
          className="bg-[#0B0F19] border border-white/10 hover:border-purple-500/50 text-slate-300 hover:text-white p-4 rounded-xl font-bold transition-all"
        >
          🎨 Minha Galeria
        </button>
      </div>
    </div>
  );
}