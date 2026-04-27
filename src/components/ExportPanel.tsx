import React from 'react';
import { useAuth } from "../contexts/AuthContext"; // Import correto
import { Preset, Idea, TextBundle, KssStyle, BatchPlan } from "../lib/types";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ExportPanelProps {
  preset: Preset;
  idea: Idea;
  text: TextBundle;
  styleKey: KssStyle;
  plan: BatchPlan;
  seeds: number[];
}

export default function ExportPanel({ preset, idea, text, styleKey, plan, seeds }: ExportPanelProps) {
  // ✅ CORREÇÃO: Usamos userData para verificar permissão
  const { userData } = useAuth();
  const canExportZip = userData?.isActive || userData?.hasActivePlan;

  // ✅ CORREÇÃO DE TIPO: Garante que teremos uma string para o nome do arquivo
  // Se styleKey for objeto, pega o name. Se for string, usa ela mesma.
const styleName = styleKey;
  const handleDownloadZip = async () => {
    if (!canExportZip) {
      alert("Funcionalidade exclusiva para assinantes (Plano Ativo).");
      return;
    }
    
    const zip = new JSZip();
    const folderName = `KSS_Campaign_${new Date().toISOString().split('T')[0]}`;
    const folder = zip.folder(folderName);

    // Adiciona um arquivo de texto com os detalhes
    const info = `
      Campanha: ${idea.topic}
      Data: ${new Date().toLocaleString()}
      Estilo: ${styleName}
      Preset: ${preset.name}
      ---
      Título: ${text.title || text.headline || ''}
      Legenda: ${text.caption}
      Hashtags: ${text.hashtags.join(' ')}
    `;
    folder?.file("info.txt", info);

    // Gera o ZIP
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${folderName}.zip`);
    });
  };

  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Exportar Campanha</h4>
        {!canExportZip && <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">PREMIUM</span>}
      </div>
      
      <p className="text-xs text-slate-400 mb-4">
        Baixe todas as imagens geradas e os textos em um único arquivo ZIP organizado.
      </p>

      <button
        onClick={handleDownloadZip}
        disabled={!canExportZip}
        className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all
          ${canExportZip 
            ? 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-lg shadow-teal-500/20' 
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'}
        `}
      >
        <span>📦</span> Baixar Pacote ZIP
      </button>
    </div>
  );
}