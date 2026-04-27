/* =============================================================================
   ARQUIVO: COMPONENTS/IDEAFORM.TSX — V4.2
   CORRIGIDO: chaves i18n alinhadas ao ecossistema (i18n.tsx universal)
   =============================================================================
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Idea } from '../lib/types';

interface IdeaFormProps {
  value: Idea;
  onChange: (val: Idea) => void;
}

export default function IdeaForm({ value, onChange }: IdeaFormProps) {
  const { t } = useTranslation();

  const handleChange = (field: keyof Idea, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="flex flex-col gap-6 bg-gradient-to-br from-slate-900/80 to-purple-950/30 p-6 rounded-2xl border border-purple-500/20 shadow-xl">

      {/* Tópico / Marca */}
      <div className="w-full">
        <label className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wider">
          {t('ss_topic_label')}
        </label>
        <input
          className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-purple-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          value={value.topic || ''}
          onChange={(e) => handleChange('topic', e.target.value)}
          placeholder={t('ss_topic_placeholder')}
        />
      </div>

      {/* Público-alvo */}
      <div className="w-full">
        <label className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wider">
          {t('ss_audience_label')}
        </label>
        <input
          className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-purple-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          value={value.audience || ''}
          onChange={(e) => handleChange('audience', e.target.value)}
          placeholder={t('ss_audience_placeholder')}
        />
      </div>

      {/* Objetivo */}
      <div className="w-full">
        <label className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wider">
          {t('ss_goal_label')}
        </label>
        <input
          className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-purple-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          value={value.goal || ''}
          onChange={(e) => handleChange('goal', e.target.value)}
          placeholder={t('ss_goal_placeholder')}
        />
      </div>

      {/* Descrição / Contexto */}
      <div className="w-full">
        <label className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wider">
          {t('ss_description_label')}
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-purple-500/30 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
          value={value.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder={t('ss_description_placeholder')}
        />
      </div>
    </div>
  );
}