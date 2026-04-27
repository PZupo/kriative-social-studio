import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/i18n'; 
import UserBalance from './UserBalance'; 
import { getAuth, signOut } from "firebase/auth";
import { 
  Moon, 
  Sun, 
  Globe, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft, 
  Check, 
  LogOut 
} from 'lucide-react';

interface UniversalHeaderProps {
  appName?: string;
  appDescription?: string;
  logoSrc?: string;
  themeColor?: 'emerald' | 'purple' | 'blue' | 'orange';
}

export default function UniversalHeader({
  appName = "Kriative Social Studio",
  appDescription = "Gestão de Mídia & IA",
  logoSrc = "/social-studio-header.png", 
  themeColor = 'purple'
}: UniversalHeaderProps) {
  
  const { userData, loading } = useAuth();
  const { lang, setLang } = useI18n();
  const location = useLocation();

  const user = userData as any || {};
  
  // --- 1. LÓGICA DE STATUS BLINDADA ---
  // Créditos > 0 garante que quem tem saldo (seja antigo ou novo) fique ATIVO.
  const credits = user?.credits || 0;
  const legacyStatus = user?.billing?.status === 'active' || user?.billing?.status === 'trialing';
  const newStatus = user?.subscriptionStatus === 'active';
  
  const isActive = credits > 0 || legacyStatus || newStatus;

  // --- 2. LÓGICA DE NOME DO PLANO (CORRIGIDA) ---
  const rawPlan = (user?.tier || user?.billing?.plan || 'Free').toUpperCase();
  const userApps = user?.activeApps || [];

  // É Multi Pack se: Tiver a chave 'multi-pack' na lista OU o nome do plano disser MULTI/BUNDLE
  const isRealMulti = rawPlan.includes('MULTI') || rawPlan.includes('BUNDLE') || userApps.includes('multi-pack');

  // --- 3. TRADUÇÕES COMPLETAS ---
  const headerTranslations: Record<string, Record<string, string>> = {
    'pt-BR': {
      credits_generation: 'Créditos de Geração',
      status_active: 'ATIVO',
      status_inactive: 'INATIVO',
      upgrade_btn: 'Gerenciar Plano',
      free_plan: 'GRATUITO',
      plan_individual: 'INDIVIDUAL',
      plan_multi: 'MULTI',
      plan_enterprise: 'ENTERPRISE',
      logout_btn: 'SAIR / LOGOUT',
      user_label: 'Criador',
      back_dashboard: 'Voltar ao HUB',
      lang_selector_label: 'IDIOMA',
      welcome_question: 'O que vamos criar hoje?',
      app_title: 'SOCIAL STUDIO',
      app_desc: 'GESTÃO DE MÍDIA & IA'
    },
    'en-US': {
      credits_generation: 'Generation Credits',
      status_active: 'ACTIVE',
      status_inactive: 'INACTIVE',
      upgrade_btn: 'Manage Plan',
      free_plan: 'FREE',
      plan_individual: 'INDIVIDUAL',
      plan_multi: 'MULTI',
      plan_enterprise: 'ENTERPRISE',
      logout_btn: 'LOGOUT',
      user_label: 'Creator',
      back_dashboard: 'Back to HUB',
      lang_selector_label: 'LANGUAGE',
      welcome_question: 'What will we create today?',
      app_title: 'SOCIAL STUDIO',
      app_desc: 'MEDIA MANAGEMENT & AI'
    },
    'es': {
      credits_generation: 'Créditos de Generación',
      status_active: 'ACTIVO',
      status_inactive: 'INACTIVO',
      upgrade_btn: 'Gestionar Plan',
      free_plan: 'GRATUITO',
      plan_individual: 'INDIVIDUAL',
      plan_multi: 'MULTI',
      plan_enterprise: 'EMPRESARIAL',
      logout_btn: 'CERRAR SESIÓN',
      user_label: 'Creador',
      back_dashboard: 'Volver al HUB',
      lang_selector_label: 'IDIOMA',
      welcome_question: '¿Qué crearemos hoy?',
      app_title: 'SOCIAL STUDIO',
      app_desc: 'GESTIÓN DE MEDIOS E IA'
    },
    'it': {
      credits_generation: 'Crediti Generazione',
      status_active: 'ATTIVO',
      status_inactive: 'INATTIVO',
      upgrade_btn: 'Gestisci Piano',
      free_plan: 'GRATUITO',
      plan_individual: 'INDIVIDUALE',
      plan_multi: 'MULTI',
      plan_enterprise: 'ENTERPRISE',
      logout_btn: 'ESCI',
      user_label: 'Creatore',
      back_dashboard: 'Torna all\'HUB',
      lang_selector_label: 'LINGUA',
      welcome_question: 'Cosa creiamo oggi?',
      app_title: 'SOCIAL STUDIO',
      app_desc: 'GESTIONE MEDIA E IA'
    }
    // (Outros idiomas usam fallback para EN se não definidos aqui, mas aparecem na lista abaixo)
  };

  const tHeader = (key: string) => {
    const langKey = lang as string;
    const dict = headerTranslations[langKey] || headerTranslations['en-US'] || {};
    return dict[key] || key;
  };

  // Definição do Nome do Plano na Tela
  let planName = tHeader('free_plan');
  if (isActive) {
    if (rawPlan.includes('ENTERPRISE')) {
        planName = tHeader('plan_enterprise');
    } else if (isRealMulti) {
        planName = tHeader('plan_multi');
    } else {
        // Se for STUDIO/PRO Individual, mostra INDIVIDUAL
        planName = tHeader('plan_individual');
    }
  }

 const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Limpa tudo e manda para o login do Satélite ou a Home do HUB
      window.localStorage.clear();
      window.location.href = "/login"; 
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const currentCost = parseInt(sessionStorage.getItem('currentOperationCost') || '0', 10);
  // --- TOGGLE DE TEMA ---
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && sysDark)) { 
        document.documentElement.classList.add("dark"); 
        setIsDark(true); 
    } else { 
        document.documentElement.classList.remove("dark"); 
        setIsDark(false); 
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
  };

  // --- MENU DE IDIOMAS (Todos Restaurados) ---
  const [langOpen, setLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: 'pt-BR', label: 'PORTUGUÊS' },
    { code: 'en-US', label: 'ENGLISH' },
    { code: 'es', label: 'ESPAÑOL' },
    { code: 'it', label: 'ITALIANO' },
    { code: 'de', label: 'DEUTSCH' },
    { code: 'fr', label: 'FRANÇAIS' },
    { code: 'ko', label: 'KOREAN' }
  ];
  const currentLabel = languages.find(l => l.code === lang)?.label || tHeader('lang_selector_label');

  // Dados do Usuário
  const displayName = user?.displayName || 'Criador';
  const displayEmail = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  // Cores
  const theme = { 
    text: 'text-purple-400', 
    badge: 'bg-purple-950 text-purple-400 border-purple-900', 
    border: 'border-purple-500/30', 
    from: 'from-purple-600', 
    to: 'to-purple-900' 
  };
  const statusBadge = isActive ? theme.badge : 'bg-red-100 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900';

  if (loading) return null;

  return (
    <section className="w-full mb-6 font-sans transition-colors duration-300">
        <div className="flex flex-col xl:flex-row items-stretch gap-4 xl:gap-6 w-full min-h-[220px]">
          
          {/* LOGO */}
          <div className={`w-full xl:w-[280px] shrink-0 rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.from} ${theme.to} flex flex-col justify-center relative overflow-hidden shadow-2xl p-6`}>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-20"></div>
              <div className="relative z-10 flex flex-col h-full items-center justify-center text-center w-full">
                <div className="mb-4 w-full flex items-center justify-center">
                   <img src={logoSrc} alt={appName} className="w-full h-auto max-h-24 object-contain drop-shadow-lg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <h2 className="text-lg font-black text-white leading-tight tracking-tight uppercase">{tHeader('app_title')}</h2>
                <p className="text-[10px] text-white/80 mt-2 font-medium border-t border-white/20 pt-2 w-full uppercase tracking-wider">{tHeader('app_desc')}</p>
              </div>
          </div>

          {/* INFO */}
          <div className="flex-1 min-w-0 bg-white dark:bg-[#0B0F19] rounded-2xl p-3 flex flex-col justify-between relative shadow-xl transition-colors duration-300 border border-gray-200 dark:border-white/5">
            <div className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">Olá, {displayName.split(' ')[0]}</span>
                    <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-white leading-none tracking-tight">{tHeader('welcome_question')}</h3>
                </div>
                <div className="flex items-center gap-3">
                   {/* MENU IDIOMAS */}
                   <div className="relative w-36" ref={langMenuRef}>
                        <button onClick={() => setLangOpen(!langOpen)} className="flex items-center justify-between w-full h-9 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-lg text-[10px] font-bold text-slate-700 dark:text-white uppercase hover:border-purple-500 transition-colors">
                            <div className="flex items-center gap-2"><Globe size={14} className="text-slate-400"/><span>{currentLabel}</span></div>
                            <ChevronDown size={12} className={`text-slate-400 transition-transform ${langOpen ? 'rotate-180' : ''}`}/>
                        </button>
                        {langOpen && (
                            <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                                {languages.map((l) => (
                                    <button key={l.code} onClick={() => { setLang(l.code as any); setLangOpen(false); }} className="w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-500/20 hover:text-purple-700 dark:hover:text-purple-300 text-left transition-colors">
                                        {l.label} {lang === l.code && <Check size={12} className="text-purple-500" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                   <div className="w-[1px] h-4 bg-gray-300 dark:bg-white/10"></div>
                   {/* TOGGLE TEMA */}
                   <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white transition-all shadow-sm hover:shadow-md">
                        {isDark ? <Moon size={16} /> : <Sun size={16} />}
                   </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <UserBalance balance={credits} label={tHeader('credits_generation')} themeColor={theme.text} operationCost={currentCost} />
              <div className="bg-gray-50 dark:bg-[#050608] rounded-xl p-4 border border-gray-200 dark:border-white/5 flex flex-col justify-center items-end text-right transition-colors">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">PLANO VIGENTE</span>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wide border flex items-center gap-1 ${statusBadge}`}>
                        {isActive ? tHeader('status_active') : tHeader('status_inactive')}
                    </span>
                </div>
                <span className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1">{planName}</span>
                <a href='https://afiliattuz.mydigitaldropp.com/billing' className={`text-[9px] ${theme.text} hover:opacity-80 transition-opacity cursor-pointer font-bold uppercase tracking-wider flex items-center gap-1 hover:underline`}>
                    {tHeader('upgrade_btn')} <ChevronRight size={10} className="inline-block" />
                </a>
              </div>
            </div>
          </div>

          {/* PERFIL */}
          <div className="w-full xl:w-[280px] shrink-0 bg-white dark:bg-[#0B0F19] rounded-2xl p-3 flex flex-col justify-between shadow-xl transition-colors duration-300 border border-gray-200 dark:border-white/5">
            <div>
                 <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="text-base md:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{tHeader('quick_access')}</h2>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#0B0F19] p-3 rounded-xl border border-gray-200 dark:border-white/5 mb-3 transition-colors">
                  <div className={`w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br ${theme.from} ${theme.to} flex items-center justify-center text-sm font-black text-white border border-white/10 shadow-inner`}>{initial}</div>
                  <div className="overflow-hidden min-w-0 flex flex-col justify-center">
                    <span className="text-[8px] uppercase text-slate-500 font-bold leading-none mb-1">{tHeader('user_label')}</span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-none mb-0.5">{displayName}</p>
                    <p className="text-[9px] text-slate-500 truncate">{displayEmail}</p>
                  </div>
                </div>
            </div>
            
            <div className="mt-auto flex flex-col gap-2">
                <a href='https://afiliattuz.mydigitaldropp.com/dashboard' className="w-full inline-flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold uppercase px-4 py-3.5 transition-all border border-gray-200 dark:border-white/10 shadow-lg group">
                    <ArrowLeft size={14} className="mr-2 text-slate-400 group-hover:text-purple-500 transition-colors" />
                    {tHeader('back_dashboard')}
                </a>
                <button onClick={handleLogout} className="w-full inline-flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase px-4 py-2.5 transition-all border border-red-200 dark:border-red-500/20">
                    <LogOut size={14} className="mr-2" />
                    {tHeader('logout_btn')}
                </button>
            </div>
          </div>
        </div>
    </section>
  );
}