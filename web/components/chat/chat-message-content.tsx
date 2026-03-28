"use client";

import { motion } from "motion/react";

import type { ChatMessageData, MarketId } from "@/lib/types";

const MARKETS: Array<{ id: MarketId; label: string; flag: string }> = [
  { id: "us", label: "北美", flag: "🇺🇸" },
  { id: "jp", label: "日本", flag: "🇯🇵" },
  { id: "eu", label: "欧洲", flag: "🇪🇺" },
  { id: "sea", label: "东南亚", flag: "🇸🇬" },
];

interface ChatMessageContentProps {
  data: ChatMessageData;
  selectedMarket?: MarketId;
  onMarketSelect?: (market: MarketId, label: string) => void;
}

export function ChatMessageContent({
  data,
  selectedMarket,
  onMarketSelect,
}: ChatMessageContentProps) {
  if (data.kind === "text") {
    return <span>{data.text}</span>;
  }

  if (data.kind === "market-select") {
    return (
      <div>
        <p className="mb-6">{data.assistant}</p>
        <div className="grid grid-cols-2 gap-4">
          {MARKETS.map((market) => (
            <motion.button
              key={market.id}
              type="button"
              onClick={() => onMarketSelect?.(market.id, market.label)}
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
    );
  }

  // kind === "insight"
  return (
    <div>
      <div className="mb-4 text-sm text-[#00d4ff]">{data.insight}</div>
      <p className="mb-2">{data.prompt}</p>
    </div>
  );
}
