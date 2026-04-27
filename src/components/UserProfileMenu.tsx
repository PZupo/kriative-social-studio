import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase"; // Para fazer logout

export default function UserProfileMenu() {
  const { user, userData } = useAuth();
  
  // ✅ CORREÇÃO 1: Declarando o estado que estava faltando
  const [isOpen, setIsOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    auth.signOut();
    window.location.href = "/login";
  };

  const handlePortal = () => {
    window.location.href = "https://afiliattuz.mydigitaldropp.com/profile";
  };

  if (!user) return null;

  // Lógica de exibição do nome e plano
  const displayName = userData?.displayName || user.email?.split("@")[0] || "Usuário";
  const planLabel = userData?.billing?.status === 'active' ? "Plano Ativo" : "Plano Free";
  const credits = userData?.credits ?? 0;

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão do Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/10"
      >
        <div className="text-right hidden md:block">
          <div className="text-sm font-bold text-white">{displayName}</div>
          <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">
            {planLabel} • {credits} Créditos
          </div>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-slate-900 shadow-lg">
          {displayName.substring(0, 2).toUpperCase()}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0B0F19] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
          <div className="p-4 border-b border-white/5 bg-white/5">
            <p className="text-xs text-slate-400 font-medium">Logado como</p>
            <p className="text-sm font-bold text-white truncate">{user.email}</p>
          </div>

          <div className="p-2">
            <button
              onClick={handlePortal}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center gap-2"
            >
              <span>💳</span> Minha Assinatura
            </button>
            <button
              onClick={() => window.open("https://afiliattuz.mydigitaldropp.com", "_blank")}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center gap-2"
            >
              <span>🏠</span> Voltar ao HUB
            </button>
          </div>

          <div className="p-2 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition flex items-center gap-2"
            >
              <span>🚪</span> Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}