// src/lib/billing/ksPlans.ts
// Planos INDIVIDUAIS do Kriative Social Studio (PRO / STUDIO / EXCLUSIVE)
// Simples: 3 planos x 3 ciclos (mensal / trimestral / anual)

export type KSTier = "pro" | "studio" | "exclusive";
export type KSCycle = "m" | "q" | "a";

export type KSPlanId =
  | "ind_pro_m"
  | "ind_pro_q"
  | "ind_pro_a"
  | "ind_studio_m"
  | "ind_studio_q"
  | "ind_studio_a"
  | "ind_exclusive_m"
  | "ind_exclusive_q"
  | "ind_exclusive_a";

export type KSPlan = {
  id: KSPlanId;
  tier: KSTier;
  tierLabel: "PRO" | "STUDIO" | "EXCLUSIVE";
  cycle: KSCycle;
  cycleLabel: "Mensal" | "Trimestral" | "Anual";
  priceLabel: string; // ex: "R$ 49,00 / mês"
  highlight?: string;
  shortDescription: string;
  bullets: string[];
  mockCredits?: number;
};

// Tabela simples de planos individuais
const PLANS: KSPlan[] = [
  // PRO
  {
    id: "ind_pro_m",
    tier: "pro",
    tierLabel: "PRO",
    cycle: "m",
    cycleLabel: "Mensal",
    priceLabel: "R$ 49,00 / mês",
    highlight: "Para começar",
    shortDescription:
      "Para criadores iniciantes que querem validar formatos e ofertas.",
    bullets: [
      "Até 3 projetos ativos",
      "Posts e carrosséis básicos com IA",
      "Exportação PNG/JPEG",
    ],
    mockCredits: 120,
  },
  {
    id: "ind_pro_q",
    tier: "pro",
    tierLabel: "PRO",
    cycle: "q",
    cycleLabel: "Trimestral",
    priceLabel: "R$ 129,00 / tri",
    shortDescription: "Mesmo plano PRO com custo mensal reduzido.",
    bullets: [
      "Tudo do PRO Mensal",
      "Economia no valor mensal",
      "Preparado para upgrade futuro",
    ],
    mockCredits: 360,
  },
  {
    id: "ind_pro_a",
    tier: "pro",
    tierLabel: "PRO",
    cycle: "a",
    cycleLabel: "Anual",
    priceLabel: "R$ 468,00 / ano",
    shortDescription: "Melhor custo efetivo para quem já decidiu começar.",
    bullets: [
      "Tudo do PRO Mensal",
      "Melhor valor mensal efetivo",
      "Plano ideal para começar forte",
    ],
    mockCredits: 1440,
  },

  // STUDIO
  {
    id: "ind_studio_m",
    tier: "studio",
    tierLabel: "STUDIO",
    cycle: "m",
    cycleLabel: "Mensal",
    priceLabel: "R$ 99,00 / mês",
    highlight: "Mais usado",
    shortDescription:
      "Para quem produz conteúdo de forma recorrente e quer mais recursos.",
    bullets: [
      "Até 10 projetos ativos",
      "Biblioteca de presets visuais",
      "Mais controle criativo por projeto",
    ],
    mockCredits: 360,
  },
  {
    id: "ind_studio_q",
    tier: "studio",
    tierLabel: "STUDIO",
    cycle: "q",
    cycleLabel: "Trimestral",
    priceLabel: "R$ 267,00 / tri",
    shortDescription: "Ideal para social media e pequenos estúdios.",
    bullets: [
      "Tudo do STUDIO Mensal",
      "Melhor custo mensal efetivo",
      "Planejamento trimestral mais estável",
    ],
    mockCredits: 1080,
  },
  {
    id: "ind_studio_a",
    tier: "studio",
    tierLabel: "STUDIO",
    cycle: "a",
    cycleLabel: "Anual",
    priceLabel: "R$ 948,00 / ano",
    shortDescription: "Para quem já vive de conteúdo e quer estabilidade.",
    bullets: [
      "Tudo do STUDIO Mensal",
      "Menor valor efetivo por mês",
      "Foco em operação de longo prazo",
    ],
    mockCredits: 4320,
  },

  // EXCLUSIVE
  {
    id: "ind_exclusive_m",
    tier: "exclusive",
    tierLabel: "EXCLUSIVE",
    cycle: "m",
    cycleLabel: "Mensal",
    priceLabel: "R$ 198,00 / mês",
    highlight: "Alta performance",
    shortDescription:
      "Para operações que precisam do máximo de liberdade criativa.",
    bullets: [
      "Projetos ilimitados",
      "Prioridade em novidades KS",
      "Suporte mais próximo",
    ],
    mockCredits: 1200,
  },
  {
    id: "ind_exclusive_q",
    tier: "exclusive",
    tierLabel: "EXCLUSIVE",
    cycle: "q",
    cycleLabel: "Trimestral",
    priceLabel: "R$ 537,00 / tri",
    shortDescription: "Para operações em múltiplos clientes/canais.",
    bullets: [
      "Tudo do EXCLUSIVE Mensal",
      "Melhor custo mensal efetivo",
      "Ideal para agências e squads",
    ],
    mockCredits: 3600,
  },
  {
    id: "ind_exclusive_a",
    tier: "exclusive",
    tierLabel: "EXCLUSIVE",
    cycle: "a",
    cycleLabel: "Anual",
    priceLabel: "R$ 1.896,00 / ano",
    shortDescription:
      "Para quem quer o Social Studio como stack central de conteúdo.",
    bullets: [
      "Tudo do EXCLUSIVE Mensal",
      "Menor custo efetivo por mês",
      "Pensado para operação de alto volume",
    ],
    mockCredits: 14400,
  },
];

export function getPlanById(id: KSPlanId): KSPlan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function getPlansByTier(tier: KSTier): KSPlan[] {
  return PLANS.filter((p) => p.tier === tier);
}

export function getDefaultMonthlyPlan(tier: KSTier): KSPlan {
  const found = PLANS.find((p) => p.tier === tier && p.cycle === "m");
  if (!found) {
    throw new Error(`No monthly plan for tier: ${tier}`);
  }
  return found;
}
