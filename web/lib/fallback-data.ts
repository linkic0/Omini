import type {
  AudienceProfile,
  ChatResponse,
  ChatStage,
  ContentPerformance,
  HookOption,
  LandingData,
  MarketId,
  Metric,
  PositioningCard,
  Product,
  TrafficPoint,
  WorkspaceData,
} from "@/lib/types";

type Scenario = {
  idea: string;
  brandName: string;
  productTitle: string;
  productSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
};

const MARKET_LABELS: Record<MarketId, string> = {
  us: "北美",
  jp: "日本",
  eu: "欧洲",
  sea: "东南亚",
};

const AUDIENCES: Record<MarketId, AudienceProfile[]> = {
  us: [
    {
      id: "spiritual-seekers",
      title: "Spiritual Seekers",
      summary: "25-34 岁、重视 self-care、愿意为情绪价值和日常仪式感买单。",
      tags: ["#Z世代", "#Self-care", "#Ritual", "#Anxiety Relief"],
      painPoint: "她们想要一种有触感、可日常佩戴的情绪锚点，而不是抽象概念。",
      willingnessToPay: "$30-$50",
    },
    {
      id: "gift-driven",
      title: "Meaningful Gift Buyers",
      summary: "节日和生日送礼人群，偏好有故事、有象征意义的礼物。",
      tags: ["#Giftable", "#Story-first", "#Holiday"],
      painPoint: "需要一个既有颜值又有明确寓意的礼物，不想送无记忆点的普通饰品。",
      willingnessToPay: "$35-$60",
    },
  ],
  jp: [
    {
      id: "quiet-healing",
      title: "Quiet Healing Professionals",
      summary: "重视细节、偏爱克制审美，希望产品在生活中自然融入。",
      tags: ["#治愈系", "#极简", "#精致日常"],
      painPoint: "不喜欢张扬的营销表达，更在意工艺、材质与长期陪伴感。",
      willingnessToPay: "¥4,500-¥7,500",
    },
    {
      id: "ritual-lovers",
      title: "Ritual-first Lifestyle Lovers",
      summary: "偏好带有仪式感和日常秩序感的生活方式消费。",
      tags: ["#仪式感", "#礼赠", "#美学"],
      painPoint: "需要一个有明确生活场景的产品，而不是纯概念化叙事。",
      willingnessToPay: "¥5,000-¥8,000",
    },
  ],
  eu: [
    {
      id: "mindful-design",
      title: "Mindful Design Enthusiasts",
      summary: "重视 sustainable / crafted / design-led 的消费体验。",
      tags: ["#Crafted", "#Design-led", "#Mindfulness"],
      painPoint: "需要产品既有 aesthetic credibility，又有可被相信的价值表达。",
      willingnessToPay: "€35-€55",
    },
    {
      id: "slow-living",
      title: "Slow Living Community",
      summary: "偏好低刺激、慢节奏、强调品质而非跟风的消费方式。",
      tags: ["#Slow living", "#Conscious buying", "#Wellness"],
      painPoint: "讨厌过度营销，希望看到真实工艺、真实材质和清晰故事。",
      willingnessToPay: "€40-€65",
    },
  ],
  sea: [
    {
      id: "trend-aware",
      title: "Trend-aware Young Buyers",
      summary: "爱社媒、看重颜值和分享属性，希望产品有明显的拍照氛围。",
      tags: ["#Social-first", "#Affordable luxe", "#Lifestyle"],
      painPoint: "需要价格友好但不廉价、适合展示与分享的产品。",
      willingnessToPay: "$20-$35",
    },
    {
      id: "wellness-curious",
      title: "Wellness-curious Newcomers",
      summary: "对疗愈和生活方式内容好奇，但还处在入门阶段。",
      tags: ["#Beginner-friendly", "#Affordable", "#Discovery"],
      painPoint: "需要简单、清晰、低门槛的表达，而不是一堆专业术语。",
      willingnessToPay: "$18-$30",
    },
  ],
};

const HOOKS: Record<MarketId, HookOption[]> = {
  us: [
    {
      id: "wear-your-intention",
      title: "Wear Your Intention",
      subtitle: "把情绪价值和 self-care 语境直接说透，最贴近 Figma 方案。",
      heat: 94,
    },
    {
      id: "anxiety-relief",
      title: "Anxiety Relief You Can Touch",
      subtitle: "把抽象情绪支持转成具体可感知的实体产品。",
      heat: 87,
    },
    {
      id: "ritual-object",
      title: "Not Just Jewelry, It's Your Ritual",
      subtitle: "强调仪式感和日常锚点，区分普通饰品。",
      heat: 82,
    },
  ],
  jp: [
    {
      id: "quiet-balance",
      title: "静かに整う、毎日のリズム",
      subtitle: "更克制的治愈表达，适配日本市场语气。",
      heat: 91,
    },
    {
      id: "small-ritual",
      title: "A Small Ritual for Gentle Days",
      subtitle: "强调小而确定的秩序感和日常陪伴。",
      heat: 86,
    },
    {
      id: "crafted-calm",
      title: "Crafted Calm, Worn Daily",
      subtitle: "突出细节工艺与长期佩戴价值。",
      heat: 79,
    },
  ],
  eu: [
    {
      id: "crafted-intention",
      title: "Crafted with Intention",
      subtitle: "适合 design-led 与 crafted 叙事。",
      heat: 90,
    },
    {
      id: "modern-ritual",
      title: "A Modern Ritual for Slow Living",
      subtitle: "对慢生活与身心平衡人群更友好。",
      heat: 84,
    },
    {
      id: "design-meets-wellness",
      title: "Where Design Meets Inner Calm",
      subtitle: "把 aesthetic 和 wellbeing 统一到一起。",
      heat: 80,
    },
  ],
  sea: [
    {
      id: "wearable-energy",
      title: "Wearable Energy, Everyday Style",
      subtitle: "兼顾生活方式表达与上身效果。",
      heat: 88,
    },
    {
      id: "shareable-wellness",
      title: "Wellness You Can Style and Share",
      subtitle: "更适合社媒传播和内容种草。",
      heat: 85,
    },
    {
      id: "entry-luxury",
      title: "An Easy First Step Into Crystal Rituals",
      subtitle: "降低理解门槛，适合新手市场。",
      heat: 78,
    },
  ],
};

function inferScenario(idea: string): Scenario {
  if (idea.includes("水晶") || idea.toLowerCase().includes("crystal")) {
    return {
      idea,
      brandName: "Crystal Flow",
      productTitle: "Crystal Flow | 手工能量水晶手链",
      productSubtitle: "每一条手链都是独一无二的能量伙伴",
      heroTitle: "Wear Your Intention",
      heroSubtitle: "Handmade Crystal Bracelets for Mindful Living",
    };
  }

  return {
    idea,
    brandName: "Launch Prism",
    productTitle: "Launch Prism | 出海首发实验款",
    productSubtitle: "把产品卖点、市场语气和首发资产一次打包",
    heroTitle: "Launch with a sharper story",
    heroSubtitle: "Clear positioning, a grounded GTM plan, and a storefront that feels ready.",
  };
}

export function getMarketLabel(market: MarketId) {
  return MARKET_LABELS[market];
}

export function getAudienceOptions(market: MarketId) {
  return AUDIENCES[market];
}

export function getHookOptions(market: MarketId) {
  return HOOKS[market];
}

export function createChatFallback(input: {
  idea: string;
  stage?: ChatStage;
  market?: MarketId;
}): ChatResponse {
  const idea = input.idea.trim() || "手工编织的水晶手链";
  const stage = input.stage ?? "market";

  if (stage === "market") {
    return {
      stage,
      suggestedIdea: idea,
      assistant: `收到，我先把这个 idea 理解成“${idea}”。你想优先打哪个海外市场？不同市场对定价、语气和卖点接受度差别会很大。`,
      options: [
        { id: "us", label: "北美", description: "最适合 demo 的增长叙事，强调 self-care 与直接转化。" },
        { id: "jp", label: "日本", description: "更克制、更精致，强调工艺与仪式感。" },
        { id: "eu", label: "欧洲", description: "适合 crafted / design-led 的品牌表达。" },
        { id: "sea", label: "东南亚", description: "社媒感更强，适合高传播性内容。" },
      ],
    };
  }

  if (stage === "audience") {
    const market = input.market ?? "us";
    return {
      stage,
      suggestedIdea: idea,
      assistant: `如果先看 ${getMarketLabel(market)}，我建议你别泛泛说“所有人都能买”，而是先锁一个最可能成交的人群。`,
      options: getAudienceOptions(market).map((item) => ({
        id: item.id,
        label: item.title,
        description: item.summary,
        badge: item.willingnessToPay,
      })),
    };
  }

  if (stage === "hook") {
    const market = input.market ?? "us";
    return {
      stage,
      suggestedIdea: idea,
      assistant: `接下来我需要一个能打穿首页 Hero 和广告素材的一句话卖点。先从这三个方向里选一个最强的。`,
      options: getHookOptions(market).map((item) => ({
        id: item.id,
        label: item.title,
        description: item.subtitle,
        badge: `${item.heat}%`,
      })),
    };
  }

  return {
    stage: "done",
    suggestedIdea: idea,
    assistant: "信息够了。我会基于这些选择生成定位卡、GTM Workspace 和对外预览站。",
    options: [],
  };
}

export function createPositioningFallback(input: {
  idea: string;
  market: MarketId;
  audienceId?: string;
  hookId?: string;
}): PositioningCard {
  const scenario = inferScenario(input.idea);
  const audience =
    AUDIENCES[input.market].find((item) => item.id === input.audienceId) ??
    AUDIENCES[input.market][0];
  const hooks = HOOKS[input.market];
  const hook =
    hooks.find((item) => item.id === input.hookId) ??
    hooks[0];

  return {
    productTitle: scenario.productTitle,
    productSubtitle: scenario.productSubtitle,
    marketLabel: getMarketLabel(input.market),
    marketInsight: `${getMarketLabel(input.market)} 市场里，“情绪价值 + 可佩戴 + 有故事感”的产品更容易形成首波传播。`,
    targetAudience: audience,
    hooks,
    selectedHook: hook.id,
    brandName: scenario.brandName,
    oneLiner: hook.title,
    localizationAngle: `把 ${scenario.brandName} 定义成一个能帮助用户表达自我、建立日常仪式感的生活方式品牌，而不是单纯饰品。`,
  };
}

function createProducts(idea: string): Product[] {
  const scenario = inferScenario(idea);

  if (scenario.brandName === "Crystal Flow") {
    return [
      {
        id: "amethyst-balance",
        name: "Amethyst Balance Bracelet",
        tagline: "Promotes calm, sleep, and a grounded daily ritual.",
        price: 35,
        originalPrice: 42,
        description:
          "Handcrafted amethyst bracelet designed as a daily emotional anchor. Each bead is selected for color, texture, and the calm visual rhythm it brings to everyday wear.",
        benefits: [
          "Promotes calm and better sleep",
          "Adds ritual to a fast routine",
          "Giftable with clear symbolism",
        ],
        accent: "from-cyan-400 to-sky-500",
        aura: "rgba(34,211,238,0.18)",
        rating: 5,
        reviews: 128,
      },
      {
        id: "rose-quartz-love",
        name: "Rose Quartz Love Bracelet",
        tagline: "Soft warmth for self-love, gifting, and gentle confidence.",
        price: 32,
        originalPrice: 40,
        description:
          "A softer visual expression for users who want emotional symbolism with everyday styling versatility.",
        benefits: [
          "Self-love narrative",
          "Works well for gifting",
          "Warm, approachable aesthetic",
        ],
        accent: "from-pink-300 to-rose-400",
        aura: "rgba(251,113,133,0.16)",
        rating: 5,
        reviews: 95,
      },
      {
        id: "clear-quartz-clarity",
        name: "Clear Quartz Clarity Bracelet",
        tagline: "A cleaner, brighter option for focus and intention setting.",
        price: 38,
        originalPrice: 45,
        description:
          "Built around a cleaner palette and a sharper message: clarity, focus, and fresh starts.",
        benefits: [
          "Clarity-first messaging",
          "Minimal visual language",
          "Pairs with everyday outfits",
        ],
        accent: "from-slate-200 to-slate-400",
        aura: "rgba(226,232,240,0.24)",
        rating: 5,
        reviews: 87,
      },
    ];
  }

  return [
    {
      id: "launch-prism-core",
      name: "Launch Prism Starter Pack",
      tagline: "A polished template to validate your first overseas launch.",
      price: 29,
      originalPrice: 49,
      description:
        "A demo offer used to showcase how Idea-to-Deploy turns one product idea into a market-ready launch stack.",
      benefits: [
        "Positioning-ready copy",
        "Landing structure included",
        "GTM narrative pre-bundled",
      ],
      accent: "from-indigo-300 to-cyan-400",
      aura: "rgba(56,189,248,0.18)",
      rating: 5,
      reviews: 42,
    },
  ];
}

function createMetrics(): Metric[] {
  return [
    { label: "曝光量", subtitle: "Impressions", value: "12.5K", change: "+23%", trend: "up" },
    { label: "点击率", subtitle: "CTR", value: "4.2%", change: "+1.1%", trend: "up" },
    { label: "转化率", subtitle: "CVR", value: "2.8%", change: "—", trend: "neutral" },
    { label: "销售额", subtitle: "Revenue", value: "$1,240", change: "+$320", trend: "up" },
  ];
}

function createTraffic(): TrafficPoint[] {
  return [
    { day: "Day 1", value: 800 },
    { day: "Day 2", value: 1200 },
    { day: "Day 3", value: 1800 },
    { day: "Day 4", value: 1500 },
    { day: "Day 5", value: 2200 },
    { day: "Day 6", value: 2800 },
    { day: "Day 7", value: 3200 },
  ];
}

function createContentPerformance(): ContentPerformance[] {
  return [
    {
      title: "产品静态图",
      type: "Post",
      views: "3.2K",
      likes: 156,
      comments: 23,
    },
    {
      title: "Reels视频",
      type: "Reels",
      views: "8.1K",
      likes: 412,
      comments: 67,
      badge: "⭐ 表现最佳",
    },
    {
      title: "投票贴纸",
      type: "Story",
      views: "1.1K",
      completion: "89% 完成率",
    },
  ];
}

export function createWorkspaceFallback(input: {
  idea: string;
  market: MarketId;
}): WorkspaceData {
  const scenario = inferScenario(input.idea);

  return {
    title: `${scenario.brandName} GTM Workspace`,
    subtitle: `基于 ${getMarketLabel(input.market)} 目标市场的 7 天启动计划`,
    channel: `${getMarketLabel(input.market)} / Instagram`,
    publishWindow: "美国周二晚 8 点（北京周三早 9 点）",
    publishCadence: "首周每日 1 条 Post + 3 条 Story",
    timeline: [
      { day: "Day 0 (T-2)", title: "账号装修 + 库存检查", description: "完成店铺装修和库存准备", active: true },
      { day: "Day 1 (Launch)", title: "INS正式发布 + Story预热", description: "正式发布产品并通过Story预热" },
      { day: "Day 2", title: "KOL转发请求 + 社群互动", description: "联系KOL并增加社群互动" },
      { day: "Day 3", title: "UGC内容转发 + 限时促销", description: "分享用户内容并推出限时优惠" },
      { day: "Day 7", title: "数据复盘 + 优化迭代", description: "分析数据并优化策略" },
    ],
    checklist: [
      { id: 1, name: "产品图片拍摄 (5主图+3场景)", completed: true },
      { id: 2, name: "定价策略确认 ($35+首单15% off)", completed: true },
      { id: 3, name: "Instagram账号装修", completed: true },
      { id: 4, name: "首发文案准备 (英文版)", completed: true },
      { id: 5, name: "支付方式接入 (Stripe)", completed: true },
      { id: 6, name: "物流方案确认", completed: false },
      { id: 7, name: "客服回复模板", completed: false },
      { id: 8, name: "库存数量检查", completed: false },
    ],
    channelRecommendation: {
      name: "Instagram",
      emoji: "IG",
      badges: ["Z 世代首选", "视觉驱动", "购物链路完整"],
      stat: "78%美国Z世代通过INS发现新品牌",
      reach: "5,000-8,000人/周",
      actionLabel: "查看发布物料",
    },
    standbyChannels: ["TikTok", "Pinterest"],
    posts: [
      {
        type: "产品故事型",
        content:
          "Wear Your Intention. Crystal Flow 把一条日常手链做成了更可感知的情绪锚点，适合送礼，也适合留给自己。",
        hashtags: "#crystalhealing #selfcare #handmadejewelry #anxietyrelief",
      },
      {
        type: "用户痛点型",
        content:
          "当生活节奏太快，人们会想要一个更具体的安定感。Crystal Flow 用更克制的材质和语气，把 calm 变成一件可以佩戴的东西。",
        hashtags: "#anxietyrelief #mentalhealth #wellnessjourney #crystals",
      },
      {
        type: "社交证明型",
        content:
          "不少第一批用户会把它当成日常穿搭里最稳定的一件配饰。视觉上足够干净，故事上也足够容易被理解和转发。",
        hashtags: "#customerreview #testimonial #crystalhealing #transformation",
      },
    ],
    storyFrames: [
      { title: "Frame 1", description: "产品特写", text: "A calmer ritual starts here", visual: "产品特写镜头" },
      { title: "Frame 2", description: "包装过程", text: "Handmade with intention", visual: "手工包装过程" },
      { title: "Frame 3", description: "CTA引导", text: "Explore the first drop", visual: "进入商品页引导" },
    ],
    hashtags: [
      "#crystalhealing",
      "#selfcare",
      "#amethyst",
      "#anxietyrelief",
      "#handmadejewelry",
      "#ritualobject",
      "#intentionsetting",
      "#mindfulgift",
    ],
    metrics: createMetrics(),
    traffic: createTraffic(),
    channelSplit: [
      { name: "Instagram", value: 70 },
      { name: "Direct", value: 20 },
      { name: "Search", value: 10 },
    ],
    contentPerformance: createContentPerformance(),
    warnings: ["紫水晶手链库存仅剩 12 件，建议补货。"],
    recommendations: ["Reels 视频表现优于静态图 62%，建议增加视频素材产出。"],
  };
}

export function createLandingFallback(input: {
  idea: string;
  market: MarketId;
}): LandingData {
  const scenario = inferScenario(input.idea);
  const products = createProducts(input.idea);

  return {
    brandName: scenario.brandName,
    eyebrow: `${getMarketLabel(input.market)} market ready`,
    heroTitle: scenario.heroTitle,
    heroSubtitle: scenario.heroSubtitle,
    heroCta: "Shop the launch",
    shippingNote: "Free shipping over $50",
    storyTitle: "Crafted for a calmer daily ritual",
    storyBody:
      "Built as a first customer-facing launch page, with a clearer story, calmer visual rhythm, and a tone that feels closer to a real brand than a mock template.",
    products,
    faqs: [
      {
        question: "Can this launch page be edited after generation?",
        answer: "可以。当前 demo 已经支持快速改标题、主视觉语气和 CTA，后续会扩展到更多版块级调整。",
      },
      {
        question: "Does this include GTM assets too?",
        answer: "包含。Workspace 会同步给出首发节奏、渠道建议、社媒物料和基础数据面板。",
      },
      {
        question: "Is the content localized by market?",
        answer: "是的。当前 demo 先以英文和北美语气为主，但结构已经为不同市场预留了切换空间。",
      },
    ],
    editPrompts: [
      "Make the hero mood calmer",
      "Lean more into gifting",
      "Push the tone toward premium wellness",
    ],
  };
}
