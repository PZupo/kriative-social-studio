// src/pages/Pricing.tsx - VERSÃO FINAL LIMPA
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SubscriptionForm from '../components/SubscriptionForm';
import '../styles/pricing.css';

interface PlanDetails {
  price: number;
  images: number;
  priceId: string;
}

const PLANS = {
  individual: {
    pro: {
      name: 'Individual PRO',
      monthly: { price: 49, images: 120, priceId: 'price_1SaL3ADuFqOOqpaFOWtSnAME' },
      quarterly: { price: 129, images: 120, priceId: 'price_1SaL6tDuFqOOqpaFQXCvLJxN' },
      annual: { price: 468, images: 120, priceId: 'price_1SaL9TDuFqOOqpaFboI0Xr43' },
    },
    studio: {
      name: 'Individual STUDIO',
      monthly: { price: 99, images: 360, priceId: 'price_1SaNYfDuFqOOqpaF6pMlu8Yz' },
      quarterly: { price: 267, images: 360, priceId: 'price_1SaNb8DuFqOOqpaFv8jylMs7' },
      annual: { price: 948, images: 360, priceId: 'price_1SaNdKDuFqOOqpaFgJdecQqi' },
    },
    exclusive: {
      name: 'Individual EXCLUSIVE',
      monthly: { price: 198, images: 1200, priceId: 'price_1SaNvFDuFqOOqpaFoBH3pBS7' },
      quarterly: { price: 537, images: 1200, priceId: 'price_1SaNxADuFqOOqpaFgU33XbOA' },
      annual: { price: 1896, images: 1200, priceId: 'price_1SaNyqDuFqOOqpaFi65cNpPz' },
    },
  },
};

const CLUB_PRICES = {
  pro: { monthly: 80, quarterly: 240, annual: 960 },
  studio: { monthly: 50, quarterly: 150, annual: 600 },
  exclusive: { monthly: 30, quarterly: 90, annual: 360 },
};

type TierKey = 'pro' | 'studio' | 'exclusive';
type CycleKey = 'monthly' | 'quarterly' | 'annual';

export default function Pricing(): JSX.Element {
  const [selectedTier, setSelectedTier] = useState<TierKey>('studio');
  const [selectedCycle, setSelectedCycle] = useState<CycleKey>('monthly');
  const [includeClub, setIncludeClub] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const requirePlan = (location.state as any)?.requirePlan;
  const currentPlan = PLANS.individual[selectedTier][selectedCycle];
  const clubPrice = CLUB_PRICES[selectedTier][selectedCycle];
  const totalPrice = includeClub ? currentPlan.price + clubPrice : currentPlan.price;

  const handleSelectPlan = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }
    
    // Abre o formulário completo
    setShowForm(true);
  };

  const getCycleText = (cycle: CycleKey): string => {
    switch (cycle) {
      case 'monthly': return 'mês';
      case 'quarterly': return 'trimestre';
      case 'annual': return 'ano';
    }
  };

  // Se o formulário tá aberto, mostra ele
  if (showForm) {
    return (
      <SubscriptionForm
        planName={PLANS.individual[selectedTier].name}
        planPrice={currentPlan.price}
        planCycle={selectedCycle}
        planImages={currentPlan.images}
        priceId={currentPlan.priceId}
        includeClub={includeClub}
        clubPrice={clubPrice}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="pricing-page">
      {requirePlan && (
        <div className="alert-box">
          ⚠️ Você precisa escolher um plano para usar o app!
        </div>
      )}
      
      <div className="pricing-header">
        <h1>Escolha seu Plano</h1>
        <p>Acesso completo ao Kriative Social Studio</p>
      </div>

      <div className="cycle-tabs">
        <button
          className={selectedCycle === 'monthly' ? 'active' : ''}
          onClick={() => setSelectedCycle('monthly')}
        >
          Mensal
        </button>
        <button
          className={selectedCycle === 'quarterly' ? 'active' : ''}
          onClick={() => setSelectedCycle('quarterly')}
        >
          Trimestral
        </button>
        <button
          className={selectedCycle === 'annual' ? 'active' : ''}
          onClick={() => setSelectedCycle('annual')}
        >
          Anual
        </button>
      </div>

      <div className="plans-container">
        {(Object.keys(PLANS.individual) as TierKey[]).map((key) => {
          const plan = PLANS.individual[key];
          const details = plan[selectedCycle];
          const isSelected = selectedTier === key;
          
          return (
            <div
              key={key}
              className={`plan-box ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedTier(key)}
            >
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="price-value">R$ {details.price}</span>
                <span className="price-period">/{getCycleText(selectedCycle)}</span>
              </div>
              <ul className="plan-features">
                <li>{details.images} imagens/mês</li>
                <li>Tutoriais completos</li>
                <li>1 live semanal</li>
                {selectedCycle !== 'monthly' && <li>Mentorias mensais</li>}
                {selectedCycle !== 'monthly' && <li>GPS ADS</li>}
                <li>Suporte {selectedCycle === 'monthly' ? 'e-mail' : 'WhatsApp'}</li>
              </ul>
            </div>
          );
        })}
      </div>

      <div className="club-option">
        <label className="club-checkbox">
          <input
            type="checkbox"
            checked={includeClub}
            onChange={(e) => setIncludeClub(e.target.checked)}
          />
          <div className="club-info">
            <strong>AfiliattuzClub</strong> — Membro do Ecossistema
            <span className="club-price-add">+ R$ {clubPrice}/mês</span>
          </div>
        </label>
      </div>

      <div className="plan-summary">
        <div className="summary-row">
          <span>Plano selecionado:</span>
          <span>{PLANS.individual[selectedTier].name}</span>
        </div>
        <div className="summary-row">
          <span>Valor:</span>
          <span>R$ {currentPlan.price}</span>
        </div>
        {includeClub && (
          <div className="summary-row club">
            <span>AfiliattuzClub:</span>
            <span>+ R$ {clubPrice}</span>
          </div>
        )}
        <div className="summary-total">
          <span>Total:</span>
          <span>R$ {totalPrice}/{getCycleText(selectedCycle)}</span>
        </div>
      </div>

      <button className="btn-confirm-plan" onClick={handleSelectPlan}>
        {currentUser ? 'Continuar' : 'Fazer login para continuar'}
      </button>
    </div>
  );
}