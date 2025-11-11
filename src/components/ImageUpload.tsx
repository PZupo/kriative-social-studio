import React from "react";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="card">
      <h4 className="m-0 mb-2">Imagem base (opcional)</h4>
      <div className="flex items-center gap-2 mb-2">
        <label className="btn btn--soft cursor-pointer">
          📤 Enviar imagem
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
        {value && (
          <button className="btn" onClick={() => onChange(null)}>
            🗑️ Remover
          </button>
        )}
      </div>

      {value ? (
        <div className="flex flex-col items-start gap-2">
          <span className="text-xs opacity-70">
            Imagem carregada ✓ (será ajustada ao canvas)
          </span>
          <img
            src={value}
            alt="Prévia da imagem base"
            className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
          />
        </div>
      ) : (
        <p className="text-xs opacity-70">
          Nenhuma imagem enviada. A geração usará plano neutro.
        </p>
      )}
    </div>
  );
}
