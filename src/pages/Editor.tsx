// src/pages/Editor.tsx
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

type Step = 0 | 1 | 2;

// texto neutro que NÃO desenha nada na arte
const EMPTY_TEXT: TextBundle = {
  title: "",
  copy: "",
  caption: "",
  hashtags: [],
};

export default function Editor() {
  const [step, setStep] = useState<Step>(0);

  const [preset, setPreset] = useState<Preset>({
    name: "Instagram Post",
    w: 1080,
    h: 1080,
  });
  const [style, setStyle] = useState<KssStyle>("disney");
  const [idea, setIdea] = useState<Idea>({
    topic: "",
    audience: "",
    goal: "",
  });
  const [text, setText] = useState<TextBundle>({
    title: "",
    copy: "",
    caption: "",
    hashtags: [],
  });
  const [plan, setPlan] = useState<BatchPlan>({ mode: "carousel", count: 3 });

  const [seedBase, setSeedBase] = useState<number>(12345);
  const [seeds, setSeeds] = useState<number[]>([]);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [showTopBand, setShowTopBand] = useState<boolean>(true);

  // textos específicos por imagem (metadados, NÃO vão para a arte)
  const [cardTexts, setCardTexts] = useState<TextBundle[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [tier, setTier] = useState<null | "PRO" | "STUDIO" | "EXCLUSIVE">(null);
  const { push } = useFeedback();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const t = await getUserTierFor("social");
      if (!mounted) return;
      setTier(t);
      if (!t) {
        push({
          kind: "warning",
          message: "Sem assinatura ativa para o Social Studio.",
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [push]);

  const shell: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "16px",
  };

  const pill = (label: string) => <span className="chip">{label}</span>;

  const computeSeeds = (base: number, count: number) =>
    Array.from({ length: count }, (_, i) => base + i * 101);

  const handleGenerate = () => {
    const nextSeeds = computeSeeds(seedBase, plan.count);
    setSeeds(nextSeeds);
    setCardTexts(nextSeeds.map(() => ({ ...text })));
    setSelectedIndex(nextSeeds.length > 0 ? 0 : null);
  };

  const handleVaryAll = () => {
    const nb = Math.floor(Math.random() * 100000);
    setSeedBase(nb);
    const nextSeeds = computeSeeds(nb, plan.count);
    setSeeds(nextSeeds);
    setCardTexts(nextSeeds.map(() => ({ ...text })));
    setSelectedIndex(nextSeeds.length > 0 ? 0 : null);
  };

  const handleRegenerateOne = (index: number) =>
    setSeeds((prev) =>
      prev.map((s, i) => (i === index ? Math.floor(Math.random() * 100000) : s))
    );

  const saveCard = (idx: number) => {
    const cvs = document.getElementById(
      `kss-canvas-${idx}`
    ) as HTMLCanvasElement | null;
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
      const metaText = cardTexts[idx] || text;

      saveCreation({
        dataURL,
        meta: {
          preset,
          style,
          idea,
          text: metaText,
          plan,
          seed: seeds[idx],
          type: "jpg",
        },
      });

      try {
        window.dispatchEvent(new Event("kss:creations:changed"));
      } catch {}
      alert("✅ Salvo em “Minhas Criações”.");
    } catch (err: any) {
      const msg =
        err && err.name === "SecurityError"
          ? "Não foi possível salvar porque a imagem base é externa sem permissões (CORS)."
          : "Falha ao salvar esta criação (talvez espaço insuficiente).";
      console.error(err);
      alert(msg);
    }
  };

  const canExportPDF = tier === "STUDIO" || tier === "EXCLUSIVE";

  const handleCardTextFieldChange = (
    field: keyof Pick<TextBundle, "title" | "copy" | "caption">,
    value: string
  ) => {
    if (selectedIndex == null) return;
    setCardTexts((prev) => {
      const next = [...prev];
      const base = next[selectedIndex] || { ...text };
      next[selectedIndex] = { ...base, [field]: value };
      return next;
    });
  };

  return (
    <main style={shell}>
      {/* Tags do topo */}
      <section
        className="row"
        style={{ marginBottom: 12, gap: 8, alignItems: "center" }}
      >
        {pill("Fluxo: Ideia → Texto → Visual")}
        {pill("Estilos visuais")}
        {pill("Multi-imagem")}
        {pill("PNG/JPEG/ZIP")}
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

      {/* Passo 2 — Texto */}
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

          <div className="grid gap-4 md:grid-cols-3">
            {/* Coluna 1: controles */}
            <div className="flex flex-col gap-4">
              <div className="card" style={{ margin: 0 }}>
                <h4 className="m-0 mb-2">Formatos</h4>
                <div className="row">
                  <PresetPicker preset={preset} onChange={setPreset} />
                </div>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <h4 className="m-0 mb-2">Estilos</h4>
                <div className="row">
                  <StylePicker value={style} onChange={setStyle} />
                </div>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <h4 className="m-0 mb-2">Seletores</h4>
                <div className="row">
                  <MultiImagePlanner
                    value={plan}
                    onChange={(p: BatchPlan) => {
                      setPlan(p);
                      setSeeds([]);
                      setCardTexts([]);
                      setSelectedIndex(null);
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <label
                  className="btn"
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
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

              <ImageUpload value={baseImage} onChange={setBaseImage} />
            </div>

            {/* Coluna 2: prévias (só arte, SEM texto) */}
            <div className="flex flex-col gap-4">
              <div className="grid" style={{ marginTop: 0 }}>
                {seeds.map((seed, idx) => (
                  <div
                    key={seed}
                    className="card"
                    style={{
                      border:
                        selectedIndex === idx
                          ? "2px solid var(--accent, #14b8a6)"
                          : undefined,
                    }}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ fontSize: 12, opacity: 0.7 }}>
                        #{idx + 1} • seed {seed}
                      </div>
                      <div className="row">
                        <button
                          className="btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegenerateOne(idx);
                          }}
                        >
                          ↻ Re-gerar
                        </button>
                        <button
                          className="btn"
                          onClick={(e) => {
                            e.stopPropagation();
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
                          onClick={(e) => {
                            e.stopPropagation();
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
                        <button
                          className="btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveCard(idx);
                          }}
                        >
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
                        text={EMPTY_TEXT} // 👈 não desenha texto
                        seed={seed}
                        baseImage={baseImage}
                        showTopBand={showTopBand}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <ExportPanel
                preset={preset}
                idea={idea}
                text={text}
                styleKey={style}
                plan={plan}
                seeds={seeds}
              />

              <div className="row" style={{ marginTop: 4 }}>
                <button className="btn" onClick={() => setStep(1)}>
                  Voltar ao Texto
                </button>
                <button
                  className="btn"
                  disabled={!canExportPDF}
                  title={canExportPDF ? "" : "Requer STUDIO ou EXCLUSIVE"}
                >
                  Exportar PDF (gate demo)
                </button>
              </div>
            </div>

            {/* Coluna 3: textos da criação */}
            <div className="flex flex-col gap-5 p-5 rounded-xl bg-white/80 dark:bg-[#0b0f19]/50 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-lg">Textos da criação</h4>
              {selectedIndex == null || !seeds.length ? (
                <p className="text-sm opacity-70">
                  Selecione uma imagem na coluna central para editar título,
                  copy, legenda e hashtags. Estes textos não aparecem na arte,
                  apenas em legendas / planner / exportações.
                </p>
              ) : (
                <>
                  <p className="text-xs opacity-70">
                    Editando metadados da imagem{" "}
                    <strong>#{selectedIndex + 1}</strong>.
                  </p>

                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">Título</label>
                    <input
                      type="text"
                      className="input"
                      value={
                        cardTexts[selectedIndex]?.title ?? text.title ?? ""
                      }
                      onChange={(e) =>
                        handleCardTextFieldChange("title", e.target.value)
                      }
                      placeholder="Seu tema principal"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">Copy (corpo)</label>
                    <textarea
                      rows={4}
                      className="input"
                      value={cardTexts[selectedIndex]?.copy ?? text.copy ?? ""}
                      onChange={(e) =>
                        handleCardTextFieldChange("copy", e.target.value)
                      }
                      placeholder="Mensagem principal para a legenda"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">Legenda</label>
                    <textarea
                      rows={3}
                      className="input"
                      value={
                        cardTexts[selectedIndex]?.caption ??
                        text.caption ??
                        ""
                      }
                      onChange={(e) =>
                        handleCardTextFieldChange("caption", e.target.value)
                      }
                      placeholder="Complemento ou call-to-action"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-medium text-sm">Hashtags</label>
                    <input
                      type="text"
                      className="input"
                      value={
                        cardTexts[selectedIndex]?.hashtags?.join(" ") ??
                        text.hashtags?.join(" ") ??
                        ""
                      }
                      onChange={(e) =>
                        setCardTexts((prev) => {
                          const next = [...prev];
                          const base = next[selectedIndex] || { ...text };
                          next[selectedIndex] = {
                            ...base,
                            hashtags: e.target.value
                              .split(" ")
                              .filter((x) => x.trim().length > 0),
                          };
                          return next;
                        })
                      }
                      placeholder="#branding #socialmedia #growth"
                    />
                  </div>

                  <p className="text-xs opacity-70 mt-2 leading-relaxed">
                    Estes textos <strong>não são desenhados na arte</strong>.
                    Servem para legendas, planner e integrações futuras
                    (Social, Planner, etc.).
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Minhas Criações */}
      <MyCreations />
    </main>
  );
}
