// src/components/SubscriptionForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/subscription-form.css';

interface SubscriptionFormProps {
  planName: string;
  planPrice: number;
  planCycle: 'monthly' | 'quarterly' | 'annual';
  planImages: number;
  priceId: string;
  includeClub: boolean;
  clubPrice: number;
  onBack: () => void;
}

export default function SubscriptionForm({
  planName,
  planPrice,
  planCycle,
  planImages,
  priceId,
  includeClub,
  clubPrice,
  onBack
}: SubscriptionFormProps): JSX.Element {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    profession: '',
    phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Forçar refresh do token
      if (currentUser) {
        await currentUser.getIdToken(true);
      }

      const { functions } = await import('../lib/firebase');
      const { httpsCallable } = await import('firebase/functions');
      
      const createCheckout = httpsCallable(functions, 'createCheckoutSession');
      
      console.log('Enviando para createCheckoutSession:', {
        priceId,
        userData: formData,
      });
      
      const result = await createCheckout({
        priceId,
        successUrl: window.location.origin + '/success',
        cancelUrl: window.location.origin + '/pricing',
        metadata: {
          ...formData,
          includeClub: includeClub.toString(),
        },
      });
      
      const { sessionId } = result.data as { sessionId: string };
      
      if (sessionId) {
        window.location.href = `https://checkout.stripe.com/c/pay/${sessionId}`;
      } else {
        throw new Error('Session ID não retornado');
      }
      
    } catch (error: any) {
      console.error('Erro completo:', error);
      
      if (error.code === 'functions/unauthenticated') {
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        window.location.href = '/login';
      } else {
        alert(`Erro: ${error.message || 'Tente novamente'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCycleText = () => {
    switch (planCycle) {
      case 'monthly': return 'mês';
      case 'quarterly': return 'trimestre';
      case 'annual': return 'ano';
    }
  };

  const totalPrice = includeClub ? planPrice + clubPrice : planPrice;

  return (
    <div className="subscription-form-page">
      <button className="btn-back" onClick={onBack}>
        ← Voltar para planos
      </button>

      <div className="form-container">
        <div className="form-left">
          <h1>Confirmar assinatura — {planName}</h1>
          <p className="form-subtitle">Ciclo {getCycleText()} — R$ {planPrice} / {getCycleText()}</p>

          <form onSubmit={handleSubmit}>
            <h2>DADOS DO ASSINANTE</h2>
            <p className="form-description">
              Preencha seus dados para registrar este plano no Ecossistema Afiliattuz.
            </p>

            <div className="form-group">
              <label>Nome completo</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Profissão / Empresa</label>
                <input
                  type="text"
                  name="profession"
                  placeholder="Ex: Social Media, Estúdio X..."
                  value={formData.profession}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Cel / Whats</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Observações (opcional)</label>
              <textarea
                name="notes"
                placeholder="Ex: como pretende usar o ecossistema, dúvidas específicas, etc."
                value={formData.notes}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <p className="form-note">
              * Fluxo de teste (mock). Na versão final, este modal chamará o checkout do Stripe 
              e registrará a assinatura no backend oficial do Ecossistema Afiliattuz.
            </p>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={onBack}>
                Cancelar
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Processando...' : 'Confirmar assinatura (mock)'}
              </button>
            </div>
          </form>
        </div>

        <div className="form-right">
          <div className="summary-card">
            <span className="summary-badge">Mais usado</span>
            <h3>RESUMO DO PLANO</h3>
            <h2>{planName}</h2>
            <div className="summary-price">
              <strong>R$ {planPrice},00 / {getCycleText()}</strong>
              <span>• {getCycleText() === 'mês' ? 'Mensal' : getCycleText() === 'trimestre' ? 'Trimestral' : 'Anual'}</span>
            </div>

            <p className="summary-description">
              Para profissionais que produzem conteúdo com mais frequência e querem mais recursos.
            </p>

            <ul className="summary-features">
              <li>• Acesso aos apps do ecossistema conforme o plano.</li>
              <li>• AfiliattuzClub opcional (upsell abaixo).</li>
            </ul>
          </div>

          {includeClub && (
            <div className="club-summary-card">
              <span className="club-badge">Upsell opcional</span>
              <h3>AfiliattuzClub — membro do Ecossistema</h3>
              <p>
                Some ao seu {planName} o poder do AfiliattuzClub com comissão recorrente 
                e estrutura de revenda.
              </p>
              <div className="club-summary-price">
                <div>
                  <span>Total com Club (mock):</span>
                  <strong>R$ {clubPrice},00 / {getCycleText()}</strong>
                </div>
                <div>
                  <span>Club efetivo:</span>
                  <strong>R$ {clubPrice / (planCycle === 'quarterly' ? 3 : planCycle === 'annual' ? 12 : 1)},00 / mês</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}