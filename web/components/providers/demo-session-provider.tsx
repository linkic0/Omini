"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { DemoSession } from "@/lib/types";

const STORAGE_KEY = "idea-to-deploy-demo";

const initialSession: DemoSession = {
  idea: "手工编织的水晶手链，主打能量疗愈与焦虑缓解",
  market: "us",
  cartCount: 0,
};

type DemoSessionContextValue = {
  hydrated: boolean;
  session: DemoSession;
  mergeSession: (next: Partial<DemoSession>) => void;
  resetSession: () => void;
};

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession>(initialSession);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setSession({ ...initialSession, ...(JSON.parse(stored) as DemoSession) });
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [hydrated, session]);

  const mergeSession = useCallback((next: Partial<DemoSession>) => {
    setSession((prev) => ({ ...prev, ...next }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(initialSession);
  }, []);

  const value = useMemo(
    () => ({ hydrated, session, mergeSession, resetSession }),
    [hydrated, mergeSession, resetSession, session],
  );

  return (
    <DemoSessionContext.Provider value={value}>
      {children}
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession() {
  const value = useContext(DemoSessionContext);

  if (!value) {
    throw new Error("useDemoSession 必须在 DemoSessionProvider 内使用");
  }

  return value;
}
