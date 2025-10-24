import { Idea } from './types';
export const sleep = (ms:number)=> new Promise(r=>setTimeout(r,ms));
export function mockTitle(idea:Idea){ const t = idea.topic || 'Seu Tema'; return `🚀 ${t}: Dica Rápida`; }
export function mockCopy(idea:Idea){ const g = idea.goal || 'Alcance e Engajamento'; return `Como alcançar ${g.toLowerCase()} em 3 passos. Salve para aplicar depois!`; }
export function mockCaption(idea:Idea){ const aud = idea.audience || 'criadores'; return `Para ${aud}: 3 ajustes que mudam o jogo. Qual você já usa? 👇`; }
export function mockHashtags(idea:Idea){ return ['#marketing','#socialmedia','#conteudo','#branding','#growth','#reels','#shorts','#thumbnail']; }
