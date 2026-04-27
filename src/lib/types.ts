// src/lib/types.ts

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  
  // Dados do Ecossistema
  credits?: number;
  plan?: string;
  tier?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'canceled' | 'past_due';
  activeApps?: string[];
  
  // Billing
  billing?: {
    status: 'active' | 'inactive';
    plan: string;
    nextInvoice?: string;
  };
  // Compatibilidade
  isActive?: boolean; 
  hasActivePlan?: boolean;
}

// --- TIPOS AJUSTADOS PARA O SEU EDITOR ---

// 1. KssStyle: Aceita string (para 'disney') OU objeto (para estilos complexos)
export type KssStyle = string;
export interface Preset {
  id?: string;
  name: string;
  w?: number;
  h?: number;
  styleId?: string;
  layout?: 'classic' | 'modern' | 'bold';
}

// 2. TextBundle: Inclui TODOS os campos que o Editor usa
export interface TextBundle {
  title?: string;     
  headline?: string;  
  copy?: string;      
  body?: string;      
  caption: string;    
  hashtags: string[];
}

export interface Idea {
  id?: string;
  topic: string;
  description?: string;
  audience?: string; 
  goal?: string;     
  textBundle?: TextBundle;
  createdAt?: string;
}

export interface BatchPlan {
  id?: string;
  date?: string;
  mode?: string; 
  count: number;
  ideas?: Idea[];
  status?: 'draft' | 'scheduled' | 'published';
}