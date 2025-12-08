// src/components/RequirePlan.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RequirePlanProps {
  children: React.ReactNode;
}

export default function RequirePlan({ children }: RequirePlanProps): JSX.Element {
  const { currentUser, userPlan } = useAuth();

  // Se não tiver logado, vai pro login (ProtectedRoute cuida disso)
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se tiver logado mas não tiver plano (ou plano = 'free'), vai pra página de planos
  if (!userPlan || userPlan === 'free') {
    return <Navigate to="/pricing" state={{ requirePlan: true }} replace />;
  }

  // Tem plano ativo? Deixa usar o app!
  return <>{children}</>;
}