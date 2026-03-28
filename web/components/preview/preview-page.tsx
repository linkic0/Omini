"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { useDemoSession } from "@/components/providers/demo-session-provider";
import { createLandingFallback } from "@/lib/fallback-data";
import type { ApiEnvelope, LandingData } from "@/lib/types";
import { previewPromptSuggestions } from "@/components/site-data";
import { StoreHomeSections } from "@/components/store/store-page";
import {
  PreviewAssistant,
  PreviewEditBar,
  PreviewFrame,
  PreviewHint,
  PreviewPublishButton,
  PreviewToolbar,
  type PreviewMode,
} from "@/components/store/store-shell";

export function PreviewPage() {
  const router = useRouter();
  const { hydrated, mergeSession, session } = useDemoSession();
  const [mode, setMode] = useState<PreviewMode>("preview");
  const [landing, setLanding] = useState<LandingData | null>(session.landing ?? null);
  const [draftLanding, setDraftLanding] = useState<LandingData | null>(null);
  const [promptValue, setPromptValue] = useState("");
  const [userEditHistory, setUserEditHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!hydrated || session.landing || landing) {
      return;
    }

    void (async () => {
      try {
        const response = await fetch("/api/landing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idea: session.idea,
            market: session.market ?? "us",
          }),
        });
        const result = (await response.json()) as ApiEnvelope<LandingData>;
        setLanding(result.data);
        mergeSession({
          landing: result.data,
          source: result.source,
        });
      } catch {
        const fallback = createLandingFallback({
          idea: session.idea,
          market: session.market ?? "us",
        });
        setLanding(fallback);
        mergeSession({
          landing: fallback,
          source: "fallback",
        });
      }
    })();
  }, [hydrated, landing, mergeSession, session.idea, session.landing, session.market]);

  const currentLanding = useMemo(
    () =>
      draftLanding ??
      landing ??
      session.landing ??
      createLandingFallback({
        idea: session.idea,
        market: session.market ?? "us",
      }),
    [draftLanding, landing, session.idea, session.landing, session.market],
  );

  const editHistory =
    userEditHistory.length > 0
      ? userEditHistory
      : currentLanding.editPrompts?.length
        ? currentLanding.editPrompts
        : previewPromptSuggestions;

  const applyPromptToLanding = (prompt: string, base: LandingData, history: string[]) => {
    const next = { ...base, editPrompts: history };
    const lower = prompt.toLowerCase();

    if (lower.includes("gift") || prompt.includes("礼物") || prompt.includes("节日")) {
      next.heroSubtitle = "Handmade crystal bracelets for mindful living and meaningful gifting";
    }

    if (lower.includes("bold") || prompt.includes("更大胆") || prompt.includes("高级")) {
      next.heroTitle = "Wear Your Intention, Beautifully";
    }

    if (lower.includes("cta") || prompt.includes("按钮") || prompt.includes("转化")) {
      next.heroCta = "Find Your Bracelet";
    }

    if (lower.includes("premium") || prompt.includes("高端") || prompt.includes("premium")) {
      next.shippingNote = "Gift-ready packaging with free shipping over $50";
    }

    return next;
  };

  const handleApplyEdit = (prompt: string) => {
    const nextPrompt = prompt.trim();

    if (!nextPrompt) {
      toast.error("请输入一条修改指令。");
      return;
    }

    const nextHistory = [nextPrompt, ...editHistory.filter((item) => item !== nextPrompt)].slice(0, 6);
    setUserEditHistory(nextHistory);

    const nextLanding = applyPromptToLanding(nextPrompt, currentLanding, nextHistory);
    setDraftLanding(nextLanding);
    mergeSession({ landing: nextLanding });
    setPromptValue("");
    toast.success("预览修改已应用到当前 demo。");
  };

  return (
    <div className="min-h-screen bg-[#101828]">
      <PreviewToolbar
        mode={mode}
        onModeChange={setMode}
        onPublish={() => {
          toast.success("预览页已就绪，正在打开公开独立站");
          router.push("/store");
        }}
      />

      <PreviewFrame mode={mode}>
        <StoreHomeSections
          heroCta={currentLanding.heroCta}
          shippingNote={currentLanding.shippingNote}
          heroSubtitle={currentLanding.heroSubtitle}
          heroTitle={currentLanding.heroTitle}
          navOffset={74}
        />
      </PreviewFrame>

      <PreviewHint show={mode === "edit"} />
      <PreviewEditBar
        show={mode === "edit"}
        editHistory={editHistory}
        value={promptValue}
        onValueChange={setPromptValue}
        onSubmit={() => handleApplyEdit(promptValue)}
      />
      <PreviewAssistant
        show={mode === "edit"}
        suggestions={editHistory}
        onSelectSuggestion={handleApplyEdit}
      />

      <AnimatePresence>
        {mode === "publish" ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-6 z-[80] max-w-sm rounded-2xl border border-white/10 bg-[#101828]/92 p-5 text-white shadow-2xl backdrop-blur-xl"
          >
            <p className="text-sm font-medium tracking-[0.08em] text-[#7dd3fc]">READY TO REVIEW</p>
            <h3 className="mt-2 text-xl font-semibold">独立站预览已完成</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {editHistory.slice(0, 3).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <div className="mt-4">
              <PreviewPublishButton href="/store">打开公开独立站</PreviewPublishButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
