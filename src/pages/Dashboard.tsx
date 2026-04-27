import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userData, user, loading } = useAuth();
  
  // O HUB controla o Tier. O Satélite apenas exibe.
  const planName = userData?.tier || "Plano Free";
  const credits = userData?.credits ?? 0;

  const handleGoToHub = (path: string) => { 
    window.location.href = `https://afiliattuz.mydigitaldropp.com/${path}`; 
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#020305] text-slate-50 flex flex-col font-sans">
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header de Boas-vindas */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Olá, {userData?.displayName || "Criador"}
            </h1>
            <p className="text-slate-400 mt-1">Sua central de geração de conteúdo IA.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate("/editor")} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20">
              Novo Projeto
            </button>
            <button onClick={() => navigate("/library")} className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-xl font-bold text-sm transition-all">
              Minha Galeria
            </button>
          </div>
        </section>

        {/* Cards de Status (Dados vindos do HUB) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0B0F19] border border-white/5 p-6 rounded-3xl">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Créditos Disponíveis</p>
            <p className="text-4xl font-black mt-2 text-white">{credits}</p>
          </div>

          <div className="bg-[#0B0F19] border border-white/5 p-6 rounded-3xl">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Assinatura Atual</p>
            <p className="text-2xl font-black mt-2 text-purple-400">{planName}</p>
          </div>

          <div className="bg-[#0B0F19] border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Gestão de Conta</p>
            <button onClick={() => handleGoToHub("billing")} className="text-xs font-bold text-white underline decoration-purple-500 underline-offset-4 hover:text-purple-400 transition-all mt-4 text-left">
              Faturamento e Planos no HUB →
            </button>
          </div>
        </section>

        {/* Atalhos Rápidos */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div onClick={() => navigate("/editor")} className="cursor-pointer bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 p-8 rounded-3xl hover:border-purple-500/40 transition-all group">
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400">Editor Studio</h3>
            <p className="text-sm text-slate-400">Crie posts, legendas e criativos com inteligência artificial.</p>
          </div>
          <div onClick={() => handleGoToHub("profile")} className="cursor-pointer bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all">
            <h3 className="text-xl font-bold mb-2">Configurações</h3>
            <p className="text-sm text-slate-400">Gerencie seu perfil e preferências de conta diretamente no HUB.</p>
          </div>
        </section>

      </main>
      <footer className="py-10 text-center text-[10px] text-slate-600 uppercase tracking-[0.2em]">
        ID de Acesso: {user?.uid}
      </footer>
    </div>
  );
};

export default Dashboard;