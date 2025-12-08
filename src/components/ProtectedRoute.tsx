// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redireciona para login, salvando a página que tentou acessar
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

// Variação: Proteger por tipo de plano
interface PlanProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: string;
}

export function PlanProtectedRoute({ 
  children, 
  requiredPlan = 'free' 
}: PlanProtectedRouteProps) {
  const { currentUser, userPlan } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Hierarquia de planos (do menor pro maior)
  const planHierarchy: Record<string, number> = {
    free: 0,
    individual_pro: 1,
    individual_studio: 2,
    individual_exclusive: 3,
    multi_pro: 4,
    multi_studio: 5,
    multi_exclusive: 6,
    enterprise_pro: 7,
    enterprise_studio: 8,
    enterprise_exclusive: 9,
  };

  const userPlanLevel = planHierarchy[userPlan] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

  if (userPlanLevel < requiredPlanLevel) {
    // Não tem plano suficiente, redireciona para página de planos
    return <Navigate to="/pricing" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}