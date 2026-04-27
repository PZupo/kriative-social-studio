import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const location = useLocation();

  // 1. Enquanto o Firebase Auth ou o Firestore estiverem buscando dados, travamos a tela com o loading luxuoso.
  if (loading || (user && !userData)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020305]">
        <div className="w-10 h-10 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sincronizando Permissões...</p>
      </div>
    );
  }

  // 2. Se não houver usuário logado no Firebase, manda para o Login do próprio App
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. LÓGICA DE ACESSO MULTICAMADA (Planos, Admin ou Créditos Avulsos)
  
  // Verificação por Nível de Conta
  const isAdmin = userData?.tier === 'Admin';
  const hasActivePlan = userData?.tier && userData?.tier !== 'Free';
  
  // Verificação por Aplicativo Específico no Array
  const hasAppExplicitlyActive = userData?.activeApps?.includes('social-studio');

  // NOVA CHAVE-MESTRA: Se o saldo de créditos for maior que zero, o acesso é Integral.
  const hasCredits = (userData?.credits || 0) > 0;

  // O acesso é concedido se QUALQUER uma das condições acima for verdadeira (Lógica OR)
  const hasAccess = isAdmin || hasActivePlan || hasAppExplicitlyActive || hasCredits;

  

  if (!hasAccess) {
    console.warn("Acesso negado para o usuário:", user.uid);
    
    // Em vez de uma tela branca, redirecionamos para o HUB com o gatilho de compra
    const HUB_URL = "https://afiliattuz.mydigitaldropp.com";
    window.location.href = `${HUB_URL}/#/dashboard?action=buy_credits`;
    
    return null; // Retorna null para interromper a renderização do App
  }

  // Se passou em alguma validação, renderiza o Aplicativo normalmente
  return <>{children}</>;
}