# 项目背景与目标

## 黑客松信息

| 项目 | 内容 |
|------|------|
| **赛道** | 出海方向 (Global) |
| **截止时间** | 2026-03-28 17:00 |
| **路演要求** | 4分钟讲解 + 1分钟评委提问，至少1名队员到场 |

## 提交 Checklist

- [ ] **可运行 Demo**（可现场演示，建议资源本地部署或备份）
- [ ] **代码仓库链接**（GitHub，可选开源）
- [ ] **项目文档**：项目简介、技术架构、Agent 设计、GMI Cloud 使用说明、商业价值分析
- [ ] **路演 PPT**（不超过 15 页） + **演示视频**（3 分钟）

---

## 项目定位

### 产品名称

**Idea-to-Deploy** — "一键从想法到上线"

### 一句话定义

> "We don't help you build your product. We help you win your first 100 users."

### 核心解决的问题

帮助**个人卖家/中小初创/独立开发者**，把一句产品想法变成一个能拿去海外市场的**首发落地包**。

用户画像 | 痛点
---|---
独立开发者 | 不会定位海外市场、不会写英文首发文案
小团队/AI 创业者 | 不会定价、不懂各国文化差异
数字产品卖家 | 不会准备 launch assets（落地页、社媒物料、GTM 计划）

### 产品核心流程

```
输入一句想法 → 引导提问对话 → 确认目标市场+消费者画像+产品定位 → 生成定位卡片 → 生成 Landing Page
```

### 三大模块

#### 1. Idea → Market Definition（输入模块，Chatbox 形式）
- 输入一句想法
- 通过对话明确：target market（国家）、target audience（消费者画像）、product positioning（一句话卖点）
- 输出：**出海定位卡片**

#### 2. Localization Engine（本地化核心模块）
- 多语言文案生成（Demo 只做英文）
- 投放社交平台选择（Demo 以 INS 为例）
- Tone 适配 + 文化适配
- Demo 展示：同一产品美国版 vs 日本版对比

#### 3. 两个视图的落地页
- **对内页 - GTM Workspace**：给商家自己看的操作面板
  - GTM plan、发布前 checklist、首发渠道建议、发布物料
  - 发布后看板（SEO 关键词、定价建议、数据 mock）
- **对外页 - Landing Page**：给最终消费者看的独立站页面
  - 品牌 banner、商品页、Q&A
  - 支持预览和自然语言编辑

---

## 竞品分析

### 现有解决方案的问题

| 方案 | 特点 | 问题 |
|------|------|------|
| **一体化工具组合**（Webflow + ChatGPT + Stripe...） | 极快上线 | 上限一般，需要手动串联 |
| **增长型模块化 stack** | AI agent + 多渠道 + CRM | 太重，不适合个人/小团队 |
| **Accio Work**（阿里国际） | 企业任务自动化 | 工具导向，非增长导向 |
| **Partnerly** | GTM 系统构建服务 | 太重、需要人、偏 B2B SaaS |

### 我们的差异点

- **轻量版 GTM OS**：不需要人、不需要时间，AI 一键生成
- **增长导向**，而不是工具导向
- **面向个人/小团队**，而非企业级

---

## 团队分工

| 角色 | 负责内容 |
|------|---------|
| **开发（AI/Claude）** | 全栈代码实现：前端 UI + 后端 API + AI Agent 编排 |
| **@Elina** | 路演 PPT（≤15 页）+ 演示视频（3 分钟） |
| **其他成员** | 产品规划、现场路演 |

---

## 技术架构

### 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **前端** | Next.js + React + Tailwind CSS | 美观、高级、上档次的 UI |
| **后端 API** | Next.js API Routes | 与前端同一项目 |
| **AI 模型** | GMI Cloud Inference API (OpenAI 兼容) | 主力: DeepSeek-V3.2，高质量: Claude Sonnet 4.6 |
| **AI SDK** | OpenAI SDK / Vercel AI SDK | 流式对话、结构化输出 |
| **部署** | Vercel / 本地演示 | 快速部署 |

### 架构图

```
┌─────────────────────────────────────────────────┐
│                  Frontend (Next.js)              │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Chat UI  │  │ Position │  │ Landing Page  │  │
│  │ (对话)    │  │ Card(卡片)│  │ Preview(预览) │  │
│  └────┬─────┘  └────┬─────┘  └──────┬────────┘  │
│       │              │               │            │
│  ┌────┴──────────────┴───────────────┴─────────┐ │
│  │           API Routes (Backend)               │ │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐ │ │
│  │  │ Chat    │ │ Generate │ │ Landing Page  │ │ │
│  │  │ Agent   │ │ Agent    │ │ Generator     │ │ │
│  │  └────┬────┘ └────┬─────┘ └──────┬────────┘ │ │
│  └───────┼───────────┼──────────────┼──────────┘ │
└──────────┼───────────┼──────────────┼────────────┘
           │           │              │
     ┌─────┴───────────┴──────────────┴──────┐
     │         GMI Cloud Inference API        │
     │  (OpenAI 兼容, DeepSeek/Claude/Qwen)   │
     └────────────────────────────────────────┘
```

### AI Agent 设计

| Agent | 职责 | 使用模型 |
|-------|------|---------|
| **Chat Agent** | 多轮对话引导用户明确 market/audience/positioning | DeepSeek-V3.2 |
| **Positioning Agent** | 生成结构化定位卡片（JSON） | DeepSeek-V3.2 (JSON mode) |
| **Localization Agent** | 生成英文营销文案、tone 适配 | Claude Sonnet 4.6 |
| **Landing Page Agent** | 生成完整的 HTML Landing Page | Qwen3 Coder 或 GPT-5.4 |
| **GTM Agent** | 生成 GTM 策略、checklist、渠道建议 | DeepSeek-V3.2 |
