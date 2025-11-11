// src/pages/Plans.tsx
import React, { useState } from "react";

type PlanId = "pro" | "studio" | "exclusive";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    id: "pro",
    name: "PRÓ",
    price: "R$ 49,99 / mês",
    description:
      "Para criadores e social designers individuais que querem produzir posts e carrosséis profissionais com IA.",
    features: [
      "Até 100 posts/mês",
      "5 modelos premium editáveis",
      "Geração de copy e legendas por IA",
      "Exportação de posts otimizados",
    ],
  },
  {
    id: "studio",
    name: "STUDIO",
    price: "R$ 89,00 / mês",
    description:
      "Para estúdios e equipes criativas que produzem conteúdo em volume e querem mais flexibilidade e recursos.",
    features: [
      "Até 300 posts/mês",
      "15 modelos premium",
      "Geração de imagem e texto por IA",
      "Biblioteca colaborativa de criações",
    ],
    highlight: true,
  },
  {
    id: "exclusive",
    name: "EXCLUSIVE",
    price: "R$ 149,00 / mês",
    description:
      "Para agências e marcas que precisam de liberdade total, suporte VIP e integrações avançadas.",
    features: [
      "Posts ilimitados",
      "Acesso antecipado a novos templates",
      "Integração com APIs externas (Stripe, Firebase, etc.)",
      "Suporte dedicado 24h",
    ],
  },
];

export default function Plans() {
  const [activePlan, setActivePlan] = useState<PlanId>("pro");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plans[0]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSelect(plan: Plan) {
    setActivePlan(plan.id);
    setSelectedPlan(plan);
    setShowModal(true); // abre modal
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !selectedPlan) {
      alert("Preencha nome e e-mail para continuar.");
      return;
    }

    alert(
      [
        "✅ Assinatura mock registrada!",
        "",
        `Plano: ${selectedPlan.name} (${selectedPlan.price})`,
        `Nome: ${name}`,
        `E-mail: ${email}`,
        "",
        "No ambiente real, aqui abriria o checkout Stripe ou gravaria no Firebase.",
      ].join("\n")
    );

    setName("");
    setEmail("");
    setShowModal(false);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f19] text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-teal-500 to-orange-500 bg-clip-text text-transparent">
        Planos Kriative Social Studio
      </h1>
      <p className="text-center mb-10 text-gray-500 dark:text-gray-400">
        Escolha o plano ideal para o seu fluxo criativo. Você poderá finalizar a assinatura em poucos cliques.
      </p>

      {/* Cards de planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative border rounded-2xl p-8 flex flex-col justify-between shadow-md transition-all ${
              plan.highlight
                ? "border-teal-500/80 bg-gradient-to-b from-teal-500/5 to-orange-500/10"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                Mais Popular
              </span>
            )}

            <div>
              <h2 className="text-2xl font-semibold mb-1">{plan.name}</h2>
              <p className="text-teal-500 dark:text-teal-400 font-bold text-xl mb-3">
                {plan.price}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {plan.description}
              </p>
              <ul className="space-y-2 text-sm">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-teal-500">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelect(plan)}
              className={`mt-8 py-2 rounded-lg font-semibold transition-all ${
                activePlan === plan.id
                  ? "bg-gradient-to-r from-teal-500 to-orange-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-orange-500 hover:text-white"
              }`}
            >
              {activePlan === plan.id ? "Assinar este plano" : "Selecionar plano"}
            </button>
          </div>
        ))}
      </div>

      {/* Modal de checkout mock */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-xl p-6 relative">
            {/* Botão fechar */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Fechar"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-1">
              Confirmar assinatura (mock)
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Plano selecionado:{" "}
              <span className="font-semibold text-teal-600 dark:text-teal-400">
                {selectedPlan.name} — {selectedPlan.price}
              </span>
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1 text-sm">
                <label className="block font-medium">Nome completo</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                />
              </div>

              <div className="space-y-1 text-sm">
                <label className="block font-medium">E-mail</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-orange-500 text-white shadow-sm hover:brightness-110 transition"
              >
                Confirmar assinatura (mock)
              </button>
            </form>

            <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-500">
              * Este é apenas um fluxo de teste. Na versão final, este modal será
              integrado ao checkout Stripe + Firebase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
