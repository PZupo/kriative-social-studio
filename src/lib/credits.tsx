// src/lib/credits.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type CreditsContextValue = {
  credits: number;
  consume: (qty: number) => boolean;
  setCredits: (qty: number) => void;
};

const CreditsContext = createContext<CreditsContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "ks_credits_social";

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCreditsState] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? parseInt(raw, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  function setCredits(qty: number) {
    setCreditsState(qty);
    try {
      localStorage.setItem(STORAGE_KEY, String(qty));
    } catch {
      // ignora erro de storage
    }
  }

  function consume(qty: number): boolean {
    if (credits < qty) return false;
    setCredits(credits - qty);
    return true;
  }

  const value: CreditsContextValue = {
    credits,
    consume,
    setCredits,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits(): CreditsContextValue {
  const ctx = useContext(CreditsContext);
  if (!ctx) {
    throw new Error("useCredits must be used inside <CreditsProvider>");
  }
  return ctx;
}
