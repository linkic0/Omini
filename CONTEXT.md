# 黑客松项目上下文

## 项目定位
面向有出海需求的小白卖家的 Go-to-Market 产品。

## 团队分工
- **其他成员**：Agent 聊天制定出海方案（生成卡片）+ Instagram 营销内容生成
- **Charlie 负责**：
  1. 用户数据展示面板（Ins 数据 + 产品销售数据）
  2. 一键部署独立站（套模板接 Shopify）

---

## 功能一：数据展示面板

### 设计原则
不做数据大屏，做"决策面板"——回答"我现在做得怎么样，下一步该怎么做"

### 面板模块
1. **健康度评分**（顶部总览）
2. **核心指标卡片**：Ins 互动 / 独立站流量 / 销售 GMV
3. **内容表现排行**：哪条帖子带来了最多销售（Ins → 销售归因）
4. **市场反馈信号**：评论关键词 + 情感分析（正面/负面占比）

### 数据来源（Mock）
- Instagram 数据：直接 mock JSON，跳过 Facebook API 注册
- 销售数据：Shopify API（演示用 Dev Store）
- 情感分析：Claude API 跑评论

### Mock 数据结构
```javascript
const mockInsData = {
  followers: 12400,
  followerGrowth: '+8.3%',
  posts: [
    { id: 1, likes: 342, comments: 28, clicks: 89, orders: 5 },
    { id: 2, likes: 218, comments: 15, clicks: 43, orders: 2 },
  ],
  topHashtags: ['#handmade', '#shopsmall', '#ootd'],
  sentimentScore: { positive: 72, neutral: 20, negative: 8 }
}
```

---

## 功能二：一键部署独立站

### 核心流程
1. 选模板（按品类推荐，3-5个）
2. 填基础信息（品牌名、Logo、主色调，从 GTM 方案自动带入）
3. 连接 Shopify（OAuth 或 API Key）
4. 一键部署 → 返回预览链接

### Shopify 方案
- 注册 **Shopify Partners**（免费）→ 创建 Development Store
- 用 Shopify Admin API 操作主题和产品
- 演示时用自己的 Dev Store，不需要评委走 OAuth

### 技术实现核心
```javascript
const deployStore = async (userConfig) => {
  const theme = await shopify.themes.create({ name: userConfig.brandName })
  await shopify.assets.update(theme.id, {
    key: 'config/settings_data.json',
    value: generateThemeConfig(userConfig)
  })
  await syncProducts(userConfig.products)
  return `${userConfig.shopDomain}/preview`
}
```

### 品牌配置自动生成（Claude）
- 输入：品牌名 + 主色 + Logo
- 输出：Slogan、About Us 文案、首页 Banner、SEO Meta

---

## 核心亮点：Ins-销售闭环
```
Ins 发帖 → 带流量到独立站 → 产生销售
    ↑                              ↓
    └──── 面板显示哪条帖子效果好 ←──┘
```

---

## 技术栈（待定）
- Frontend: Next.js + Tailwind CSS
- 图表: Recharts 或 Chart.js
- AI: Claude API（情感分析 + 品牌文案生成）
- 独立站: Shopify Admin API + Partners Dev Store

## MVP 优先级
| 功能 | 优先级 |
|------|--------|
| 面板核心指标展示（mock 数据） | P0 |
| Shopify OAuth 连接 | P0 |
| 模板选择 + 部署（1-2个模板） | P0 |
| 评论情感分析（Claude） | P1 |
| Ins-销售归因模块 | P1 |

---

## 当前状态
- 项目目录：`/Users/charlie/omini`
- 环境变量：`.env` 中有 `ANTHROPIC_API_KEY`
- 代码框架：**尚未初始化**，下次继续从 `npx create-next-app` 开始
