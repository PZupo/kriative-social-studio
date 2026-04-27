import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Stepper from "../components/Stepper";
import PresetPicker from "../components/PresetPicker";
import StylePicker from "../components/StylePicker";
import IdeaForm from "../components/IdeaForm";
import MultiImagePlanner from "../components/MultiImagePlanner";
import VisualCanvas from "../components/VisualCanvas";
import ExportPanel from "../components/ExportPanel";
import ImageUpload from "../components/ImageUpload";
import MyCreations from "../components/MyCreations";
import {
  doc,
  updateDoc,
  increment,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "../contexts/AuthContext";
import { Preset, Idea, TextBundle, BatchPlan } from "../lib/types";
import { saveCreation } from "../lib/storage";
import { useFeedback } from "../hooks/useFeedback";
import UserBalance from "../components/UserBalance";
import MyCampaigns from "../components/MyCampaigns";

type Step = 1 | 2;

const EMPTY_TEXT: TextBundle = {
  title: "",
  headline: "",
  body: "",
  copy: "",
  caption: "",
  hashtags: [],
};

function mapVisualStyle(visualStyle: string): string {
  const v = (visualStyle || "").toLowerCase();
  if (v.includes("anime") || v.includes("manga"))         return "anime";
  if (v.includes("disney") || v.includes("3d"))           return "disney";
  if (v.includes("aquarela") || v.includes("watercolor")) return "aquarela";
  if (v.includes("cyberpunk") || v.includes("neon"))      return "cyberpunk";
  if (v.includes("pixel"))                                return "pixel";
  if (v.includes("pop"))                                  return "pop";
  if (v.includes("minimalista") || v.includes("minimal")) return "minimalista";
  if (v.includes("realista") || v.includes("commercial") ||
      v.includes("photography") || v.includes("photo"))   return "realista";
  return "";
}

export default function Editor() {
  const [step, setStep] = useState<Step>(1);
  const { t } = useTranslation();
  const { user, userData } = useAuth();
  const { push } = useFeedback();
  const credits = userData?.credits ?? 0;
  const canExportPDF =
    userData?.billing?.status === "active" ||
    userData?.billing?.status === "trialing";

  // --- CONEXÃO COM O NOVO BACKEND CENTRALIZADO ---
  const social_generateCopy = httpsCallable(functions, 'social_generateCopy');
  const social_generatePrompts = httpsCallable(functions, 'social_generatePrompts');
  const processImageV3 = httpsCallable(functions, 'processstudioimagev3');

  const [preset, setPreset] = useState<Preset>({
    name: "Instagram Post",
    w: 1080,
    h: 1080,
    layout: "classic",
  });
  const [style, setStyle] = useState<string>("disney");
  const [idea, setIdea] = useState<Idea>({
    topic: "",
    audience: "",
    goal: "",
    description: "",
  });
  const [text, setText] = useState<TextBundle>(EMPTY_TEXT);

  const [plan, setPlan] = useState<BatchPlan>({ mode: "carousel", count: 3 });
  const [seedBase, setSeedBase] = useState<number>(Math.floor(Math.random() * 100000));
  const [seeds, setSeeds] = useState<number[]>([]);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [visualPrompts, setVisualPrompts] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showTopBand] = useState<boolean>(true);
  const [projectName, setProjectName] = useState<string>("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [schedulePlatforms, setSchedulePlatforms] = useState<string[]>([]);
  const [scheduleNotes, setScheduleNotes] = useState<string>("");
  const [showCampaigns, setShowCampaigns] = useState(false);  
  const [cardTexts, setCardTexts] = useState<TextBundle[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isGeneratingIA, setIsGeneratingIA] = useState(false);

  const [clientAssets, setClientAssets] = useState<{ logo: string; productImages: string[] }>({
    logo: "",
    productImages: [],
  });

  useEffect(() => {
    sessionStorage.setItem('currentOperationCost', (plan.count * 2).toString());
  }, [plan.count]);

  const runAISuggestion = async () => {
    if (!idea.topic) {
        push({ kind: "warning", message: "Preencha a ideia principal!" });
        return;
    }
    setIsGeneratingIA(true);
    try {
      const result = await social_generateCopy(idea);
      const data = result.data as any;
      setText({
        title: data.title || "",
        headline: data.headline || "",
        body: data.caption || "",
        copy: data.headline || "",
        caption: data.caption || "",
        hashtags: data.hashtags || [],
      });
      push({ kind: "success", message: "Copy gerado pelo Backend Seguro!" });
    } catch (err: any) {
      console.error("Erro IA texto unificada:", err);
      push({ kind: "error", message: "Falha na IA de texto centralizada." });
    } finally {
      setIsGeneratingIA(false);
    }
  };

  const runAIVisualPrompt = async () => {
    if (!idea.topic) {
      push({ kind: "error", message: "Preencha a ideia!" });
      return;
    }
    const count = plan.count;
    if (count < 1 || count > 10) {
      push({ kind: "error", message: "Escolha entre 1 e 10 imagens." });
      return;
    }

    setIsGeneratingIA(true);
    try {
      const payload = { idea, text, style, preset, plan };
      const result = await social_generatePrompts(payload);
      const newPrompts = result.data as string[];
      setVisualPrompts(newPrompts);
      push({ kind: "success", message: `${newPrompts.length} prompts gerados pelo Motor Central!` });
    } catch (err) {
      console.error("Erro IA visual unificada:", err);
      push({ kind: "error", message: "Erro ao gerar prompts no Backend." });
    } finally {
      setIsGeneratingIA(false);
    }
  };

  const fetchClientAssets = async (url: string) => {
    try {
      const cleanUrl = url.includes("http") ? url : `https://${url}`;
      const domain = new URL(cleanUrl).hostname;
      const logoUrl = `https://logo.clearbit.com/${domain}`;
      const response = await fetch(`https://api.microlink.io?url=${cleanUrl}`);
      const result = await response.json();
      const images = result.data?.image ? [result.data.image.url] : [];
      const extraImages = result.data?.screenshot?.url ? [result.data.screenshot.url] : [];
      setClientAssets({
        logo: logoUrl,
        productImages: [...new Set([...images, ...extraImages])],
      });
      if (images.length > 0 && !baseImage) {
        setBaseImage(images[0]);
      }
    } catch (e) {
      console.error("Erro no rastreio de ativos:", e);
    }
  };

  useEffect(() => {
    const processDNA = async () => {
      if (!userData?.uid) return;
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get("name");
      const urlCat = params.get("cat");
      const rawStorage = localStorage.getItem("active_lead_dna");

      let dnaIdea: any = null;
      let websiteToScrape = "";
      let dnaLogo = "";
      let dnaImages: string[] = [];
      let dnaStyle = "";

      try {
        const transRef = doc(db, "users", userData.uid, "transboard", "active_dna");
        const transSnap = await getDoc(transRef);

        if (transSnap.exists()) {
          const data = transSnap.data();
          const isSocialDNA = data.targetApp === "social_studio" || data.targetApp === "social" || !data.targetApp;
          if (isSocialDNA) {
            dnaIdea = {
              topic: data.brand || data.name || data.company || "",
              audience: data.niche || data.category || "Clientes",
              goal: data.tone ? `${data.tone} — Vendas e Conversão` : "Vendas e Conversão",
              description: data.sceneHints || data.productContext || data.address || "",
            };
            dnaLogo = data.logo || "";
            dnaImages = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
            dnaStyle = mapVisualStyle(data.visualStyle || "");
            websiteToScrape = data.website || "";
            await deleteDoc(transRef);
          }
        }
      } catch (e) { console.error("DNA Load Error:", e); }

      if (!dnaIdea && urlName) {
        dnaIdea = { topic: decodeURIComponent(urlName), audience: decodeURIComponent(urlCat || "Clientes"), goal: "Vendas", description: "" };
        window.history.replaceState({}, "", window.location.pathname);
      }

      if (!dnaIdea && rawStorage) {
        try {
          const lead = JSON.parse(rawStorage);
          dnaIdea = {
            topic: lead.brand || lead.name || lead.company || "",
            audience: lead.niche || lead.category || "Clientes",
            goal: "Engajamento",
            description: lead.sceneHints || lead.address || "",
          };
          dnaLogo = lead.logo || "";
          dnaImages = lead.images || [];
          websiteToScrape = lead.website || lead.site || "";
        } catch (e) {}
      }

      if (dnaIdea && dnaIdea.topic) {
        setStep(1);
        setIdea(dnaIdea);
        if (dnaStyle) setStyle(dnaStyle);
        if (dnaLogo || dnaImages.length > 0) {
          setClientAssets({ logo: dnaLogo, productImages: dnaImages });
          if (dnaImages.length > 0 && !baseImage) setBaseImage(dnaImages[0]);
        }
        if (websiteToScrape) fetchClientAssets(websiteToScrape);

        setIsGeneratingIA(true);
        try {
          const result = await social_generateCopy(dnaIdea);
          const data = result.data as any;
          setText({
            title: data.title || "",
            headline: data.headline || "",
            body: data.caption || "",
            copy: data.headline || "",
            caption: data.caption || "",
            hashtags: data.hashtags || [],
          });
          push({ kind: "success", message: "DNA Conectado e Copy Gerado!" });
        } catch (e) {
          push({ kind: "success", message: "DNA Conectado!" });
        } finally {
          setIsGeneratingIA(false);
          localStorage.removeItem("active_lead_dna");
        }
      }
    };
    processDNA();
  }, [userData?.uid]);

  const urlToBase64 = async (url: string): Promise<string> => {
    try {
      const functionUrl = 'https://getimagebase64-kfiywwdpja-uc.a.run.app';
      const fullUrl = `${functionUrl}?url=${encodeURIComponent(url)}`;
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      return data.dataUrl || "";
    } catch (e) {
      console.error("Erro base64:", e);
      return "";
    }
  };

  const handleRegenerateSingle = async (index: number) => {
    if (!user || credits < 2) {
      push({ kind: "warning", message: "Créditos insuficientes (2 por imagem)." });
      return;
    }
    setIsGeneratingIA(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { credits: increment(-2) });
      const newSeed = Math.floor(Math.random() * 100000);
      const newSeeds = [...seeds];
      newSeeds[index] = newSeed;
      setSeeds(newSeeds);

      const payload = {
        prompt: visualPrompts[index],
        dna_style: style,
        image_base: baseImage,
        mode: baseImage ? "fusion" : "generate_base",
        uid: user.uid,
        module: "social_studio"
      };

      await processImageV3(payload);
      push({ kind: "info", message: "Regeneração solicitada ao Backend!" });
    } catch (err: any) {
      push({ kind: "error", message: "Falha ao regenerar imagem." });
    } finally {
      setIsGeneratingIA(false);
    }
  };

  const handleRegeneratePrompt = async (index: number) => {
    setIsGeneratingIA(true);
    try {
      const payload = { idea, text, style, preset, plan: { count: 1 } };
      const result = await social_generatePrompts(payload);
      const generated = (result.data as string[])[0];
      const newPrompts = [...visualPrompts];
      newPrompts[index] = generated;
      setVisualPrompts(newPrompts);
      push({ kind: "success", message: `Prompt da variação #${index + 1} regenerado!` });
    } catch (err) {
      push({ kind: "error", message: "Falha ao regenerar prompt." });
    } finally {
      setIsGeneratingIA(false);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    if (credits < plan.count * 2) {
      push({ kind: "warning", message: "Créditos insuficientes (2 por imagem)." });
      return;
    }
    if (visualPrompts.length !== plan.count) {
      push({ kind: "warning", message: "Gere os prompts individuais primeiro." });
      return;
    }

    setIsGeneratingIA(true);
    setGeneratedImages([]);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { credits: increment(-plan.count * 2) });
      
      const nextSeeds = Array.from({ length: plan.count }, (_, i) => seedBase + i * 101);
      setSeeds(nextSeeds);
      setCardTexts(nextSeeds.map(() => JSON.parse(JSON.stringify(text))));

      for (let i = 0; i < plan.count; i++) {
        const payload = {
            prompt: visualPrompts[i],
            dna_style: style,
            image_base: baseImage,
            mode: baseImage ? "fusion" : "generate_base",
            uid: user.uid,
            module: "social_studio"
        };
        await processImageV3(payload);
      }

      setSelectedIndex(0);
      push({ kind: "success", message: "Solicitação de geração enviada ao Backend!" });
    } catch (err: any) {
      push({ kind: "error", message: "Falha na geração em lote." });
    } finally {
      setIsGeneratingIA(false);
    }
  };

  const handleDeleteVariation = (index: number) => {
    if (window.confirm(`Excluir variação #${index + 1}?`)) {
      setGeneratedImages(prev => prev.filter((_, i) => i !== index));
      setVisualPrompts(prev => prev.filter((_, i) => i !== index));
      setSeeds(prev => prev.filter((_, i) => i !== index));
      setCardTexts(prev => prev.filter((_, i) => i !== index));
      if (selectedIndex === index) setSelectedIndex(seeds.length > 1 ? 0 : null);
    }
  };

  const handleVaryAll = () => {
    const nb = Math.floor(Math.random() * 100000);
    setSeedBase(nb);
    const nextSeeds = Array.from({ length: plan.count }, (_, i) => nb + i * 101);
    setSeeds(nextSeeds);
    setCardTexts(nextSeeds.map(() => JSON.parse(JSON.stringify(text))));
  };

  const saveCard = (idx: number) => {
    const cvs = document.getElementById(`kss-canvas-${idx}`) as HTMLCanvasElement | null;
    if (!cvs) return;
    try {
      const dataURL = cvs.toDataURL("image/jpeg", 0.85);
      saveCreation({
        dataURL,
        meta: {
          preset, style, idea,
          text: cardTexts[idx] || text,
          seed: seeds[idx],
          projectName: projectName || "Projeto Social",
          createdAt: new Date().toISOString(),
        },
      });
      push({ kind: "success", message: "Design salvo na galeria!" });
    } catch (err) {
      push({ kind: "error", message: "Falha ao salvar imagem." });
    }
  };

  const saveFullCampaign = () => {
    if (!projectName.trim()) { push({ kind: "warning", message: "Dê um nome ao projeto." }); return; }
    const campaignData = { projectName, client: idea.topic, images: generatedImages, createdAt: new Date().toISOString() };
    localStorage.setItem(`campaign_${projectName.replace(/\s+/g, '_')}`, JSON.stringify(campaignData));
    push({ kind: "success", message: `Campanha "${projectName}" salva!` });
  };

  const handleSchedule = () => {
    if (!projectName.trim()) { push({ kind: "warning", message: "Dê um nome ao projeto primeiro." }); return; }
    setScheduleModalOpen(true);
  };

  const saveSchedule = () => {
    if (!scheduleDate) { push({ kind: "warning", message: "Selecione data e hora." }); return; }
    push({ kind: "success", message: `Publicação agendada para ${scheduleDate}!` });
    setScheduleModalOpen(false);
  };

  const handleCardTextFieldChange = (field: string, value: string) => {
    if (selectedIndex == null) return;
    setCardTexts(prev => {
      const next = [...prev];
      next[selectedIndex] = { ...(next[selectedIndex] || text), [field]: value };
      return next;
    });
  };

  const safeInputClass = "w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white text-slate-900 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";
  const defaultInputClass = "input w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900";

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto p-4">
      <section className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span className="chip px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase text-purple-600">Briefing & Produção</span>
        <span className="text-xs ml-auto font-bold opacity-70">Créditos: <span className="text-purple-600">{credits}</span></span>
      </section>

      <Stepper step={step} onStep={setStep} />

      {step === 1 && (
        <section className="card p-6 animate-in fade-in duration-500 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 text-purple-400">Briefing & Copywriting</h3>
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-white">Briefing do Cliente</h4>
              <IdeaForm value={idea} onChange={setIdea} />
            </div>
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-white">Copy Gerado pela IA</h4>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase opacity-50">Título do Projeto</label>
                <input className={defaultInputClass} value={text.title} onChange={e => setText({...text, title: e.target.value})} placeholder="Título curto" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase opacity-50">Headline de Impacto</label>
                <textarea className={defaultInputClass} rows={4} value={text.headline} onChange={e => setText({...text, headline: e.target.value})} placeholder="Chamada de impacto" />
              </div>
              <button className="btn btn--soft w-full py-4 font-bold text-purple-500 border border-purple-500/30" onClick={runAISuggestion} disabled={isGeneratingIA}>
                {isGeneratingIA ? "PROCESSANDO..." : "✨ GERAR / REGENERAR COPY (BACKEND)"}
              </button>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase opacity-50">Legenda Completa</label>
                <textarea className={defaultInputClass} rows={3} value={text.caption} onChange={e => setText({...text, caption: e.target.value})} placeholder="Legenda para redes sociais" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-10">
            <button className="btn btn--primary px-12 py-4 text-lg font-bold" onClick={() => setStep(2)}>Próximo: Estúdio Visual</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="grid lg:grid-cols-12 gap-6 items-start animate-in slide-in-from-bottom duration-500">
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-purple-600/30 p-6 shadow-xl">
              <h4 className="text-sm font-black uppercase text-purple-300 mb-4">Ativos DNA</h4>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {clientAssets.logo && <img src={clientAssets.logo} className="w-10 h-10 object-contain bg-white rounded p-1" />}
                {clientAssets.productImages.map((img, i) => <img key={i} src={img} className="w-10 h-10 object-cover rounded cursor-pointer border border-white/10 hover:border-purple-500" onClick={() => setBaseImage(img)} />)}
              </div>
              <ImageUpload value={baseImage} onChange={setBaseImage} />
            </div>
            
            <div className="bg-slate-900 rounded-2xl border border-purple-600/30 p-6 shadow-xl">
              <StylePicker value={style} onChange={setStyle} />
            </div>

            <div className="bg-slate-900 rounded-2xl border border-purple-600/30 p-6 shadow-xl space-y-6">
              <PresetPicker preset={preset} onChange={setPreset} />
              <MultiImagePlanner value={plan} onChange={setPlan} />
            </div>

            <div className="bg-slate-900 rounded-2xl border border-purple-600/30 p-6 shadow-xl space-y-6">
              <label className="block text-sm font-black uppercase text-purple-300">Nome do Projeto</label>
              <input className={safeInputClass} value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Ex: Campanha Verão 2026" />
              <button className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all" onClick={runAIVisualPrompt} disabled={isGeneratingIA}>
                {isGeneratingIA ? "GERANDO..." : `✨ GERAR ${plan.count} PROMPTS (IA)`}
              </button>
            </div>

            <div className="space-y-3">
              <button className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-2xl" onClick={handleGenerate} disabled={isGeneratingIA || visualPrompts.length !== plan.count || !projectName.trim()}>
                🎨 DISPARAR GERAÇÃO IA
              </button>
              <button className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl" onClick={handleVaryAll}>🔀 VARIAR TUDO</button>
            </div>
          </aside>

          <main className="lg:col-span-6 space-y-6">
            {seeds.length === 0 ? (
              <div className="card border-dashed border-4 h-[400px] flex flex-col items-center justify-center opacity-30">
                <p className="text-xl font-bold">ESTÚDIO VISUAL VAZIO</p>
                <p className="text-sm">Gere os prompts para visualizar o estúdio</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {seeds.map((seed, idx) => (
                  <div key={seed} className={`bg-slate-900 rounded-2xl border border-purple-600/20 shadow-xl overflow-hidden cursor-pointer ${selectedIndex === idx ? 'ring-2 ring-purple-500' : ''}`} onClick={() => setSelectedIndex(idx)}>
                    <div className="p-3 flex justify-between items-center bg-slate-800/50">
                      <div className="text-[10px] font-black uppercase text-purple-300">VARIAÇÃO #{idx + 1}</div>
                      <div className="flex gap-2">
                        <button className="py-1 px-2 text-[9px] bg-purple-600 rounded text-white" onClick={(e) => { e.stopPropagation(); handleRegeneratePrompt(idx); }}>PROMPT</button>
                        <button className="py-1 px-2 text-[9px] bg-indigo-600 rounded text-white" onClick={(e) => { e.stopPropagation(); handleRegenerateSingle(idx); }}>IMAGEM</button>
                        <button className="py-1 px-2 text-[9px] bg-emerald-600 rounded text-white" onClick={(e) => { e.stopPropagation(); saveCard(idx); }}>SALVAR</button>
                      </div>
                    </div>
                    <div className="bg-black flex justify-center p-2">
                      <div style={{ width: '100%', maxWidth: '400px' }}>
                        <VisualCanvas
                          id={`kss-canvas-${idx}`}
                          preset={preset}
                          styleKey={style}
                          idea={{...idea, description: visualPrompts[idx] || ''}}
                          text={cardTexts[idx] || text}
                          seed={seed}
                          baseImage={baseImage}
                          generatedImage={generatedImages[idx] || null}
                          showTopBand={showTopBand}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800/30">
                      <textarea className="w-full h-20 text-[10px] bg-transparent border-none focus:ring-0 text-slate-300" value={visualPrompts[idx] || ''} readOnly />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {seeds.length > 0 && <button className="btn !bg-emerald-600 !text-white w-full py-4 font-bold" onClick={saveFullCampaign}>💾 SALVAR CAMPANHA COMPLETA</button>}
          </main>

          <aside className="lg:col-span-3">
            <div className="sticky top-4 space-y-4">
              <div className="card p-5 bg-slate-900 border-t-4 border-purple-500 shadow-xl">
                <h4 className="font-black text-xs uppercase mb-4 tracking-wider">Refinar Design</h4>
                {selectedIndex !== null && seeds.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase opacity-50">Título do Card</label>
                      <input type="text" className={safeInputClass} value={cardTexts[selectedIndex]?.title ?? ""} onChange={(e) => handleCardTextFieldChange("title", e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-black uppercase opacity-50">Headline</label>
                      <textarea rows={4} className={safeInputClass} value={cardTexts[selectedIndex]?.headline ?? ""} onChange={(e) => handleCardTextFieldChange("headline", e.target.value)} />
                    </div>
                  </div>
                ) : <p className="text-center py-10 opacity-40 text-sm italic">Selecione um card para editar</p>}
              </div>
              <button className="btn w-full" onClick={() => setStep(1)}>Voltar ao Briefing</button>
            </div>
          </aside>
        </section>
      )}

      {scheduleModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 p-8 rounded-2xl border border-purple-500/30 shadow-2xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-6">Agendar Publicação</h3>
            <input type="datetime-local" className={safeInputClass} value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            <div className="flex gap-4 mt-8">
              <button className="flex-1 btn btn--soft" onClick={() => setScheduleModalOpen(false)}>Cancelar</button>
              <button className="flex-1 btn btn--primary" onClick={saveSchedule}>Agendar</button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 pt-8 border-t border-slate-800">
        <MyCreations />
        <div className="mt-6 text-center">
          <button className="btn btn--primary px-8 py-3" onClick={() => setShowCampaigns(true)}>Minhas Campanhas Salvas</button>
        </div>
      </footer>
    </div>
  );
}