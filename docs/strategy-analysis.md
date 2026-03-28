# 项目战略分析与建议

> 编写时间: 2026-03-27
> 黑客松截止: 2026-03-28 17:00

---

## 1. 项目评估

### 方向判断：方向正确，痛点真实

个人开发者/小团队出海确实卡在"从想法到首发"这一步——不懂定位、不会写英文文案、不知道怎么冷启动。市场上没有一个工具能把这些**一次性打包解决**。

### 当前方案风险

| 风险 | 说明 |
|------|------|
| **范围过大** | 对话 + 定位卡片 + GTM Workspace + Landing Page + 本地化对比 + 数据看板，在截止前全部完成压力极大 |
| **技术架构缺失** | 原方案未提及技术栈、AI 模型选型、GMI Cloud 接入方式 |
| **模块边界模糊** | 对话模块到生成模块的数据流不清晰 |
| **面子 vs 里子** | 评委 4 分钟路演，真正能看到的就是 2-3 个核心界面。与其 5 个模块都做到 60 分，不如 3 个核心模块做到 90 分 |
| **部分内容缺失** | 落地页产品对比表为空、工作流部分为空 |
| **发布后数据看板不现实** | Demo 场景下没有真实流量，需要 mock 数据 |

---

## 2. 冲奖策略

### 评委关注点

评委在 4 分钟内关注：**创新性 + 实用性 + 完成度 + GMI Cloud 的使用**

### 核心策略：制造一个 "Wow Moment"

| 优先级 | 要做的 | 效果 |
|--------|--------|------|
| **P0 核心演示链路** | 输入 "I want to sell an AI-powered resume builder" → 3 轮对话 → 生成精美定位卡片 → **一键生成可打开的英文独立站** | 这就是 Wow Moment |
| **P0 界面质量** | 参照 Figma 设计，做出高级感 UI | 第一印象决定评委态度 |
| **P1 GTM Workspace** | 展示生成的 launch plan、checklist | 体现"不止是建站工具" |
| **P1 项目文档** | Agent 设计图、GMI Cloud 使用说明 | 技术加分项 |
| **P2 本地化对比** | 美国版 vs 日本版 | 时间够就做，锦上添花 |

### 建议路演节奏（4 分钟）

```
[0:00-0:30] 痛点描述："80% 的出海小团队死在首发前"
[0:30-1:30] 核心演示：输入想法 → AI 对话 → 生成定位卡片（流式输出，视觉冲击力）
[1:30-2:30] Wow Moment：一键生成 Landing Page（打开浏览器展示真实页面）
[2:30-3:30] GTM Workspace 展示 + 商业价值分析
[3:30-4:00] 技术架构 + GMI Cloud 使用总结
```

---

## 3. 差异化竞争分析

### 核心差异化定位："首发前的最后一公里"

| 维度 | Accio Work | Partnerly | Webflow+ChatGPT | **我们 (Idea-to-Deploy)** |
|------|-----------|-----------|-----------------|--------------------------|
| 目标用户 | 中小企业 | B2B 公司 | 技术人员 | **个人/小团队** |
| 交付物 | 自动化流程 | GTM 系统 | 单个网站 | **完整首发包** |
| 时间成本 | 需配置 | 需周/月 | 需天 | **5分钟** |
| 核心价值 | 工具效率 | 系统化 | 建站 | **增长导向** |
| AI 集成 | 有 | 无 | 拼凑 | **AI Native** |

### 三个差异化杀手锏

1. **"5 分钟出海"** — 从一句话到完整首发落地包（定位+文案+Landing Page+GTM Plan），竞品都做不到这个速度
2. **增长导向 vs 工具导向** — 不是帮你建网站，是帮你获取前 100 个用户。输出的每样东西都指向增长（SEO 关键词、社媒文案、定价策略）
3. **AI Native** — 不是在传统工具上加 AI，是用 AI 重新定义出海首发流程。对话式交互，零学习成本

---

## 4. 构建方案

### 核心决策：砍到 3 个核心屏幕

**Screen 1: Chat 对话界面**
- 用户输入一句 idea
- AI 引导 3-4 轮对话，收集 market / audience / positioning
- 流式输出，体验流畅

**Screen 2: 定位卡片 + GTM Dashboard**
- 对话结束后自动生成定位卡片（精美卡片组件）
- GTM Plan、Launch Checklist、渠道建议
- 一键 "Generate Landing Page" 按钮

**Screen 3: Landing Page 预览**
- 实时预览生成的英文独立站
- 支持简单的自然语言编辑（"make the hero section more bold"）
- 导出 HTML

### 技术路线

```
前端框架: Next.js 14 (App Router) + React
样式系统: Tailwind CSS + shadcn/ui（高质量 UI 组件）
AI 接入: GMI Cloud Inference API (OpenAI SDK 兼容)
流式对话: Vercel AI SDK
结构化输出: JSON Mode
代码生成: AI 生成 HTML Landing Page
部署: Vercel / 本地演示
```

### AI Agent 编排

```
用户输入 idea
    │
    ▼
┌─────────────────┐
│   Chat Agent    │  ← DeepSeek-V3.2（便宜、快、多轮对话）
│  引导 3-4 轮对话  │
│  收集结构化信息    │
└────────┬────────┘
         │ 输出: { market, audience, positioning, product_type }
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Positioning     │     │ GTM Agent       │  ← DeepSeek-V3.2 (JSON mode)
│ Agent           │     │ 生成 GTM 策略     │
│ 生成定位卡片      │     │ Checklist       │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│ Localization    │     │ Landing Page    │  ← Qwen3 Coder / GPT-5.4
│ Agent           │     │ Generator       │
│ 英文文案+tone     │     │ 生成完整 HTML     │
└─────────────────┘     └─────────────────┘
```

### 模型选型策略

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 用户对话引导（多轮） | `deepseek-ai/DeepSeek-V3.2` | $0.20/$0.32 per M tokens，极便宜，对话能力强 |
| 定位卡片生成（JSON） | `deepseek-ai/DeepSeek-V3.2` | 支持 JSON mode |
| 英文营销文案 | `anthropic/claude-sonnet-4.6` | 英文写作质量高 |
| Landing Page HTML | `Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8` | 代码生成能力强 |
| GTM 策略生成 | `deepseek-ai/DeepSeek-V3.2` | 综合能力好、性价比高 |

---

## 5. 风险应对

| 风险 | 应对 |
|------|------|
| 时间不够 | 严格按 P0/P1/P2 优先级砍功能，P0 必须完成 |
| AI 生成的 HTML 质量不稳定 | 准备 2-3 套预设模板，AI 在模板基础上生成 |
| GMI Cloud API 不稳定 | 本地缓存演示数据，确保路演不出问题 |
| 界面不够美观 | 参照 Figma 设计稿，使用 shadcn/ui 组件库 |
| 对话引导不够智能 | 精心设计 system prompt，固定对话结构 |
