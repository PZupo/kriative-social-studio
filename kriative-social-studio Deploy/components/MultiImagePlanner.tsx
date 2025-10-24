import React from 'react';
import { BatchPlan } from '../lib/types';

/**
 * MultiImagePlanner
 * Permite escolher o modo (Carrossel, Reels, Stories)
 * e o número de imagens a gerar.
 */
export default function MultiImagePlanner({
  value,
  onChange
}: {
  value: BatchPlan;
  onChange: (p: BatchPlan) => void;
}) {
  const setMode = (m: BatchPlan['mode']) => onChange({ ...value, mode: m });
  const setCount = (n: number) => onChange({ ...value, count: n });

  // 🔹 Corrigido: agora permite 1 imagem em todos os modos
  const counts =
    value.mode === 'reels'
      ? [1, 2, 3]
      : value.mode === 'stories'
      ? [1, 2, 3, 4]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="row">
      <select
        className="btn"
        value={value.mode}
        onChange={e => setMode(e.target.value as any)}
      >
        <option value="carousel">Carrossel</option>
        <option value="reels">Reels</option>
        <option value="stories">Stories</option>
      </select>
      <select
        className="btn"
        value={value.count}
        onChange={e => setCount(parseInt(e.target.value))}
      >
        {counts.map(c => (
          <option key={c} value={c}>
            {c} imagem{c > 1 ? 's' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
