"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUp,
  BarChart2,
  Check,
  Copy,
  Download,
  ExternalLink,
  Lightbulb,
  Minus,
  RotateCcw,
  Rocket,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDemoSession } from "@/components/providers/demo-session-provider";
import type { WorkspaceData } from "./types";

type WorkspaceViewProps = {
  session: WorkspaceData;
  fallback?: WorkspaceData;
};

type ImageTypeId = "lifestyle" | "whitebg" | "banner";

const IMAGE_TYPES: Array<{ id: ImageTypeId; label: string; hint: string }> = [
  { id: "lifestyle", label: "生活场景图", hint: "社媒种草" },
  { id: "whitebg", label: "白底图", hint: "电商上架" },
  { id: "banner", label: "活动营销Banner", hint: "促销推广" },
];

const MOCK_IMAGES: Record<
  ImageTypeId,
  Array<{ bg: string; emoji: string; scene?: string; tagline?: string; cta?: string }>
> = {
  lifestyle: [
    { bg: "linear-gradient(135deg,#6b21a8 0%,#db2777 100%)", emoji: "✨", scene: "晨间护理仪式" },
    { bg: "linear-gradient(135deg,#92400e 0%,#f59e0b 100%)", emoji: "💛", scene: "轻松日常佩戴" },
    { bg: "linear-gradient(135deg,#0e7490 0%,#0891b2 100%)", emoji: "🌊", scene: "户外时尚搭配" },
  ],
  whitebg: [
    { bg: "linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)", emoji: "💎" },
    { bg: "linear-gradient(135deg,#fff 0%,#f0fdf4 100%)", emoji: "✨" },
    { bg: "linear-gradient(135deg,#fafafa 0%,#fef9c3 100%)", emoji: "🪩" },
  ],
  banner: [
    { bg: "linear-gradient(90deg,#0a0a0a 0%,#003d4d 60%,#00d4ff18 100%)", emoji: "✨", tagline: "探索能量·感受疗愈", cta: "立即选购" },
    { bg: "linear-gradient(90deg,#0a0a0a 0%,#1a0a2e 60%,#7c3aed30 100%)", emoji: "💜", tagline: "Z世代都在用", cta: "查看详情" },
    { bg: "linear-gradient(90deg,#0a0a0a 0%,#2d0a0a 60%,#dc262630 100%)", emoji: "🔥", tagline: "限时优惠·抢先体验", cta: "马上抢购" },
  ],
};

type SelectableImage = {
  key: string;
  label: string;
  bg: string;
  emoji: string;
  isVideo?: boolean;
};

const VIDEO_THUMBS: SelectableImage[] = [
  { key: "vid-1", label: "片段一·产品展示", bg: "linear-gradient(135deg,#6b21a8 0%,#db2777 100%)", emoji: "▶", isVideo: true },
  { key: "vid-2", label: "片段二·使用过程", bg: "linear-gradient(135deg,#0e7490 0%,#0891b2 100%)", emoji: "▶", isVideo: true },
  { key: "vid-3", label: "片段三·用户好评", bg: "linear-gradient(135deg,#92400e 0%,#f59e0b 100%)", emoji: "▶", isVideo: true },
];

const PUBLISH_STEPS = [
  { label: "连接账号", duration: 800 },
  { label: "上传素材", duration: 1200 },
  { label: "生成预览", duration: 1000 },
  { label: "发布中",   duration: 1500 },
];

function CountUp({
  value,
  duration = 1000,
}: {
  value: string;
  duration?: number;
}) {
  const prefix = value.startsWith("$") ? "$" : "";
  const suffix = value.includes("%") ? "%" : value.includes("K") ? "K" : "";
  const rawNumber = value.replace(/[^\d.]/g, "");
  const target = Number(rawNumber) || 0;
  const precision = rawNumber.includes(".") ? rawNumber.split(".")[1]?.length ?? 0 : 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = 0;
    let frame = 0;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuad = (value: number) => value * (2 - value);
      setCount(target * easeOutQuad(progress));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, target]);

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  return (
    <span>
      {prefix}
      {formatter.format(count)}
      {suffix}
    </span>
  );
}

export function WorkspaceView({ session, fallback }: WorkspaceViewProps) {
  const router = useRouter();
  const { session: demoSession } = useDemoSession();
  const selected = session ?? fallback;
  const [activeTab, setActiveTab] = useState<"overview" | "materials" | "analytics">(
    "overview",
  );
  const [checklist, setChecklist] = useState(selected.workspace.checklist);
  const [selectedPost, setSelectedPost] = useState(0);
  const [seoTitle, setSeoTitle] = useState(selected.workspace.seo.title);
  const [activeImageType, setActiveImageType] = useState<ImageTypeId>("lifestyle");
  const [imageGenStates, setImageGenStates] = useState<Record<ImageTypeId, "idle" | "generating" | "done">>({
    lifestyle: "idle",
    whitebg: "idle",
    banner: "idle",
  });
  const [generatedImageUrls, setGeneratedImageUrls] = useState<Record<string, string>>({});
  const [selectedImageKeys, setSelectedImageKeys] = useState<Set<string>>(new Set());
  const [perImageCopy, setPerImageCopy] = useState<Record<string, number>>({});
  const [publishQueue, setPublishQueue] = useState<Array<{ key: string }>>([]);
  const [currentPublish, setCurrentPublish] = useState<{ key: string } | null>(null);
  const [publishStep, setPublishStep] = useState(-1);
  const [publishDone, setPublishDone] = useState(false);

  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercentage = (completedCount / checklist.length) * 100;
  const hashtagSizes = ["large", "medium", "large", "medium", "small", "large", "small", "medium"] as const;
  const panelClass = "rounded-lg bg-[#242424]";
  const insetPanelClass = "rounded-lg bg-[#1f1f1f]";
  const launchTitle = selected.idea.includes("水晶")
    ? "Crystal Flow 出海时间线"
    : `${selected.idea} 出海时间线`;
  const launchSubtitle =
    selected.idea.includes("水晶") && selected.market === "北美"
      ? "基于美国Z世代市场的7天启动计划"
      : `基于 ${selected.market} 市场的 7 天启动计划`;

  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("已复制到剪贴板");
  };

  const handleGenerateImages = async (type: ImageTypeId) => {
    // Check if images already exist for this type - skip if already generated
    const existingKeys = Object.keys(generatedImageUrls).filter(k => k.startsWith(type));
    if (existingKeys.length >= 3) {
      // Already generated, just mark as done
      setImageGenStates((prev) => ({ ...prev, [type]: "done" }));
      return;
    }

    setImageGenStates((prev) => ({ ...prev, [type]: "generating" }));

    const idea = demoSession?.idea ?? selected.idea;
    const market = demoSession?.market ?? "us";

    try {
      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, market }),
      });

      if (!response.ok || !response.body) throw new Error("API failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const event = JSON.parse(line.slice(6)) as {
            type: string; imageType?: string; index?: number; url?: string; error?: string;
          };
          if (event.type === "image_done" && event.imageType === type && event.url) {
            const key = `${event.imageType}-${event.index}`;
            setGeneratedImageUrls((prev) => ({ ...prev, [key]: event.url! }));
          }
          if (event.type === "all_done" ||
              (event.type === "error" && event.imageType === type)) {
            setImageGenStates((prev) => ({ ...prev, [type]: "done" }));
          }
        }
      }
      setImageGenStates((prev) => ({ ...prev, [type]: "done" }));
    } catch {
      // Fallback to mock if API not available
      window.setTimeout(() => {
        setImageGenStates((prev) => ({ ...prev, [type]: "done" }));
      }, 2200);
    }
  };

  const toggleImageSelect = (key: string) => {
    setSelectedImageKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handlePublishAll = () => {
    const items = [...selectedImageKeys].map((key) => ({ key }));
    if (!items.length) return;
    setPublishQueue(items.slice(1));
    setCurrentPublish(items[0]);
    setPublishStep(0);
    setPublishDone(false);
  };

  const handleModalClose = () => {
    if (publishQueue.length > 0) {
      setCurrentPublish(publishQueue[0]);
      setPublishQueue((q) => q.slice(1));
      setPublishStep(0);
      setPublishDone(false);
    } else {
      setCurrentPublish(null);
    }
  };

  // Drive publish step progression
  useEffect(() => {
    if (!currentPublish || publishDone) return;
    if (publishStep < 0) return;
    const step = PUBLISH_STEPS[publishStep];
    if (!step) return;
    const timer = window.setTimeout(() => {
      if (publishStep < PUBLISH_STEPS.length - 1) {
        setPublishStep((s) => s + 1);
      } else {
        setPublishDone(true);
      }
    }, step.duration);
    return () => clearTimeout(timer);
  }, [currentPublish, publishStep, publishDone]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-800 bg-[#1a1a1a]">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#00d4ff]/40 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#00d4ff]">
              GTM
            </span>
            <span className="text-base font-semibold md:text-lg">GTM Copilot</span>
          </div>

          <div className="flex gap-4 md:gap-8">
            {[
              { key: "overview", label: "GTM方案" },
              { key: "materials", label: "发布物料" },
              { key: "analytics", label: "数据监控" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`relative px-2 py-2 text-xs font-medium transition-colors hover:text-white md:px-4 md:text-sm ${
                  activeTab === tab.key ? "text-white" : "text-gray-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.key ? (
                  <motion.div
                    layoutId="workspace-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4ff]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] px-3 py-2 text-xs font-medium text-gray-300 transition-colors hover:border-[#00d4ff]/50 hover:text-white md:px-4 md:text-sm"
            >
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">数据面板</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const deployUrl = `/deploy?brandName=${encodeURIComponent(demoSession?.positioning?.brandName ?? demoSession?.idea ?? '')}&category=${encodeURIComponent(demoSession?.positioning?.marketLabel ?? 'Fashion')}&color=%2300d4ff`;
                router.push(deployUrl);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[#00d4ff]/40 px-3 py-2 text-xs font-medium text-[#00d4ff] transition-colors hover:bg-[#00d4ff]/10 md:px-4 md:text-sm"
            >
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">部署独立站</span>
            </button>

            <button
              type="button"
              onClick={() => {
                toast.success("正在打开独立站预览");
                router.push("/preview");
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#00d4ff] px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-[#00b8e6] md:px-6 md:text-sm"
            >
              <Rocket className="h-4 w-4 md:h-[18px] md:w-[18px]" />
              <span className="hidden sm:inline">发布我的出海站</span>
              <span className="sm:hidden">发布</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1800px] px-4 pb-6 pt-20 md:px-6">
        {activeTab === "overview" ? (
          <div className="space-y-6">
            <section className={`${panelClass} p-6`}>
              <h2 className="mb-2 text-[28px] font-bold">{launchTitle}</h2>
              <p className="mb-8 text-sm text-gray-400">{launchSubtitle}</p>

              <div className="relative">
                <div className="absolute left-0 right-0 top-6 h-0.5 bg-gray-700" />
                <div className="relative flex justify-between gap-3">
                  {selected.workspace.timeline.map((node, index) => (
                    <div
                      key={`${node.day}-${index}`}
                      className="group flex cursor-pointer flex-col items-center"
                      title={node.description}
                    >
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#1a1a1a] transition-colors ${
                          node.active
                            ? "bg-[#00d4ff] text-black"
                            : "bg-transparent text-gray-500 ring-1 ring-inset ring-gray-600"
                        }`}
                      >
                        {node.active ? <Check size={20} /> : null}
                      </motion.div>
                      <div className="mt-4 max-w-[140px] text-center">
                        <div
                          className={`mb-1 text-sm font-semibold ${
                            node.active ? "text-[#00d4ff]" : "text-gray-400"
                          }`}
                        >
                          {node.day}
                        </div>
                        <div className="mb-1 text-xs leading-tight text-white">{node.title}</div>
                        <div className="text-[10px] leading-tight text-gray-500">
                          {node.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className={`${panelClass} p-6`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold">出发前检查清单</h3>
                  <span className="rounded-full bg-[#00d4ff] px-3 py-1 text-xs font-medium text-black">
                    {completedCount}/{checklist.length} 完成
                  </span>
                </div>

                <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full bg-[#00d4ff] transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="space-y-3">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        setChecklist((prev) =>
                          prev.map((entry) =>
                            entry.id === item.id
                              ? { ...entry, completed: !entry.completed }
                              : entry,
                          ),
                        )
                      }
                      className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-[#2a2a2a]"
                    >
                      <motion.div
                        animate={item.completed ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                          item.completed
                            ? "border-[#00d4ff] bg-[#00d4ff]"
                            : "border-gray-600"
                        }`}
                      >
                        {item.completed ? <Check size={14} className="text-black" /> : null}
                      </motion.div>
                      <span className={`flex-1 text-sm ${item.completed ? "text-gray-400" : "text-white"}`}>
                        {item.name}
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          item.completed
                            ? "bg-green-900/30 text-green-400"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {item.completed ? "已完成" : "待完成"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`${panelClass} p-6`}>
                <h3 className="mb-4 text-[16px] font-semibold">推荐首发渠道</h3>

                <div className="mb-4 rounded-lg border border-[#00d4ff] bg-[#202326] p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-[#2b2f33] text-xs font-semibold uppercase tracking-[0.14em] text-[#00d4ff]">
                      {selected.workspace.channels[0]?.name === "Instagram" ? "IG" : "GO"}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">
                        {selected.workspace.channels[0]?.name}
                      </h4>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {(selected.workspace.channels[0]?.label.split(" · ") ?? []).map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-[#00d4ff]/20 px-2 py-1 text-xs text-[#00d4ff]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4 space-y-2">
                    <p className="text-sm text-gray-300">
                      Data signal: {selected.workspace.channels[0]?.reason}
                    </p>
                    <p className="text-sm text-gray-300">
                      Expected reach: {selected.workspace.channels[0]?.reach}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("materials")}
                    className="w-full rounded-lg bg-[#00d4ff] py-2 font-medium text-black transition-colors hover:bg-[#00b8e6]"
                  >
                    查看发布物料 →
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selected.workspace.channels.slice(1).map((channel) => (
                    <div key={channel.name} className="rounded-lg bg-gray-800/50 p-4 opacity-50">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                        {channel.name === "TikTok" ? "TT" : "PI"}
                      </div>
                      <h5 className="mb-1 text-sm font-medium">{channel.name}</h5>
                      <p className="text-xs text-gray-500">即将支持</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className={`${panelClass} p-6`}>
              <h3 className="mb-4 text-[16px] font-semibold">SEO关键词建议</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-400">高流量词</h4>
                  <div className="space-y-2">
                    {selected.workspace.seo.highTraffic.map((item) => (
                      <div key={item.term} className="flex items-baseline gap-2">
                        <span className="text-white">{item.term}</span>
                        <span className="text-xs text-[#00d4ff]">{item.volume}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-400">长尾词</h4>
                  <div className="space-y-2">
                    {selected.workspace.seo.longTail.map((item) => (
                      <div key={item} className="text-white">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-400">建议标题</h4>
                  <div className="relative">
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(event) => setSeoTitle(event.target.value)}
                      className="w-full rounded-lg border border-gray-700 bg-[#1a1a1a] px-3 py-2 pr-10 text-sm text-white focus:border-[#00d4ff] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => void copyToClipboard(seoTitle)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#00d4ff]"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : null}

        {activeTab === "materials" ? (
          <div className="space-y-6">
            <section className={`${panelClass} p-6`}>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm text-gray-400">当前选中渠道:</span>
                    <span className="rounded-full bg-[#00d4ff]/20 px-3 py-1 text-sm font-medium text-[#00d4ff]">
                      {selected.materials.currentChannel}
                    </span>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="mb-1 text-sm text-gray-400">最佳发布时间</div>
                    <div className="font-semibold">{selected.materials.bestTime}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-gray-400">发布频率建议</div>
                    <div className="font-semibold">{selected.materials.frequency}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Image Asset Generation ─────────────────────────── */}
            <section className={`${panelClass} p-6`}>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[16px] font-semibold">图片物料生成</h3>
                <span className="rounded-full bg-[#00d4ff]/10 px-3 py-1 text-xs text-[#00d4ff]">
                  AI 生成
                </span>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                {IMAGE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveImageType(t.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      activeImageType === t.id
                        ? "bg-[#00d4ff]/20 text-[#00d4ff]"
                        : "bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-white"
                    }`}
                  >
                    {t.label}
                    <span className="ml-2 text-xs opacity-60">{t.hint}</span>
                  </button>
                ))}
              </div>

              {imageGenStates[activeImageType] === "idle" ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 py-12">
                  <Sparkles className="mb-3 h-8 w-8 text-gray-600" />
                  <p className="mb-1 text-sm text-gray-400">
                    基于商品&nbsp;<span className="text-white">{selected.idea}</span>&nbsp;自动生成
                  </p>
                  <p className="mb-6 text-xs text-gray-600">
                    {activeImageType === "lifestyle" && "真实使用场景 · 生活风格化 · 社媒种草"}
                    {activeImageType === "whitebg" && "纯白背景 · 细节清晰 · 符合电商平台规范"}
                    {activeImageType === "banner" && "品牌色调 · 卖点突出 · 可直接投放"}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleGenerateImages(activeImageType)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#00d4ff] px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#00b8e6]"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI 生成图片
                  </button>
                </div>
              ) : imageGenStates[activeImageType] === "generating" ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#00d4ff]/30 py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="mb-3"
                  >
                    <Sparkles className="h-8 w-8 text-[#00d4ff]" />
                  </motion.div>
                  <p className="text-sm text-[#00d4ff]">AI 正在生成图片…</p>
                  <p className="mt-1 text-xs text-gray-600">根据你的商品创意定制</p>
                </div>
              ) : (
                <div>
                  <div
                    className={`grid gap-3 ${
                      activeImageType === "banner" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
                    }`}
                  >
                    {MOCK_IMAGES[activeImageType].map((img, i) => {
                        const imgKey = `${activeImageType}-${i}`;
                        const isSelected = selectedImageKeys.has(imgKey);
                        return (
                      <div
                        key={i}
                        onClick={() => toggleImageSelect(imgKey)}
                        className={`group relative cursor-pointer overflow-hidden rounded-lg transition-all ${
                          isSelected ? "ring-2 ring-[#00d4ff]" : "hover:ring-1 hover:ring-[#00d4ff]/40"
                        }`}
                      >
                        {/* Checkbox overlay */}
                        <div className="absolute right-2 top-2 z-10">
                          <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected ? "border-[#00d4ff] bg-[#00d4ff]" : "border-white/70 bg-black/40"
                          }`}>
                            {isSelected && (
                              <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        {generatedImageUrls[imgKey] ? (
                          <img
                            src={generatedImageUrls[imgKey]}
                            alt={imgKey}
                            className={`w-full object-cover ${
                              activeImageType === "banner" ? "aspect-[3/1]" : "aspect-square"
                            }`}
                          />
                        ) : (
                        <div
                          className={`flex w-full items-center justify-center ${
                            activeImageType === "banner" ? "aspect-[3/1]" : "aspect-square"
                          }`}
                          style={{ background: img.bg }}
                        >
                          {activeImageType === "whitebg" ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl">{img.emoji}</span>
                              <span className="text-xs font-medium text-gray-500">
                                {selected.idea.slice(0, 10)}
                              </span>
                            </div>
                          ) : activeImageType === "banner" ? (
                            <div className="flex w-full items-center justify-between px-8">
                              <div>
                                <div className="text-lg font-bold text-white">
                                  {selected.idea.slice(0, 14)}
                                </div>
                                <div className="text-xs text-white/70">{img.tagline}</div>
                              </div>
                              <span className="text-4xl">{img.emoji}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl">{img.emoji}</span>
                              <span className="text-xs text-white/60">{img.scene}</span>
                            </div>
                          )}
                        </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toast.success("图片已保存到本地"); }}
                          className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-xs text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                        >
                          <Download className="h-3 w-3" />
                          下载
                        </button>
                      </div>
                        );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenerateImages(activeImageType)}
                    className="mt-4 flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-[#00d4ff]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    重新生成
                  </button>
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <h3 className="text-[16px] font-semibold">帖子文案库</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {selected.materials.posts.map((post, index) => (
                    <div
                      key={`${post.type}-${index}`}
                      onClick={() => setSelectedPost(index)}
                      className={`rounded-lg border-2 p-4 transition-all ${
                        selectedPost === index
                          ? "border-[#00d4ff] bg-[linear-gradient(180deg,rgba(39,39,41,0.96),rgba(26,26,27,0.98))] shadow-lg shadow-[#00d4ff]/12"
                          : "border-transparent bg-[linear-gradient(180deg,rgba(35,35,37,0.96),rgba(24,24,25,0.98))] hover:border-white/10"
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#00d4ff]">{post.type}</span>
                        {selectedPost === index ? (
                          <span className="rounded-full bg-green-600/30 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                            选中发布 ✓
                          </span>
                        ) : null}
                      </div>
                      <p className="mb-3 line-clamp-4 text-sm leading-relaxed text-gray-300">
                        {post.content}
                      </p>
                      <p className="mb-3 break-words text-xs text-[#00d4ff]">{post.hashtags}</p>
                      <button
                        type="button"
                        onClick={() => void copyToClipboard(`${post.content}\n\n${post.hashtags}`)}
                        className="flex items-center gap-2 text-xs text-gray-400 transition-colors hover:text-[#00d4ff]"
                      >
                        <Copy size={14} />
                        复制文案
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold">产品宣传视频缩略图</h3>
                  <span className="rounded-full bg-[#00d4ff]/10 px-2 py-1 text-xs text-[#00d4ff]">预设素材</span>
                </div>
                <p className="mb-4 text-xs text-gray-500">点击缩略图勾选，加入发布组装</p>
                <div className="space-y-3">
                  {VIDEO_THUMBS.map((thumb, i) => {
                    const isSelected = selectedImageKeys.has(thumb.key);
                    const frame = selected.materials.storyFrames[i];
                    return (
                      <div
                        key={thumb.key}
                        onClick={() => toggleImageSelect(thumb.key)}
                        className={`flex cursor-pointer gap-4 rounded-lg border p-3 transition-all ${
                          isSelected
                            ? "border-[#00d4ff] bg-[#00d4ff]/5 ring-1 ring-[#00d4ff]/30"
                            : "border-[#2a2a2a] bg-[#1f1f1f] hover:border-[#00d4ff]/40"
                        }`}
                      >
                        {/* Video thumbnail */}
                        <div className="relative shrink-0">
                          <div
                            className="flex h-24 w-14 items-center justify-center overflow-hidden rounded-lg"
                            style={{ background: thumb.bg }}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40">
                                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                            <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-medium text-white/80">
                              {i + 1}/{VIDEO_THUMBS.length}
                            </span>
                          </div>
                          {/* Checkbox */}
                          <div className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected ? "border-[#00d4ff] bg-[#00d4ff]" : "border-white/70 bg-black/40"
                          }`}>
                            {isSelected && (
                              <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        {/* Text */}
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">Frame {i + 1}</span>
                            <span className="rounded bg-[#00d4ff]/15 px-2 py-0.5 text-xs text-[#00d4ff]">{thumb.label}</span>
                          </div>
                          {frame && (
                            <>
                              <p className="mt-1 text-xs text-gray-400">{frame.description}</p>
                              <p className="mt-0.5 text-[10px] italic text-gray-600">&ldquo;{frame.copy}&rdquo;</p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Hashtag ── */}
            <section className={`${panelClass} p-6`}>
              <h3 className="mb-4 text-[16px] font-semibold">Hashtag推荐</h3>
              <div className="flex flex-wrap gap-3">
                {selected.materials.hashtags.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    onClick={() => void copyToClipboard(item)}
                    className={`rounded-full bg-[#00d4ff]/10 px-4 py-2 text-[#00d4ff] transition-colors hover:bg-[#00d4ff]/20 ${
                      hashtagSizes[index] === "large"
                        ? "text-base font-semibold"
                        : hashtagSizes[index] === "medium"
                          ? "text-sm font-medium"
                          : "text-xs"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            {/* ── PublishAssembler ─────────────────────────── */}
            {selectedImageKeys.size > 0 && (
              <section className="rounded-lg border border-[#00d4ff]/30 bg-[#00d4ff]/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#00d4ff]" />
                    <h3 className="text-sm font-bold">
                      组装预览
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        {selectedImageKeys.size} 张图片 · 发布到 {selected.materials.currentChannel}
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedImageKeys(new Set())}
                      className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-white"
                    >
                      重置
                    </button>
                    <button
                      type="button"
                      onClick={handlePublishAll}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#00d4ff] px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-[#00b8e6]"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                      批量发布 ({selectedImageKeys.size})
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  {[...selectedImageKeys].map((key) => {
                    const isVideo = key.startsWith("vid-");
                    const thumb = isVideo
                      ? VIDEO_THUMBS.find((v) => v.key === key)
                      : null;
                    const [typeStr, idxStr] = key.split("-");
                    const mockImg = !isVideo
                      ? MOCK_IMAGES[typeStr as ImageTypeId]?.[Number(idxStr)]
                      : null;
                    const realUrl = !isVideo ? generatedImageUrls[key] : null;
                    const bg = thumb?.bg ?? mockImg?.bg ?? "#242424";
                    const copyIndex = perImageCopy[key] ?? selectedPost;
                    const post = selected.materials.posts[copyIndex];

                    return (
                      <div key={key} className="w-44 shrink-0 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1f1f1f]">
                        {/* Image preview */}
                        <div
                          className={`relative flex w-full items-center justify-center ${isVideo ? "aspect-[9/16]" : "aspect-square"}`}
                          style={realUrl ? {} : { background: bg }}
                        >
                          {realUrl ? (
                            <img src={realUrl} alt={key} className="h-full w-full object-cover" />
                          ) : isVideo ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40">
                              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          ) : null}
                          <div className="absolute bottom-1.5 left-1.5">
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${isVideo ? "bg-purple-500/80 text-white" : "bg-black/60 text-white"}`}>
                              {isVideo ? (thumb?.label ?? key) : key}
                            </span>
                          </div>
                        </div>
                        {/* Copy selector */}
                        <div className="p-2">
                          <p className="mb-1 text-[10px] text-gray-500">配对文案</p>
                          <select
                            value={copyIndex}
                            onChange={(e) =>
                              setPerImageCopy((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                            }
                            className="w-full rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:border-[#00d4ff] focus:outline-none"
                          >
                            {selected.materials.posts.map((p, i) => (
                              <option key={i} value={i}>{p.type}</option>
                            ))}
                          </select>
                          {post && (
                            <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-gray-500">
                              {post.content}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        ) : null}

        {activeTab === "analytics" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {selected.analytics.metrics.map((metric) => {
                return (
                  <div key={metric.label} className={`${panelClass} p-6`}>
                    <div className="mb-1 text-sm text-gray-400">{metric.label}</div>
                    <div className="mb-3 text-xs text-gray-500">{metric.subtitle}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-[32px] font-bold text-[#00d4ff]">
                        <CountUp value={metric.value} />
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          metric.trend === "up"
                            ? "text-green-400"
                            : metric.trend === "neutral"
                              ? "text-gray-400"
                              : "text-red-400"
                        }`}
                      >
                        {metric.trend === "up" ? <ArrowUp size={16} /> : <Minus size={16} />}
                        <span>{metric.change}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className={`${panelClass} p-6`}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold">7日流量趋势</h3>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <TrendingUp size={16} />
                      <span>上升趋势</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={selected.analytics.traffic}>
                      <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                      <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#00d4ff"
                        strokeWidth={3}
                        dot={{ fill: "#00d4ff", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className={`${panelClass} p-6`}>
                  <h3 className="mb-4 text-[16px] font-semibold">渠道来源分布</h3>
                  <div className="flex items-center gap-8">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie
                          data={selected.analytics.channels}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {selected.analytics.channels.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3">
                      {selected.analytics.channels.map((channel) => (
                        <div key={channel.name} className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded"
                            style={{ backgroundColor: channel.color }}
                          />
                          <span className="text-sm text-gray-300">{channel.name}</span>
                          <span className="text-sm font-semibold text-white">
                            {channel.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${panelClass} p-6`}>
                <h3 className="mb-4 text-[16px] font-semibold">内容表现</h3>
                <div className="space-y-4">
                  {selected.analytics.contentPerformance.map((content) => (
                    <div
                      key={content.title}
                      className="rounded-lg bg-[#1a1a1a] p-4 transition-colors hover:bg-[#2a2a2a]"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <div className="mb-1 text-sm font-medium">{content.title}</div>
                          <div className="text-xs text-gray-500">{content.type}</div>
                        </div>
                        {content.badge ? (
                          <span className="rounded bg-yellow-900/30 px-2 py-1 text-xs text-yellow-400">
                            {content.badge}
                          </span>
                        ) : null}
                      </div>

                      <div className="mb-3 space-y-1 text-xs text-gray-400">
                        <div>{content.views} 播放</div>
                        {content.likes ? <div>{content.likes} 赞</div> : null}
                        {content.comments ? <div>{content.comments} 评论</div> : null}
                        {content.completion ? <div>{content.completion}</div> : null}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toast.info(`${content.title} 的表现详情在 demo 中以 mock 数据展示。`)
                        }
                        className="flex items-center gap-1 text-xs text-[#00d4ff] hover:underline"
                      >
                        查看详情
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {selected.analytics.alerts.map((alert) => (
                <div
                  key={`${alert.title}-${alert.message}`}
                  className={`rounded-lg border p-4 ${
                    alert.tone === "warning"
                      ? "border-yellow-700/50 bg-yellow-900/20"
                      : "border-[#00d4ff]/50 bg-blue-900/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alert.tone === "warning" ? (
                      <AlertTriangle className="mt-0.5 flex-shrink-0 text-yellow-400" size={20} />
                    ) : (
                      <Lightbulb className="mt-0.5 flex-shrink-0 text-[#00d4ff]" size={20} />
                    )}
                    <div>
                      <div
                        className={`mb-1 font-medium ${
                          alert.tone === "warning" ? "text-yellow-400" : "text-[#00d4ff]"
                        }`}
                      >
                        {alert.title}
                      </div>
                      <div className="text-sm text-gray-300">{alert.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>

      {/* ── PublishModal ─────────────────────────── */}
      {currentPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-8">
            {!publishDone ? (
              <>
                <h3 className="text-lg font-bold">
                  正在发布到{" "}
                  <span className="text-[#00d4ff]">{selected.materials.currentChannel}</span>
                </h3>
                <div className="mt-6 space-y-4">
                  {PUBLISH_STEPS.map((step, i) => (
                    <div key={step.label} className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        i < publishStep
                          ? "border-green-500 bg-green-500/20"
                          : i === publishStep
                          ? "border-[#00d4ff] bg-[#00d4ff]/20"
                          : "border-[#2a2a2a]"
                      }`}>
                        {i < publishStep ? (
                          <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : i === publishStep ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#00d4ff] border-t-transparent" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-[#2a2a2a]" />
                        )}
                      </div>
                      <span className={`text-sm ${i <= publishStep ? "text-white" : "text-gray-600"}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-bold">发布成功！</h3>
                <p className="mt-2 text-sm text-gray-400">
                  内容已成功发布到 {selected.materials.currentChannel}
                  {publishQueue.length > 0 && `，还有 ${publishQueue.length} 条待发布`}
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="rounded-lg bg-[#00d4ff] px-6 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#00b8e6]"
                  >
                    {publishQueue.length > 0 ? `继续发布下一条` : "完成"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCurrentPublish(null); setPublishQueue([]); }}
                    className="rounded-lg border border-[#2a2a2a] px-6 py-2.5 text-sm text-gray-400 transition-colors hover:border-[#00d4ff]/50 hover:text-white"
                  >
                    关闭
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
