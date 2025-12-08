import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function CheckoutButton({ priceId, planName, children }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

    try {
      const stripe = await stripePromise;
      const createCheckout = httpsCallable(functions, 'createCheckoutSession');
      
      const { data } = await createCheckout({
        priceId,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/pricing`
      });

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Processando...' : children || `Assinar ${planName}`}
    </button>
  );
}