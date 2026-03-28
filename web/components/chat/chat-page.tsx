"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bot, Globe, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { useDemoSession } from "@/components/providers/demo-session-provider";
import {
  createChatFallback,
  createLandingFallback,
  createPositioningFallback,
  createWorkspaceFallback,
  getAudienceOptions,
  getHookOptions,
} from "@/lib/fallback-data";
import type {
  ApiEnvelope,
  LandingData,
  MarketId,
  PositioningCard,
  WorkspaceData,
} from "@/lib/types";

type Message = {
  type: "ai" | "user";
  content: ReactNode;
};

const MARKETS: Array<{ id: MarketId; label: string; flag: string }> = [
  { id: "us", label: "北美", flag: "🇺🇸" },
  { id: "jp", label: "日本", flag: "🇯🇵" },
  { id: "eu", label: "欧洲", flag: "🇪🇺" },
  { id: "sea", label: "东南亚", flag: "🇸🇬" },
];

const SUBREDDITS = ["r/crystals", "r/witchcraft", "r/yoga", "r/anxietyhelp"];
const DEFAULT_MARKET: MarketId = "us";
const DEFAULT_PRODUCT_TITLE = "Crystal Flow | 手工能量水晶手链";
const DEFAULT_PRODUCT_SUBTITLE = "每一条手链都是独一无二的能量伙伴";

export function ChatPage({ initialIdea }: { initialIdea?: string }) {
  const router = useRouter();
  const { hydrated, mergeSession, session } = useDemoSession();
  const idea = initialIdea || session.idea || "手工编织的水晶手链";
  const isFreshConversation = Boolean(initialIdea?.trim());
  const marketLock = useRef(false);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanTimeoutRef = useRef<number | null>(null);
  const freshConversationRef = useRef<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState(session.positioning ? 3 : 0);
  const [selectedMarket, setSelectedMarket] = useState<MarketId>(session.market ?? DEFAULT_MARKET);
  const [showLoading, setShowLoading] = useState(false);
  const [currentSubreddit, setCurrentSubreddit] = useState(0);
  const [showPositionCard, setShowPositionCard] = useState(Boolean(session.positioning));
  const [selectedHook, setSelectedHook] = useState(
    session.positioning?.selectedHook ?? getHookOptions(session.market ?? DEFAULT_MARKET)[0]?.id ?? "",
  );
  const [customHookInput, setCustomHookInput] = useState(
    session.positioning?.selectedHook === "custom" ? session.positioning.oneLiner : "",
  );
  const [isEditingPosition, setIsEditingPosition] = useState(false);
  const [productTitle, setProductTitle] = useState(session.positioning?.productTitle ?? DEFAULT_PRODUCT_TITLE);
  const [productSubtitle, setProductSubtitle] = useState(
    session.positioning?.productSubtitle ?? DEFAULT_PRODUCT_SUBTITLE,
  );
  const [positioning, setPositioning] = useState<PositioningCard | null>(
    session.positioning ?? null,
  );
  const [busy, setBusy] = useState(false);

  const hooks = useMemo(() => getHookOptions(selectedMarket), [selectedMarket]);
  const renderedHooks = useMemo(() => {
    const nextCustomHook = customHookInput.trim();

    if (!nextCustomHook) {
      return hooks;
    }

    return [
      ...hooks,
      {
        id: "custom",
        title: nextCustomHook,
        subtitle: "你自定义的一句话卖点",
        heat: 89,
      },
    ];
  }, [customHookInput, hooks]);
  const audience = useMemo(() => {
    const options = getAudienceOptions(selectedMarket);
    return (
      options.find((item) => item.id === session.audienceId) ??
      options[0]
    );
  }, [selectedMarket, session.audienceId]);

  const clearScanTimers = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (scanTimeoutRef.current) {
      window.clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
  }, []);

  const resetConversationState = useCallback((market: MarketId) => {
    clearScanTimers();
    marketLock.current = false;
    setMessages([]);
    setStage(0);
    setSelectedMarket(market);
    setShowLoading(false);
    setCurrentSubreddit(0);
    setShowPositionCard(false);
    setSelectedHook(getHookOptions(market)[0]?.id ?? "");
    setCustomHookInput("");
    setIsEditingPosition(false);
    setProductTitle(DEFAULT_PRODUCT_TITLE);
    setProductSubtitle(DEFAULT_PRODUCT_SUBTITLE);
    setPositioning(null);
    setBusy(false);
  }, [clearScanTimers]);

  async function postJSON<T>(
    url: string,
    body: Record<string, unknown>,
  ): Promise<ApiEnvelope<T>> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`${url} failed`);
    }

    return (await response.json()) as ApiEnvelope<T>;
  }

  async function hydrateDownstream(nextPositioning: PositioningCard) {
    try {
      const [workspaceResult, landingResult] = await Promise.all([
        postJSON<WorkspaceData>("/api/workspace", {
          idea,
          market: selectedMarket,
        }),
        postJSON<LandingData>("/api/landing", {
          idea,
          market: selectedMarket,
        }),
      ]);

      mergeSession({
        idea,
        market: selectedMarket,
        audienceId: audience.id,
        hookId: nextPositioning.selectedHook,
        positioning: nextPositioning,
        workspace: workspaceResult.data,
        landing: landingResult.data,
        source:
          workspaceResult.source === "gmi" || landingResult.source === "gmi"
            ? "gmi"
            : "fallback",
      });
    } catch {
      mergeSession({
        idea,
        market: selectedMarket,
        audienceId: audience.id,
        hookId: nextPositioning.selectedHook,
        positioning: nextPositioning,
        workspace: createWorkspaceFallback({ idea, market: selectedMarket }),
        landing: createLandingFallback({ idea, market: selectedMarket }),
        source: "fallback",
      });
    }
  }

  useEffect(() => {
    if (!hydrated || !isFreshConversation) {
      return;
    }

    const normalizedIdea = initialIdea?.trim() ?? "";
    if (!normalizedIdea || freshConversationRef.current === normalizedIdea) {
      return;
    }

    freshConversationRef.current = normalizedIdea;
    resetConversationState(DEFAULT_MARKET);
    mergeSession({
      idea: normalizedIdea,
      market: DEFAULT_MARKET,
      audienceId: undefined,
      hookId: undefined,
      positioning: undefined,
      workspace: undefined,
      landing: undefined,
      source: undefined,
    });
  }, [hydrated, initialIdea, isFreshConversation, mergeSession, resetConversationState]);

  useEffect(() => {
    if (!hydrated || isFreshConversation || !session.positioning) {
      return;
    }

    const restoredMarket = session.market ?? DEFAULT_MARKET;
    setSelectedMarket(restoredMarket);
    setSelectedHook(session.positioning.selectedHook);
    setProductTitle(session.positioning.productTitle);
    setProductSubtitle(session.positioning.productSubtitle);
    setPositioning(session.positioning);
    setCustomHookInput(session.positioning.selectedHook === "custom" ? session.positioning.oneLiner : "");
    setShowLoading(false);
    setShowPositionCard(true);
    setStage(3);
  }, [hydrated, isFreshConversation, session.market, session.positioning]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    mergeSession({ idea, market: selectedMarket });
  }, [hydrated, idea, mergeSession, selectedMarket]);

  useEffect(() => {
    if (!hydrated || session.positioning || stage !== 0 || messages.length > 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMessages([
        {
          type: "ai",
          content: "你好！我是你的出海选品助手。告诉我，你想卖什么产品？它有什么特别之处？",
        },
      ]);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [hydrated, messages.length, session.positioning, stage]);

  useEffect(() => {
    if (!hydrated || session.positioning || stage !== 0 || messages.length !== 1) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMessages((prev) => [...prev, { type: "user", content: idea }]);
      setStage(1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [hydrated, idea, messages.length, session.positioning, stage]);

  useEffect(() => {
    if (!hydrated || session.positioning || stage !== 1) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const assistant = createChatFallback({
        idea,
        stage: "market",
        market: selectedMarket,
      }).assistant;

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: (
            <div>
              <p className="mb-6">{assistant}</p>
              <div className="grid grid-cols-2 gap-4">
                {MARKETS.map((market) => (
                  <motion.button
                    key={market.id}
                    type="button"
                    onClick={() => {
                      if (marketLock.current) {
                        return;
                      }

                      marketLock.current = true;
                      setSelectedMarket(market.id);
                      mergeSession({ idea, market: market.id });
                      window.setTimeout(() => {
                        setMessages((current) => [
                          ...current,
                          { type: "user", content: market.label },
                        ]);
                        setStage(2);
                      }, 500);
                    }}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                      selectedMarket === market.id
                        ? "border-[#00d4ff] bg-[#00d4ff]/10"
                        : "border-[#3a3a3a] bg-[#2a2a2a] hover:border-[#4a4a4a]"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedMarket === market.id ? (
                      <motion.div
                        layoutId="market-indicator"
                        className="absolute bottom-0 left-0 top-0 w-1 rounded-l-xl bg-[#00d4ff]"
                      />
                    ) : null}
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{market.flag}</span>
                      <span className="text-lg font-medium">{market.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ),
        },
      ]);
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [hydrated, idea, mergeSession, selectedMarket, session.positioning, stage]);

  useEffect(() => {
    if (!hydrated || session.positioning || stage !== 2) {
      return;
    }

    const loadingDelay = window.setTimeout(() => {
      setShowLoading(true);
      scanIntervalRef.current = setInterval(() => {
        setCurrentSubreddit((prev) => (prev + 1) % SUBREDDITS.length);
      }, 400);

      scanTimeoutRef.current = window.setTimeout(() => {
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
          scanIntervalRef.current = null;
        }

        const fallbackCard = createPositioningFallback({
          idea,
          market: selectedMarket,
        });

        setSelectedHook(fallbackCard.selectedHook);
        setProductTitle(fallbackCard.productTitle);
        setProductSubtitle(fallbackCard.productSubtitle);
        setPositioning(fallbackCard);
        setShowLoading(false);
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            type: "ai",
            content: (
              <div>
                <div className="mb-4 text-sm text-[#00d4ff]">
                  发现！美国Z世代对 &ldquo;self-care&rdquo; 和 &ldquo;spirituality&rdquo; 讨论热度+300%
                </div>
                <p className="mb-2">
                  基于美国市场洞察，你的手链主打哪个卖点？选一个或自定义：
                </p>
              </div>
            ),
          },
        ]);
        window.setTimeout(() => {
          setShowPositionCard(true);
        }, 500);
      }, 3000);
    }, 800);

    return () => {
      window.clearTimeout(loadingDelay);
      clearScanTimers();
    };
  }, [clearScanTimers, hydrated, idea, selectedMarket, session.positioning, stage]);

  const hookLabel = (hookId: string) => {
    if (hookId.includes("wear") || hookId === "a") return "Intent";
    if (hookId.includes("anxiety") || hookId === "b") return "Relief";
    if (hookId.includes("ritual") || hookId === "c") return "Ritual";
    return "Hook";
  };

  async function finalizeSelection() {
    const nextCustomHook = customHookInput.trim();
    const nextSelectedHook = nextCustomHook ? "custom" : selectedHook;
    const fallback = createPositioningFallback({
      idea,
      market: selectedMarket,
      audienceId: audience.id,
      hookId: nextSelectedHook,
    });

    const base = {
      ...fallback,
      selectedHook: nextSelectedHook,
      productTitle,
      productSubtitle,
      oneLiner: nextCustomHook || fallback.oneLiner,
      hooks: nextCustomHook
        ? [
            ...fallback.hooks.filter((item) => item.id !== "custom"),
            {
              id: "custom",
              title: nextCustomHook,
              subtitle: "你自定义的一句话卖点",
              heat: 89,
            },
          ]
        : fallback.hooks,
    };

    setBusy(true);

    try {
      const result = await postJSON<PositioningCard>("/api/positioning", {
        idea,
        market: selectedMarket,
        audienceId: audience.id,
        hookId: nextSelectedHook,
      });

      const nextPositioning = {
        ...result.data,
        productTitle,
        productSubtitle,
        selectedHook: nextSelectedHook,
        oneLiner: nextCustomHook || result.data.oneLiner,
        hooks: nextCustomHook
          ? [
              ...result.data.hooks.filter((item) => item.id !== "custom"),
              {
                id: "custom",
                title: nextCustomHook,
                subtitle: "你自定义的一句话卖点",
                heat: 89,
              },
            ]
          : result.data.hooks,
      };

      setPositioning(nextPositioning);
      await hydrateDownstream(nextPositioning);
      router.push("/workspace");
    } catch {
      setPositioning(base);
      await hydrateDownstream(base);
      router.push("/workspace");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a1a] text-white">
      <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg p-2 transition-colors hover:bg-[#2a2a2a]"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">定位你的出海爆品</h1>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00d4ff]">
            <Globe className="h-6 w-6 text-[#1a1a1a]" />
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto pb-96">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                {message.type === "ai" ? (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white">
                    <Bot className="h-6 w-6 text-[#1a1a1a]" />
                  </div>
                ) : null}
                <div
                  className={`max-w-2xl rounded-2xl px-6 py-4 ${
                    message.type === "ai"
                      ? "bg-[#2a2a2a] text-white"
                      : "bg-[#00d4ff] text-[#1a1a1a]"
                  }`}
                >
                  <div className="text-base leading-relaxed">{message.content}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {showLoading ? (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, y: 20 }}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white">
                  <Bot className="h-6 w-6 text-[#1a1a1a]" />
                </div>
                <div className="rounded-2xl bg-[#2a2a2a] px-6 py-4">
                  <div className="mb-2 text-sm text-gray-400">
                    正在扫描Reddit讨论
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  </div>
                  <motion.div
                    key={currentSubreddit}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono text-sm text-[#00d4ff]"
                    initial={{ opacity: 0, x: -10 }}
                  >
                    {SUBREDDITS[currentSubreddit]}
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showPositionCard && positioning ? (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40 bg-black/50"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setShowPositionCard(false)}
            />

            <motion.div
              animate={{ y: 0 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl"
              exit={{ y: "100%" }}
              initial={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex justify-center py-4">
                <div className="h-1.5 w-12 rounded-full bg-gray-300" />
              </div>

              <div className="space-y-12 px-8 pb-8">
                <div>
                  <div className="mb-3 text-xs font-medium tracking-wider text-gray-500">
                    PRODUCT POSITION
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {isEditingPosition ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={productTitle}
                            onChange={(event) => setProductTitle(event.target.value)}
                            className="w-full border-b-2 border-[#00d4ff] pb-1 text-2xl font-bold text-[#1a1a1a] focus:outline-none"
                          />
                          <input
                            type="text"
                            value={productSubtitle}
                            onChange={(event) => setProductSubtitle(event.target.value)}
                            className="w-full border-b border-gray-300 pb-1 text-base text-gray-600 focus:border-[#00d4ff] focus:outline-none"
                          />
                        </div>
                      ) : (
                        <>
                          <h2 className="mb-2 text-2xl font-bold text-[#1a1a1a]">
                            {productTitle}
                          </h2>
                          <p className="text-base text-gray-600">{productSubtitle}</p>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingPosition((prev) => !prev)}
                      className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                    >
                      <Pencil className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-xs font-medium tracking-wider text-gray-500">
                    TARGET MARKET
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {MARKETS.find((item) => item.id === selectedMarket)?.flag}
                      </span>
                      <div>
                        <div className="font-semibold text-[#1a1a1a]">
                          {MARKETS.find((item) => item.id === selectedMarket)?.label} 市场首发
                        </div>
                        <div className="text-sm text-gray-600">
                          {positioning.marketInsight}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-xs font-medium tracking-wider text-gray-500">
                    TARGET AUDIENCE
                  </div>
                  <div className="flex gap-5 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-[#f5f7f8] text-sm font-semibold uppercase tracking-[0.16em] text-[#1a1a1a]">
                      TG
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-[#1a1a1a]">
                          {audience.title}
                        </h3>
                        <div className="mb-2 flex flex-wrap gap-2">
                          {audience.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">痛点：</span>
                        {audience.painPoint}
                      </div>
                      <div className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                        {audience.willingnessToPay} 价格接受度高
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-xs font-medium tracking-wider text-gray-500">
                    HOOK / 一句话卖点
                  </div>
                  <div className="space-y-4">
                    {renderedHooks.map((hook) => (
                      <motion.button
                        key={hook.id}
                        type="button"
                        onClick={() => setSelectedHook(hook.id)}
                        className={`relative w-full overflow-hidden rounded-xl border-2 p-5 text-left transition-all ${
                          selectedHook === hook.id
                            ? "border-[#00d4ff] bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-3 inline-flex rounded-full bg-[#eefbff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0087a3]">
                              {hookLabel(hook.id)}
                            </div>
                            <h4 className="mb-2 text-lg font-semibold text-[#1a1a1a]">
                              {hook.title}
                            </h4>
                            <p className="mb-2 text-sm text-gray-600">
                              {hook.subtitle}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                                <motion.div
                                  animate={{ width: `${hook.heat}%` }}
                                  className="h-full bg-[#00d4ff]"
                                  initial={{ width: 0 }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-700">
                                {hook.heat}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                    <input
                      type="text"
                      placeholder="或自定义卖点..."
                      value={customHookInput}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setCustomHookInput(nextValue);

                        if (nextValue.trim()) {
                          setSelectedHook("custom");
                          return;
                        }

                        if (selectedHook === "custom") {
                          setSelectedHook(hooks[0]?.id ?? "");
                        }
                      }}
                      className="w-full rounded-xl border-2 border-dashed border-gray-300 px-5 py-4 text-[#1a1a1a] outline-none placeholder:text-gray-400 focus:border-[#00d4ff]"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={() => void finalizeSelection()}
                    className="w-full rounded-xl bg-[#00d4ff] py-4 text-lg font-semibold text-[#1a1a1a] transition-colors hover:bg-[#00bfea] disabled:cursor-progress disabled:opacity-60"
                    disabled={busy}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {busy ? "正在生成本地化方案..." : "进入本地化方案 →"}
                  </motion.button>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setShowPositionCard(false)}
                      className="text-sm text-gray-500 transition-colors hover:text-gray-700"
                    >
                      重新分析
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
