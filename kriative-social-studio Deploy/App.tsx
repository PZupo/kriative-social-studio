import React, { useState } from 'react';
import ThemeToggle from './components/ThemeToggle';
import Stepper from './components/Stepper';
import PresetPicker from './components/PresetPicker';
import StylePicker from './components/StylePicker';
import IdeaForm from './components/IdeaForm';
import MultiImagePlanner from './components/MultiImagePlanner';
import VisualCanvas from './components/VisualCanvas';
import TextTools from './components/TextTools';
import ExportPanel from './components/ExportPanel';
import ImageUpload from './components/ImageUpload';
import Planner from './components/Planner';
import MyCreations from './components/MyCreations';
import { Preset, Idea, TextBundle, KssStyle, BatchPlan } from './lib/types';
import { saveCreation } from './lib/storage';

type Step = 0 | 1 | 2;

export default function App() {
  const [step, setStep] = useState<Step>(0);
  const [preset, setPreset] = useState<Preset>({ name: 'Instagram Post', w: 1080, h: 1080 });
  const [style, setStyle] = useState<KssStyle>('disney');
  const [idea, setIdea] = useState<Idea>({ topic: '', audience: '', goal: '' });
  const [text, setText] = useState<TextBundle>({ title: '', copy: '', caption: '', hashtags: [] });
  const [plan, setPlan] = useState<BatchPlan>({ mode: 'carousel', count: 3 });
  const [seedBase, setSeedBase] = useState<number>(12345);
  const [seeds, setSeeds] = useState<number[]>([]);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [showTopBand, setShowTopBand] = useState<boolean>(true);

  const shell: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '16px' };
  const h1: React.CSSProperties = { fontSize: 28, margin: 0 };
  const pill = (label: string) => <span className="chip">{label}</span>;

  const computeSeeds = (base: number, count: number) => Array.from({ length: count }, (_, i) => base + i * 101);
  const handleGenerate = () => setSeeds(computeSeeds(seedBase, plan.count));
  const handleVaryAll = () => {
    const nb = Math.floor(Math.random() * 100000);
    setSeedBase(nb);
    setSeeds(computeSeeds(nb, plan.count));
  };
  const handleRegenerateOne = (index: number) => setSeeds(prev => prev.map((s, i) => (i === index ? Math.floor(Math.random() * 100000) : s)));

  const saveCard = (idx: number, type: 'png' | 'jpg') => {
    const cvs = document.getElementById(`kss-canvas-${idx}`) as HTMLCanvasElement | null;
    if (!cvs) { alert('Canvas não encontrado.'); return; }
    try {
      const dataURL = type === 'png' ? cvs.toDataURL('image/png') : cvs.toDataURL('image/jpeg', 0.92);
      const id = saveCreation({ dataURL, meta: { preset, style, idea, text, plan, seed: seeds[idx], type } });
      alert('Salvo em “Minhas Criações”.');
    } catch (err: any) {
      const msg = (err && err.name === 'SecurityError')
        ? 'Não foi possível salvar porque a imagem base é externa sem permissões (CORS). Use o botão “Enviar imagem” (upload do seu dispositivo) ou gere sem imagem base.'
        : 'Falha ao salvar esta criação.';
      alert(msg);
    }
  };

  return (
    <>
      {/* HEADER FIXO */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 50,
        height: 64,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(to right, #9333ea, #ec4899)',
              borderRadius: 8
            }}></div>
            <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#111' }}>Social Studio</span>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="/" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Dashboard</a>
            <a href="/planos" style={{ color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Planos</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <select style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: '0.875rem',
              background: 'white'
            }}>
              <option>PT-BR</option>
              <option>EN</option>
              <option>ES</option>
            </select>
            <button style={{
              width: 32,
              height: 32,
              background: '#d1d5db',
              borderRadius: '50%',
              cursor: 'pointer',
              border: 'none'
            }} aria-label="Perfil"></button>
          </div>
        </div>
      </header>

      {/* APP COM PADDING */}
      <main style={{ ...shell, paddingTop: 80 }}>
        {/* Header interno */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={h1}>
            <span className="gradText">Kriative Social Studio</span> — Online
          </h1>
          <div className="row">
            <ThemeToggle />
          </div>
        </header>

        {/* Tags */}
        <section className="row" style={{ marginBottom: 12 }}>
          {pill('Vite + React + TS')}
          {pill('Fluxo: Ideia to Texto to Visual')}
          {pill('Estilos visuais')}
          {pill('Multi-imagem')}
          {pill('PNG/JPEG/ZIP')}
        </section>

        {/* Stepper */}
        <Stepper step={step} onStep={setStep} />

        {/* Passos */}
        {step === 0 && (
          <section className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Passo 1 — Ideia</h3>
            <IdeaForm value={idea} onChange={setIdea} />
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => setStep(1)}>Prosseguir para Texto</button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Passo 2 — Texto</h3>
            <TextTools idea={idea} value={text} onChange={setText} />
            <Planner suggestedTitle={text.title || 'Publicar post'} suggestedDesc={text.caption || text.copy || ''} />
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => setStep(0)}>Voltar</button>
              <button className="btn btn--primary" onClick={() => setStep(2)}>Prosseguir para Visual</button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="card" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Passo 3 — Visual</h3>
            <div className="row" style={{ alignItems: 'center', marginBottom: 8 }}>
              <PresetPicker preset={preset} onChange={setPreset} />
              <StylePicker value={style} onChange={setStyle} />
              <MultiImagePlanner value={plan} onChange={p => { setPlan(p); setSeeds([]); }} />
              <label className="btn" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="checkbox" checked={showTopBand} onChange={e => setShowTopBand(e.target.checked)} />
                Tarja superior
              </label>
              <button className="btn btn--primary" onClick={handleGenerate}>Gerar Imagens</button>
              <button className="btn" onClick={handleVaryAll}>Variar Tudo</button>
            </div>
            <ImageUpload value={baseImage} onChange={setBaseImage} />
            <div className="grid" style={{ marginTop: 12 }}>
              {seeds.map((seed, idx) => (
                <div key={seed} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>#{idx + 1} • seed {seed}</div>
                    <div className="row">
                      <button className="btn" onClick={() => handleRegenerateOne(idx)}>Re-gerar</button>
                      <button className="btn" onClick={() => {
                        const cvs = document.getElementById(`kss-canvas-${idx}`) as HTMLCanvasElement | null;
                        if (!cvs) return;
                        const a = document.createElement('a');
                        a.href = cvs.toDataURL('image/png');
                        a.download = `kss_${idx + 1}.png`;
                        a.click();
                      }}>PNG</button>
                      <button className="btn" onClick={() => {
                        const cvs = document.getElementById(`kss-canvas-${idx}`) as HTMLCanvasElement | null;
                        if (!cvs) return;
                        const a = document.createElement('a');
                        a.href = cvs.toDataURL('image/jpeg', 0.92);
                        a.download = `kss_${idx + 1}.jpg`;
                        a.click();
                      }}>JPEG</button>
                      <button className="btn" onClick={() => saveCard(idx, 'png')}>Salvar</button>
                    </div>
                  </div>
                  <div className="frame">
                    <VisualCanvas
                      id={`kss-canvas-${idx}`}
                      preset={preset}
                      styleKey={style}
                      idea={idea}
                      text={text}
                      seed={seed}
                      baseImage={baseImage}
                      showTopBand={showTopBand}
                    />
                  </div>
                </div>
              ))}
            </div>
            <ExportPanel preset={preset} idea={idea} text={text} styleKey={style} plan={plan} seeds={seeds} />
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => setStep(1)}>Voltar ao Texto</button>
            </div>
          </section>
        )}

        <MyCreations />
      </main>
    </>
  );
}
