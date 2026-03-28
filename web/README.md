# Web App

`web/` 是仓库中唯一的可运行应用，基于 Next.js App Router，负责：

- 对外演示页面
- 对话式定位流程
- GTM Workspace
- 独立站预览与公开店铺页
- 同仓 API 路由与 GMI Cloud 调用封装

## 技术栈

- Next.js 16
- React 19
- Tailwind CSS 4
- Motion
- Recharts
- Sonner

## 页面路由

- `/`：首页，输入产品想法
- `/chat`：市场、受众、卖点选择流程
- `/workspace`：内部 GTM 工作台
- `/preview`：对外落地页预览与编辑
- `/store`：公开店铺首页
- `/store/[id]`：商品详情页

## API 路由

- `POST /api/chat`
- `POST /api/positioning`
- `POST /api/workspace`
- `POST /api/landing`

这些接口都通过 [`lib/gmi.ts`](./lib/gmi.ts) 调用 GMI Cloud；当 API key 缺失或上游失败时，会自动回退到 [`lib/fallback-data.ts`](./lib/fallback-data.ts) 中的本地 mock 数据。

## 本地开发

```bash
npm install
cp .env.example .env.local
npm run dev
```

默认地址：

```text
http://localhost:3000
```

## 环境变量

参考 `.env.example`：

```bash
GMI_API_KEY=your_key_here
GMI_BASE_URL=https://api.gmi-serving.com/v1
GMI_DEFAULT_MODEL=deepseek-ai/DeepSeek-V3.2
```

## 常用命令

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## 目录说明

```text
web/
├── app/              # 页面和 API 路由
├── components/       # 业务组件
├── lib/              # 类型、fallback 数据、GMI 调用封装
├── public/           # 图片和静态资源
├── package.json
└── tsconfig.json
```

## 当前实现边界

- 当前版本更偏演示型产品，重点是链路完整和视觉表现
- 店铺商品、FAQ、部分编辑能力仍然是模板化 / mock 驱动
- 如果要走向生产，需要继续补真实支付、持久化、内容管理和数据回流

