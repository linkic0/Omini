"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useDemoSession } from "@/components/providers/demo-session-provider";
import { GlobeIcon } from "@/components/ui/icons";

const ideaExamples = [
  "Crystal jewelry",
  "Embroidered tote bags",
  "Soy wax candles",
];

export function MarketingPage({ initialIdea }: { initialIdea?: string }) {
  const router = useRouter();
  const { mergeSession } = useDemoSession();
  const [input, setInput] = useState(initialIdea ?? "");

  const submit = (rawIdea: string) => {
    const nextIdea = rawIdea.trim();
    if (!nextIdea) {
      return;
    }

    mergeSession({
      idea: nextIdea,
      market: "us",
      audienceId: undefined,
      hookId: undefined,
      positioning: undefined,
      workspace: undefined,
      landing: undefined,
      source: undefined,
    });

    router.push(`/chat?idea=${encodeURIComponent(nextIdea)}`);
  };

  return (
    <main className="relative flex min-h-[100dvh] items-center overflow-hidden bg-[linear-gradient(145deg,#111214_0%,#111214_58%,#1a1b1d_100%)] px-6 text-white md:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-[#00d4ff]/8 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.16, 0.24, 0.16] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[10%] h-80 w-80 rounded-full bg-[#00d4ff]/6 blur-3xl"
          animate={{ scale: [1.06, 1, 1.06], opacity: [0.22, 0.14, 0.22] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[#8ec9d6]">
              Idea-to-Deploy
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.94] tracking-[-0.04em] md:text-7xl">
              From idea to
              <br />
              first launch.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#a9adb5] md:text-xl">
              Positioning, launch planning, and a storefront you can actually show.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            onSubmit={(event) => {
              event.preventDefault();
              submit(input);
            }}
            className="max-w-2xl"
          >
            <div className="border border-white/8 bg-white/[0.03] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <p className="text-sm font-medium text-white">Describe your product</p>
                  <p className="mt-1 text-sm text-[#8f949d]">Start with one clear idea.</p>
                </div>
                <div className="hidden text-right text-xs uppercase tracking-[0.18em] text-[#6f747b] sm:block">
                  Preview flow
                </div>
              </div>
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Handmade crystal bracelets for mindful living"
                className="w-full border border-white/10 bg-[#181a1d] px-5 py-5 text-lg text-white outline-none transition-all duration-300 placeholder:text-[#666b73] focus:border-[#00d4ff]"
              />
              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  {ideaExamples.map((example) => (
                    <motion.button
                      key={example}
                      type="button"
                      onClick={() => setInput(example)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="border border-white/10 px-3 py-1.5 text-sm text-[#c0c5cc] transition hover:border-[#00d4ff]/40 hover:text-white"
                    >
                      {example}
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!input.trim()}
                  className="inline-flex items-center justify-center bg-[#00d4ff] px-6 py-3 text-sm font-semibold tracking-[0.08em] text-[#111214] uppercase transition-colors hover:bg-[#4bddff] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Start the flow
                </motion.button>
              </div>
            </div>
          </motion.form>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="border-l border-white/8 pl-6 lg:pl-10"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[#6f747b]">Flow outline</p>
          <div className="mt-6 space-y-8">
            {[
              ["01", "Position the offer", "Pick a market, sharpen the angle, and land on one message."],
              ["02", "Build the launch plan", "Move into a GTM workspace with a clean first-week plan."],
              ["03", "Open the storefront", "Preview a customer-facing page and test the final tone."],
            ].map(([index, title, description]) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium text-[#00d4ff]">{index}</div>
                <h2 className="text-xl font-medium text-white">{title}</h2>
                <p className="max-w-sm text-sm leading-7 text-[#8f949d]">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-[#8f949d]">
            <button
              type="button"
              onClick={() => router.push("/preview")}
              className="transition hover:text-white"
            >
              View storefront demo
            </button>
            <span className="h-1 w-1 rounded-full bg-[#4a4f56]" />
            <button
              type="button"
              onClick={() => router.push("/workspace")}
              className="transition hover:text-white"
            >
              Open workspace
            </button>
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => router.push("/preview")}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#17191c] shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <GlobeIcon className="h-6 w-6 text-[#00d4ff]" />
      </motion.button>
    </main>
  );
}
