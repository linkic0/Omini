"use client";

import { useEffect, useMemo, useState } from "react";

import { useDemoSession } from "@/components/providers/demo-session-provider";
import { createWorkspaceFallback } from "@/lib/fallback-data";
import type { ApiEnvelope, WorkspaceData as WorkspacePayload } from "@/lib/types";

import type { WorkspaceData } from "./types";
import { WorkspaceView } from "./workspace-view";

function mapWorkspaceData(
  payload: WorkspacePayload,
  idea: string,
  source: "gmi" | "fallback",
  summary: {
    market: string;
    audience: string;
    positioning: string;
  },
): WorkspaceData {
  return {
    sessionId: `sess_${idea.slice(0, 6).replace(/\s+/g, "").toLowerCase() || "demo"}`,
    idea,
    market: summary.market,
    audience: summary.audience,
    positioning: summary.positioning,
    source,
    workspace: {
      timeline: payload.timeline,
      checklist: payload.checklist,
      channels: [
        {
          name: payload.channelRecommendation.name,
          label: payload.channelRecommendation.badges.join(" · "),
          reach: payload.channelRecommendation.reach,
          reason: payload.channelRecommendation.stat,
          active: true,
        },
        ...payload.standbyChannels.map((name) => ({
          name,
          label: "Standby channel",
          reach: "Secondary",
          reason: "Prepared as backup distribution once the first wave stabilizes.",
        })),
      ],
      seo: {
        highTraffic: payload.metrics.slice(0, 2).map((metric) => ({
          term: metric.label,
          volume: metric.value,
        })),
        longTail: payload.hashtags.slice(0, 4),
        title: `${payload.title} | ${payload.channelRecommendation.name} launch plan`,
      },
    },
    materials: {
      currentChannel: payload.channelRecommendation.name,
      bestTime: payload.publishWindow,
      frequency: payload.publishCadence,
      posts: payload.posts,
      storyFrames: payload.storyFrames.map((frame) => ({
        title: frame.title,
        description: frame.description,
        copy: frame.text,
        visual: frame.visual,
      })),
      hashtags: payload.hashtags,
    },
    analytics: {
      metrics: payload.metrics,
      traffic: payload.traffic,
      channels: payload.channelSplit.map((item, index) => ({
        ...item,
        color: ["#22d3ee", "#818cf8", "#34d399", "#f59e0b"][index % 4],
      })),
      contentPerformance: payload.contentPerformance.map((item) => ({
        ...item,
        badge: item.badge ?? undefined,
      })),
      alerts: [
        ...payload.warnings.map((message) => ({
          tone: "warning" as const,
          title: "Operational warning",
          message,
        })),
        ...payload.recommendations.map((message) => ({
          tone: "info" as const,
          title: "Optimization suggestion",
          message,
        })),
      ],
    },
  };
}

export function WorkspaceRoute() {
  const { hydrated, mergeSession, session } = useDemoSession();
  const idea = session.idea || "手工编织的水晶手链，主打能量疗愈与焦虑缓解";
  const market = session.market ?? "us";
  const [payload, setPayload] = useState<WorkspacePayload | null>(
    session.workspace ?? null,
  );
  const [source, setSource] = useState<"gmi" | "fallback">(session.source ?? "fallback");

  useEffect(() => {
    if (!hydrated || session.workspace) {
      return;
    }

    void (async () => {
      try {
        const response = await fetch("/api/workspace", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea, market }),
        });
        const result = (await response.json()) as ApiEnvelope<WorkspacePayload>;
        setPayload(result.data);
        setSource(result.source);
        mergeSession({
          workspace: result.data,
          source: result.source,
        });
      } catch {
        const fallback = createWorkspaceFallback({ idea, market });
        setPayload(fallback);
        setSource("fallback");
        mergeSession({
          workspace: fallback,
          source: "fallback",
        });
      }
    })();
  }, [hydrated, idea, market, mergeSession, session.workspace]);

  const mapped = useMemo(() => {
    const current = payload ?? createWorkspaceFallback({ idea, market });
    return mapWorkspaceData(current, idea, source, {
      market: session.positioning?.marketLabel ?? getReadableMarket(market),
      audience:
        session.positioning?.targetAudience.title ??
        "Spiritual Seekers",
      positioning:
        session.positioning?.oneLiner ?? current.title,
    });
  }, [idea, market, payload, session.positioning, source]);

  return <WorkspaceView session={mapped} fallback={mapped} />;
}

function getReadableMarket(market: string) {
  if (market === "us") return "北美";
  if (market === "jp") return "日本";
  if (market === "eu") return "欧洲";
  if (market === "sea") return "东南亚";
  return market;
}
