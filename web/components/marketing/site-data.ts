export type LaunchStat = {
  value: string;
  label: string;
  note: string;
};

export type FlowStep = {
  title: string;
  description: string;
  eyebrow: string;
};

export type WorkspacePanel = {
  title: string;
  description: string;
  items: string[];
  accent: string;
};

export const heroStats: LaunchStat[] = [
  {
    value: "01",
    label: "Idea entry",
    note: "从一句想法开始，不需要产品文档。",
  },
  {
    value: "02",
    label: "Positioning output",
    note: "锁定市场、受众、卖点和渠道建议。",
  },
  {
    value: "03",
    label: "Launch-ready preview",
    note: "把 GTM 工作台和独立站预览串成一条链路。",
  },
];

export const flowSteps: FlowStep[] = [
  {
    eyebrow: "Step 01",
    title: "输入一句想法",
    description:
      "用户只要给出一个产品想法，就能开始生成路径，不需要先准备复杂 brief。",
  },
  {
    eyebrow: "Step 02",
    title: "生成定位卡",
    description:
      "系统会把市场、受众、卖点、渠道和首发角度整理成一个高密度定位卡。",
  },
  {
    eyebrow: "Step 03",
    title: "进入工作台与预览页",
    description:
      "同一份结构化结果继续驱动内部 GTM 面板和对外 Landing 预览。",
  },
];

export const workspacePanels: WorkspacePanel[] = [
  {
    title: "GTM Workspace",
    description: "内部执行页",
    items: [
      "Launch checklist",
      "Channel suggestion",
      "SEO keywords",
      "Analytics snapshot",
    ],
    accent: "from-cyan-500/25 via-sky-500/15 to-indigo-500/25",
  },
  {
    title: "Landing Preview",
    description: "对外独立站",
    items: [
      "Hero copy",
      "Product story",
      "FAQ block",
      "CTA and trust signals",
    ],
    accent: "from-fuchsia-500/20 via-rose-500/10 to-orange-500/20",
  },
];

export const previewCards = [
  {
    title: "Idea",
    description: "一句话输入，先把产品边界说清楚。",
  },
  {
    title: "GTM",
    description: "把上线动作收敛成清晰 checklist 和渠道建议。",
  },
  {
    title: "Launch",
    description: "把结构化结果推到对外预览页，直接展示成品感。",
  },
];
