import React, { useEffect, useState } from "react";
import Stepper from "../components/Stepper";
import PresetPicker from "../components/PresetPicker";
import StylePicker from "../components/StylePicker";
import IdeaForm from "../components/IdeaForm";
import MultiImagePlanner from "../components/MultiImagePlanner";
import VisualCanvas from "../components/VisualCanvas";
import TextTools from "../components/TextTools";
import ExportPanel from "../components/ExportPanel";
import ImageUpload from "../components/ImageUpload";
import Planner from "../components/Planner";
import MyCreations from "../components/MyCreations";

import { Preset, Idea, TextBundle, KssStyle, BatchPlan } from "../lib/types";
import { saveCreation } from "../lib/storage";

import { getUserTierFor } from "@/lib/entitlements";
import { useFeedback } from "@/hooks/useFeedback";

type Step = 0 | 1 | 2; // 0: Ideia | 1: Texto | 2: Visual

export default function Editor() {
  const [step, setStep] = useState<Step>(0);

  const [preset, setPreset] = useState<Preset>({ name: "Instagram Post", w: 1080, h: 1080 });
  const [style, setStyle] = useState<KssStyle>("disney");
  const [idea, setIdea] = useState<Idea>({ topic: "", audience: "", goal: "" });
  const [text, setText] = useState<TextBundle>({ title: "", copy: "", caption: "", hashtags: [] });
  const [plan, setPlan] = useState<BatchPlan>({ mode: "carousel", count: 3 });

  const [seedBase, setSeedBase] = useState<number>(12345);
  const [seeds, setSeeds] = useState<number[]>([]);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [showTopBand, setShowTopBand] = useState<boolean>(true);

  // ✅ Tier do usuário (PRO/STUDIO/EXCLUSIVE) vindo do Supabase
  const [tier, setTier] = useState<null | "PRO" | "STUDIO" | "EXCLUSIVE">(null);
  const { push } = useFeedback();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const t = await getUserTierFor("social");
      if (!mounted) return;
      setTier(t);
      if (!t) {
        // avisa quando não há assinatura válida
        push({ kind: "warning", message: "Sem assinatura ativa para o Social Studio." });
      } else {
        console.log("Tier detectado:", t);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [push]);

  const shell: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "16px" };
  const pill = (label: string) => <span className="chip">{label}</span>;

  const computeSeeds = (base: number, count: number) =>
    Array.from({ length: count }, (_, i) => base + i * 101);

  const handleGenerate = () => setSeeds(computeSeeds(seedBase, plan.count));
  const handleVaryAll = () => {
    const nb = Math.floor(Math.random() * 100000);
    setSeedBase(nb);
    setSeeds(computeSeeds(nb, plan.count));
  };
  const handleRegenerateOne = (index: number) =>
    setSeeds((prev) => prev.map((s, i) => (i === index ? Math.floor(Math.random() * 100000) : s)));

  // Salva THUMB 640px no localStorage para evitar quota
  const saveCard = (idx: number) => {
    const cvs = document.getElementById(`kss-canvas-${idx}`) as HTMLCanvasElement | null;
    if (!cvs) {
      alert("Canvas não encontrado.");
      return;
    }
    try {
      const targetW = 640;
      const scale = Math.min(1, targetW / cvs.width);
      const w = Math.round(cvs.width * scale);
      const h = Math.round(cvs.height * scale);

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const ctx = off.getContext("2d");
      if (!ctx) throw new Error("Contexto 2D indisponível");
      ctx.drawImage(cvs, 0, 0, w, h);

      const dataURL = off.toDataURL("image/jpeg", 0.82);

      const id = saveCreation({
        dataURL,
        meta: { preset, style, idea, text, plan, seed: seeds[idx], type: "jpg" },
      });

      try {
        window.dispatchEvent(new Event("kss:creations:changed"));
      } catch {}
      alert("✅ Salvo em “Minhas Criações”.");
    } catch (err: any) {
      const msg =
        err && err.name === "SecurityError"
          ? "Não foi possível salvar porque a imagem base é externa sem permissões (CORS). Use o botão “Enviar imagem” (upload local) ou gere sem imagem base."
          : "Falha ao salvar esta criação (talvez espaço insuficiente).";
      console.error(err);
      alert(msg);
    }
  };

  // (exemplo simples de gate por plano — ajuste quando quiser)
  const canExportPDF = tier === "STUDIO" || tier === "EXCLUSIVE";

  return (
    <main style={shell}>
      {/* Tags do topo */}
      <section className="row" style={{ marginBottom: 12, gap: 8, alignItems: "center" }}>
        {pill("Fluxo: Ideia → Texto → Visual")}
        {pill("Estilos visuais")}
        {pill("Multi-imagem")}
        {pill("PNG/JPEG/ZIP")}
        {/* Badge do plano atual */}
      </section>

      {/* Stepper */}
      <Stepper step={step} onStep={setStep} />

      {/* Passo 1 — Ideia */}
      {step === 0 && (
        <section className="card" style={{ marginTop: 12 }}>
          <h3 style={{ marginTop: 0 }}>Passo 1 — Ideia</h3>
          <IdeaForm value={idea} onChange={setIdea} />
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => setStep(1)}>
              Prosseguir para Texto
            </button>
          </div>
        </section>
      )}

      {/* Passo 2 — Texto + Planner */}
      {step === 1 && (
        <section className="card" style={{ marginTop: 12 }}>
          <h3 style={{ marginTop: 0 }}>Passo 2 — Texto</h3>
          <TextTools idea={idea} value={text} onChange={setText} />
          <Planner
            suggestedTitle={text.title || "Publicar post"}
            suggestedDesc={text.caption || text.copy || ""}
          />
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => setStep(0)}>
              Voltar
            </button>
            <button className="btn btn--primary" onClick={() => setStep(2)}>
              Prosseguir para Visual
            </button>
          </div>
        </section>
      )}

      {/* Passo 3 — Visual */}
      {step === 2 && (
        <section className="card" style={{ marginTop: 12 }}>
          <h3 style={{ marginTop: 0 }}>Passo 3 — Visual</h3>

          {/* ===== Controles principais ===== */}
          <div className="flex flex-col gap-4">
            {/* Formatos */}
            <div className="card" style={{ margin: 0 }}>
              <h4 className="m-0 mb-2">Formatos</h4>
              <div className="row">
                <PresetPicker preset={preset} onChange={setPreset} />
              </div>
            </div>

            {/* Estilos */}
            <div className="card" style={{ margin: 0 }}>
              <h4 className="m-0 mb-2">Estilos</h4>
              <div className="row">
                <StylePicker value={style} onChange={setStyle} />
              </div>
            </div>

            {/* Seletores */}
            <div className="card" style={{ margin: 0 }}>
              <h4 className="m-0 mb-2">Seletores</h4>
              <div className="row">
                <MultiImagePlanner
                  value={plan}
                  onChange={(p: BatchPlan) => {
                    setPlan(p);
                    setSeeds([]); // zera seeds ao mudar quantidade/modo
                  }}
                />
              </div>
            </div>

            {/* Linha de ações */}
            <div className="row">
              <label className="btn" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={showTopBand}
                  onChange={(e) => setShowTopBand(e.target.checked)}
                />
                Tarja superior
              </label>

              <button className="btn btn--primary" onClick={handleGenerate}>
                🎨 Gerar Imagens
              </button>

              <button className="btn btn--soft" onClick={handleVaryAll}>
                🔀 Variar Tudo
              </button>
            </div>
          </div>
          {/* ===== /Controles principais ===== */}

          {/* Upload base */}
          <ImageUpload value={baseImage} onChange={setBaseImage} />

          {/* Galeria */}
          <div className="grid" style={{ marginTop: 12 }}>
            {seeds.map((seed, idx) => (
              <div key={seed} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.7 }}>#{idx + 1} • seed {seed}</div>
                  <div className="row">
                    <button className="btn" onClick={() => handleRegenerateOne(idx)}>
                      ↻ Re-gerar
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        const cvs = document.getElementById(
                          `kss-canvas-${idx}`
                        ) as HTMLCanvasElement | null;
                        if (!cvs) return;
                        const a = document.createElement("a");
                        a.href = cvs.toDataURL("image/png");
                        a.download = `kss_${idx + 1}.png`;
                        a.click();
                      }}
                    >
                      ⬇ PNG
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        const cvs = document.getElementById(
                          `kss-canvas-${idx}`
                        ) as HTMLCanvasElement | null;
                        if (!cvs) return;
                        const a = document.createElement("a");
                        a.href = cvs.toDataURL("image/jpeg", 0.92);
                        a.download = `kss_${idx + 1}.jpg`;
                        a.click();
                      }}
                    >
                      ⬇ JPEG
                    </button>
                    <button className="btn" onClick={() => saveCard(idx)}>
                      ⭐ Salvar
                    </button>
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

          {/* Exportação */}
          <ExportPanel
            preset={preset}
            idea={idea}
            text={text}
            styleKey={style}
            plan={plan}
            seeds={seeds}
          />

          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => setStep(1)}>
              Voltar ao Texto
            </button>

            {/* Gate demo */}
            <button
              className="btn"
              disabled={!canExportPDF}
              title={canExportPDF ? "" : "Requer STUDIO ou EXCLUSIVE"}
            >
              Exportar PDF (gate demo)
            </button>
          </div>
        </section>
      )}

      {/* Minhas Criações */}
      <MyCreations />
    </main>
  );
}
