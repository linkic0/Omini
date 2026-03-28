"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUp,
  Check,
  Copy,
  ExternalLink,
  Lightbulb,
  Minus,
  Rocket,
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

import type { WorkspaceData } from "./types";

type WorkspaceViewProps = {
  session: WorkspaceData;
  fallback?: WorkspaceData;
};

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
  const selected = session ?? fallback;
  const [activeTab, setActiveTab] = useState<"overview" | "materials" | "analytics">(
    "overview",
  );
  const [checklist, setChecklist] = useState(selected.workspace.checklist);
  const [selectedPost, setSelectedPost] = useState(0);
  const [seoTitle, setSeoTitle] = useState(selected.workspace.seo.title);

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
                        {selectedPost === index ? <span className="h-2 w-2 rounded-full bg-[#00d4ff]" /> : null}
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
                <h3 className="mb-4 text-[16px] font-semibold">3帧Story分镜</h3>
                <div className="space-y-3">
                  {selected.materials.storyFrames.map((frame) => (
                    <div key={frame.title} className={`${insetPanelClass} p-4`}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold">{frame.title}</span>
                        <span className="text-xs text-gray-500">{frame.description}</span>
                      </div>
                      <div className="mb-2 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                        <div className="text-center text-3xl">{frame.visual}</div>
                      </div>
                      <div className="text-xs italic text-gray-400">&ldquo;{frame.copy}&rdquo;</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
    </div>
  );
}
