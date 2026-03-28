# Omini5 / Idea-to-Deploy

Idea-to-Deploy 是一个面向出海场景的 Next.js Demo：把一句产品想法串成定位卡、GTM Workspace 和独立站预览，适合黑客松演示、产品概念验证和路演展示。

当前仓库采用单仓一体化结构：

- `web/`：唯一可运行的 Next.js 应用，包含前端页面、App Router API 和 AI 调用封装
- `docs/`：项目定位、策略分析和 GMI Cloud 接入说明
- `images/`、`02Global.md`：早期方案材料与视觉参考

## 当前状态

- 已完成核心演示链路：`首页 -> Chat -> Positioning -> Workspace -> Preview -> Store`
- 前后端在同一个 Next.js 应用内，通过 `app/api/*` 提供服务端接口
- 支持 GMI Cloud 在线生成，也支持本地 fallback 数据兜底，便于现场演示
- 当前更接近“高完成度 Demo”，不是完整商用系统

## 功能概览

- 输入一句产品想法，进入出海定位流程
- 选择目标市场、目标人群和一句话卖点
- 生成定位卡和内部 GTM Workspace
- 生成对外独立站预览页，并支持简单自然语言改稿
- 打开公开店铺页和商品详情页进行完整演示

## 项目结构

```text
.
├── README.md
├── docs/
│   ├── gmi-cloud-api.md
│   ├── project-overview.md
│   └── strategy-analysis.md
├── images/
├── 02Global.md
└── web/
    ├── app/
    │   ├── api/
    │   ├── chat/
    │   ├── preview/
    │   ├── store/
    │   └── workspace/
    ├── components/
    ├── lib/
    ├── public/
    ├── package.json
    └── README.md
```

## 本地运行

要求：

- Node.js 20+
- npm 10+

启动方式：

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

默认访问：

- `http://localhost:3000/`

## 环境变量

在 `web/.env.local` 中配置：

```bash
GMI_API_KEY=your_key_here
GMI_BASE_URL=https://api.gmi-serving.com/v1
GMI_DEFAULT_MODEL=deepseek-ai/DeepSeek-V3.2
```

说明：

- 未配置 `GMI_API_KEY` 时，接口会自动返回 fallback 数据
- 因此项目即使没有真实模型调用，也可以完成大部分演示链路

## 部署建议

不建议直接部署到 GitHub Pages，因为当前项目包含：

- Next.js App Router API 路由
- 依赖服务端环境变量的模型调用
- 动态路由和按需服务端渲染页面

推荐部署方式：

- Vercel
- Netlify Functions
- Cloudflare Pages Functions

如果只是做纯静态展览，需要额外裁掉 API 路由并改成纯前端数据流。

## 相关文档

- [项目背景与目标](./docs/project-overview.md)
- [项目战略分析](./docs/strategy-analysis.md)
- [GMI Cloud API 接入说明](./docs/gmi-cloud-api.md)
- [Web 应用开发说明](./web/README.md)

