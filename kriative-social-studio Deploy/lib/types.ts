export type Preset = { name:string; w:number; h:number };
export type Idea = { topic:string; audience:string; goal:string };
export type TextBundle = { title:string; copy:string; caption:string; hashtags:string[] };
export type KssStyle = 'disney'|'cyberpunk'|'ghibli'|'aquarela'|'noir';
export type BatchPlan = { mode:'carousel'|'reels'|'stories'; count:number };
