export type MarketOption = {
  id: "us" | "jp" | "eu" | "sea";
  title: string;
  subtitle: string;
  audienceHint: string;
  signal: string;
  tags: string[];
};

export type AudienceOption = {
  id: "creators" | "care" | "gift";
  title: string;
  subtitle: string;
  painPoint: string;
  outcome: string;
};

export type HookOption = {
  id: "ritual" | "relief" | "proof";
  title: string;
  subtitle: string;
  rationale: string;
  score: number;
};

export const marketOptions: MarketOption[] = [
  {
    id: "us",
    title: "北美",
    subtitle: "适合情绪价值和高客单价产品",
    audienceHint: "Reddit + Instagram 的组合更容易跑通",
    signal: "Search intent 强，内容传播效率高",
    tags: ["Instagram", "Reddit", "High AOV"],
  },
  {
    id: "jp",
    title: "日本",
    subtitle: "偏重审美、礼物感和细节表达",
    audienceHint: "更看重品质叙事与品牌语气",
    signal: "更适合克制、精致、轻情绪表达",
    tags: ["Minimal", "Giftable", "Detail-first"],
  },
  {
    id: "eu",
    title: "欧洲",
    subtitle: "强调可持续、设计和品牌感",
    audienceHint: "对工艺、材料和品牌故事更敏感",
    signal: "适合做长期内容资产",
    tags: ["Craft", "Sustainability", "Story"],
  },
  {
    id: "sea",
    title: "东南亚",
    subtitle: "更适合高频触达和社媒种草",
    audienceHint: "短视频与社群分发的配合更重要",
    signal: "节奏快，适合快速验证",
    tags: ["Social-first", "Fast launch", "UGC"],
  },
];

export const audienceOptions: AudienceOption[] = [
  {
    id: "creators",
    title: "独立创作者 / AI builder",
    subtitle: "需要快速验证并展示个人产品",
    painPoint: "不会写首发文案，也不想搭太重的栈。",
    outcome: "用最少内容拼出可信的 launch story。",
  },
  {
    id: "care",
    title: "自我照护 / 情绪价值用户",
    subtitle: "对仪式感、疗愈和心理安全感敏感",
    painPoint: "想被理解，但不喜欢过度营销。",
    outcome: "用更克制的叙事建立信任。",
  },
  {
    id: "gift",
    title: "礼物购买者 / 节日用户",
    subtitle: "关注包装、场景和送礼理由",
    painPoint: "想快速判断这个产品适不适合送人。",
    outcome: "把购买动机和场景直接说清楚。",
  },
];

export const hookOptions: HookOption[] = [
  {
    id: "ritual",
    title: "This is a ritual, not just a product.",
    subtitle: "把购买从消费动作转成日常仪式。",
    rationale: "适合高情绪价值和品牌感更强的产品。",
    score: 94,
  },
  {
    id: "relief",
    title: "A calm tool for busy minds.",
    subtitle: "更偏功能收益，表达更直接。",
    rationale: "更适合焦虑缓解、效率和自我照护类表达。",
    score: 88,
  },
  {
    id: "proof",
    title: "Built to convert the first 100 users.",
    subtitle: "强调可验证的首发结果。",
    rationale: "适合 SaaS、AI 工具和增长型产品。",
    score: 91,
  },
];

export const launchChannels = ["Instagram", "Reddit", "Pinterest", "TikTok"];

