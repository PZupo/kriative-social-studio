import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useQuota(action = 'generate_image') {
  const [quota, setQuota] = useState({ remaining: 0, limit: 0, usage: 0 });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      checkQuota();
    }
  }, [currentUser]);

  async function checkQuota() {
    try {
      const checkQuotaFn = httpsCallable(functions, 'checkQuota');
      const result = await checkQuotaFn({ action });
      setQuota(result.data);
    } catch (error) {
      console.error('Erro ao verificar quota:', error);
    } finally {
      setLoading(false);
    }
  }

  async function incrementUsage() {
    try {
      const incrementFn = httpsCallable(functions, 'incrementUsage');
      await incrementFn({ action });
      await checkQuota(); // Atualizar quota
    } catch (error) {
      console.error('Erro ao incrementar uso:', error);
    }
  }

  return { quota, loading, checkQuota, incrementUsage };
}