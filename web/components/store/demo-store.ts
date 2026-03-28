"use client";

import { useCallback, useEffect, useState } from "react";

const CART_KEY = "idea-to-deploy-store-cart";
const CART_EVENT = "idea-to-deploy-store-cart-change";

function readCartCount() {
  if (typeof window === "undefined") {
    return 0;
  }

  const raw = window.localStorage.getItem(CART_KEY);
  const count = Number(raw);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

function emitCartChange(next: number) {
  window.localStorage.setItem(CART_KEY, String(next));
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: next }));
}

export function useDemoCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readCartCount());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CART_EVENT, sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CART_EVENT, sync as EventListener);
    };
  }, []);

  const add = useCallback((quantity = 1) => {
    emitCartChange(readCartCount() + Math.max(1, quantity));
  }, []);

  const reset = useCallback(() => {
    emitCartChange(0);
  }, []);

  return { count, add, reset };
}
