import { supabase } from "@/lib/supabase";

/**
 * Retorna o tier do usuário para um app:
 * 'PRO' | 'STUDIO' | 'EXCLUSIVE' | null
 */
export async function getUserTierFor(
  appCode: "social" | "creator" | "ebook_pages" | "lead_capture" | "manga"
) {
  // precisa estar autenticado
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return null;

  const { data, error } = await supabase.rpc("get_entitlements", { app_code: appCode });

  if (error) {
    console.warn("get_entitlements error:", error);
    return null;
  }

  // data esperado: [{ tier: 'PRO' | 'STUDIO' | 'EXCLUSIVE' }]
  const row = Array.isArray(data) ? data[0] : null;
  const tier = (row?.tier ?? null) as "PRO" | "STUDIO" | "EXCLUSIVE" | null;

  return tier;
}
