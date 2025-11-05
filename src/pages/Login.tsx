// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");

  // mostra o usuário logado, se existir
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/",
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/" },
    });
    if (error) alert(error.message);
    else alert("Verifique seu e-mail para entrar.");
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      {userEmail ? (
        <div className="card">
          <p className="mb-3">Logado como <strong>{userEmail}</strong></p>
          <button className="btn" onClick={signOut}>Sair</button>
        </div>
      ) : (
        <>
          <button className="btn btn--primary mb-4" onClick={signInGoogle}>
            Entrar com Google
          </button>

          <form className="card" onSubmit={signInMagicLink}>
            <label className="mb-2 block text-sm opacity-80">Entrar por e-mail</label>
            <input
              className="input mb-3"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn" type="submit">Enviar Magic Link</button>
          </form>
        </>
      )}
    </main>
  );
}
