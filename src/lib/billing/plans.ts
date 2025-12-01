// src/lib/billing/plans.ts
export type KSPlanId =
  // INDIVIDUAL — PRO
  | "ind_pro_m"
  | "ind_pro_q"
  | "ind_pro_a"
  // INDIVIDUAL — STUDIO
  | "ind_studio_m"
  | "ind_studio_q"
  | "ind_studio_a"
  // INDIVIDUAL — EXCLUSIVE
  | "ind_exclusive_m"
  | "ind_exclusive_q"
  | "ind_exclusive_a";

export interface KSPlan {
  id: KSPlanId;
  tier: "pro" | "studio" | "exclusive";
  name: string;
  subtitle: string;
  priceLabel: string;
  badge?: string;
  highlight?: boolean;
  description: string;
  features: string[];
}

// 3 planos principais (mensal) para o card bege
export const KS_PLANS: KSPlan[] = [
  {
    id: "ind_pro_m",
    tier: "pro",
    name: "Plano PRO",
    subtitle: "Para quem está começando a monetizar a criatividade.",
    priceLabel: "R$ 47/mês",
    badge: "Essencial",
    description:
      "Acesso às principais funções de criação + limites confortáveis para começar.",
    features: [
      "Criações ilimitadas em modo rascunho",
      "Exportação básica (imagem ou PDF, conforme o app)",
      "Suporte via e-mail em horário comercial",
      "Ideal para profissionais autônomos no início"
    ]
  },
  {
    id: "ind_studio_m",
    tier: "studio",
    name: "Studio",
    subtitle: "Para quem produz conteúdo com mais frequência.",
    priceLabel: "R$ 97/mês",
    badge: "Mais popular",
    highlight: true,
    description:
      "Mais créditos, mais recursos e fluxo de trabalho otimizado para produção constante.",
    features: [
      "Todas as funções do Plano PRO",
      "Créditos extras para IA (imagens / mangá / looks / páginas)",
      "Exportações avançadas e templates premium",
      "Prioridade no suporte e melhorias"
    ]
  },
  {
    id: "ind_exclusive_m",
    tier: "exclusive",
    name: "Exclusive",
    subtitle: "Para quem vive de conteúdo ou atende clientes.",
    priceLabel: "R$ 197/mês",
    badge: "Profissional",
    description:
      "O pacote completo para quem precisa de fluxo intenso, branding forte e diferenciação.",
    features: [
      "Todas as funções do Studio",
      "Limites muito mais altos de uso de IA",
      "Recursos avançados (ex: branding, presets e pastas)",
      "Canal de suporte prioritário (quando disponível)"
    ]
  }
];

export const KS_PLAN_PRICE_MAP: Record<
  KSPlanId,
  { displayLabel: string; stripePriceId?: string }
> = {
  // PRO
  ind_pro_m: { displayLabel: "R$ 47/mês" },
  ind_pro_q: { displayLabel: "R$ 129/trimestre" },
  ind_pro_a: { displayLabel: "R$ 470/ano" },
  // STUDIO
  ind_studio_m: { displayLabel: "R$ 97/mês" },
  ind_studio_q: { displayLabel: "R$ 267/trimestre" },
  ind_studio_a: { displayLabel: "R$ 970/ano" },
  // EXCLUSIVE
  ind_exclusive_m: { displayLabel: "R$ 197/mês" },
  ind_exclusive_q: { displayLabel: "R$ 537/trimestre" },
  ind_exclusive_a: { displayLabel: "R$ 1.970/ano" }
};
