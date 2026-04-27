import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; 

// Componentes
import UniversalHeader from "./components/UniversalHeader";
import SocialToolbar from "./components/SocialToolbar";
import FeedbackBox from "./components/FeedbackBox";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Firebase Imports (Unificados e Corrigidos)
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  signInWithCustomToken,
  sendPasswordResetEmail,
  onAuthStateChanged 
} from "firebase/auth";
import { Lock, Star, Mail, Key, LogIn, AlertCircle, ShieldAlert } from "lucide-react";

const HUB_URL = "https://afiliattuz.mydigitaldropp.com";

// --- Lazy Loading ---
const lazyRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      window.location.reload();
      return { default: () => null };
    }
  });

const Dashboard = lazyRetry(() => import("./pages/Dashboard"));
const Editor = lazyRetry(() => import("./pages/Editor"));
const Library = lazyRetry(() => import("./pages/Library"));

// ============================================================================
// 1. PROCESSADOR DE SSO (A Quarentena)
// ============================================================================
function SSOLoginProcessor() {
  const [searchParams] = useSearchParams();
  const ssoToken = searchParams.get('sso');
  const [status, setStatus] = useState("Conectando...");

  useEffect(() => {
    if (!ssoToken) return;

    const executeSSO = async () => {
      const auth = getAuth();
      try {
        console.log("🔒 SSO: Iniciando protocolo de troca...");
        
        window.localStorage.clear();
        await signOut(auth);

        setStatus("Validando credencial...");
        await signInWithCustomToken(auth, ssoToken);
        
        console.log("✅ SSO: Sucesso! Sincronizando sessão...");
        setStatus("Sincronizando...");

        // Aguarda o Firebase confirmar que a sessão foi gravada no navegador
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            unsubscribe();
            window.location.replace("/"); 
          }
        });

      } catch (error) {
        console.error("❌ Erro SSO:", error);
        window.location.replace("/login");
      }
    };

    executeSSO();
  }, [ssoToken]);

  return (
    <div className="min-h-screen bg-[#020305] flex flex-col items-center justify-center font-sans text-white fixed inset-0 z-[9999]">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-purple-400 text-xs font-bold uppercase tracking-wider">{status}</p>
    </div>
  );
}

// ============================================================================
// 2. TELA DE LOGIN MANUAL
// ============================================================================
function LoginPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Verifique e-mail e senha.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Digite seu e-mail para recuperar a senha.");
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError("");
    } catch (err) {
      setError("Erro ao enviar e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Erro Google:", err);
      setError("Login cancelado.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#020305] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-[#0B0F19] p-8 rounded-3xl shadow-2xl border border-white/5 w-full max-w-md relative z-10 backdrop-blur-xl">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Acesso Restrito</h1>
            <p className="text-slate-400 text-sm">Entre para acessar o <strong>Social Studio</strong></p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-xs font-bold animate-pulse">
                    <AlertCircle size={14} />{error}
                </div>
            )}
            {resetSent && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-xs font-bold">
                    E-mail de recuperação enviado!
                </div>
            )}
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="email" placeholder="Seu e-mail de acesso" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" required />
            </div>
            <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" placeholder="Sua senha secreta" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" required={!resetSent} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-white text-slate-900 font-black text-sm uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
                {loading ? 'Validando...' : <><LogIn size={18} /> Entrar Agora</>}
            </button>
            <button type="button" onClick={handleForgotPassword} className="w-full text-center text-slate-500 text-[10px] uppercase font-bold hover:text-purple-400 transition-all mt-2">
                Esqueceu sua senha?
            </button>
        </form>

        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0B0F19] px-2 text-slate-500 font-bold">Ou acesse com</span></div>
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 mb-6">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" /> Google Account
        </button>

        <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs mb-3">Ainda não tem uma licença ativa?</p>
            <a href={HUB_URL} className="block w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2">
                <Star size={14} /> Quero Comprar Acesso
            </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. TELA DE ACESSO NEGADO
// ============================================================================
function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#020305] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <ShieldAlert className="text-red-500 w-10 h-10" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">Acesso Negado</h1>
      <p className="text-slate-400 max-w-sm mb-8">
        Sua conta não possui uma licença ativa para o <strong>Social Studio</strong> ou seu plano expirou.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <a href={HUB_URL + "/billing"} className="py-4 rounded-xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
          Ver Planos no Hub
        </a>
        <button onClick={() => window.location.replace("/login")} className="text-slate-500 text-xs font-bold uppercase hover:text-white transition-all">
          Tentar outro login
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 4. LAYOUT PROTEGIDO E DISPATCHER
// ============================================================================
function ProtectedLayout() {
    return (
        <div className="min-h-dvh flex flex-col font-sans transition-colors duration-300 bg-[#020305]">
            <main className="flex-1 w-full flex flex-col">
                <div className="w-full max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col gap-6 mb-8">
                        <UniversalHeader themeColor="purple" />
                        <SocialToolbar />
                    </div>
                    <Suspense fallback={<div className="text-center py-20 text-slate-500 animate-pulse uppercase text-xs font-bold tracking-widest">Carregando ferramenta...</div>}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/editor" replace />} />
                            <Route path="/editor" element={<Editor />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </div>
            </main>
            <footer className="py-8 text-center opacity-40 text-[10px] tracking-widest uppercase text-white">AFILIATTUZ • Kriative Social Studio © 2026</footer>
            <FeedbackBox />
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' }}} />
        </div>
    );
}

function RootDispatcher() {
  const [searchParams] = useSearchParams();
  if (searchParams.get('sso')) return <SSOLoginProcessor />;
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/*" element={
          <RequireAuth>
              <ProtectedLayout />
          </RequireAuth>
      } />
    </Routes>
  );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <RootDispatcher />
            </AuthProvider>
        </BrowserRouter>
    );
}