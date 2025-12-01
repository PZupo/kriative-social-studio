// src/lib/afiliattuzPricing.ts

export type Cycle = "mensal" | "trimestral" | "anual";
export type IndividualTier = "pro" | "studio" | "exclusive";

export const CYCLE_MONTHS: Record<Cycle, number> = {
  mensal: 1,
  trimestral: 3,
  anual: 12,
};

// Club efetivo / mês para cada tier
const CLUB_PER_MONTH: Record<IndividualTier, number> = {
  pro: 80,
  studio: 50,
  exclusive: 30,
};

// Valores base (sem Club) JÁ com desconto
const BASE_INDIVIDUAL: Record<IndividualTier, Record<Cycle, number>> = {
  pro: {
    mensal: 49,
    trimestral: 129,
    anual: 468,
  },
  studio: {
    mensal: 99,
    trimestral: 267,
    anual: 948,
  },
  exclusive: {
    mensal: 198,
    trimestral: 537,
    anual: 1896,
  },
};

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export type IndividualPlanPrice = {
  tier: IndividualTier;
  cycle: Cycle;
  base: number;          // sem Club
  clubPerMonth: number;  // Club/mês
  months: number;        // 1, 3, 12
  totalWithClub: number; // base + clubPerMonth * months
};

export function calcIndividualPrice(
  tier: IndividualTier,
  cycle: Cycle
): IndividualPlanPrice {
  const base = BASE_INDIVIDUAL[tier][cycle];
  const clubPerMonth = CLUB_PER_MONTH[tier];
  const months = CYCLE_MONTHS[cycle];
  const totalWithClub = base + clubPerMonth * months;

  return {
    tier,
    cycle,
    base,
    clubPerMonth,
    months,
    totalWithClub,
  };
}

// Tabela pronta com TODOS os planos individuais
export const INDIVIDUAL_PRICES: IndividualPlanPrice[] = [
  calcIndividualPrice("pro", "mensal"),
  calcIndividualPrice("pro", "trimestral"),
  calcIndividualPrice("pro", "anual"),

  calcIndividualPrice("studio", "mensal"),
  calcIndividualPrice("studio", "trimestral"),
  calcIndividualPrice("studio", "anual"),

  calcIndividualPrice("exclusive", "mensal"),
  calcIndividualPrice("exclusive", "trimestral"),
  calcIndividualPrice("exclusive", "anual"),
];
