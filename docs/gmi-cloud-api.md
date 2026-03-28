# GMI Cloud API 接入指南

## 概述

GMI Cloud 提供 **OpenAI 兼容** 的 Inference API，可以直接使用 OpenAI SDK 接入。本项目通过 GMI Cloud 调用 LLM 完成对话引导、内容生成、HTML 生成等核心功能。

---

## 基本信息

| 项目 | 值 |
|------|-----|
| **API Base URL** | `https://api.gmi-serving.com/v1` |
| **认证方式** | Bearer Token (`Authorization: Bearer <GMI_API_KEY>`) |
| **API 格式** | OpenAI 兼容 (`/v1/chat/completions`, `/v1/models`) |
| **环境变量** | `GMI_API_KEY` (已配置) |

---

## 可用模型（实时从 API 获取，2026-03-27）

### 推荐模型（按项目需求排序）

| 模型 ID | 名称 | 上下文长度 | 输入价格/M tokens | 输出价格/M tokens | 推荐用途 |
|---------|------|-----------|------------------|------------------|---------|
| `deepseek-ai/DeepSeek-V3.2` | DeepSeek V3.2 | 163K | $0.20 | $0.32 | **主力模型：对话+内容生成（极便宜）** |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` | Qwen3 235B | 262K | $0.15 | $0.58 | 备选：复杂推理任务 |
| `deepseek-ai/DeepSeek-V3-0324` | DeepSeek V3 | 163K | $0.18 | $0.60 | 备选：性价比高 |
| `openai/gpt-4o-mini` | GPT-4o-mini | 131K | $0.15 | $0.60 | 备选：快速响应 |
| `bytedance/seed-2.0-mini` | Seed 2.0 Mini | 262K | $0.10 | $0.40 | **最便宜：简单任务** |

### 高质量模型（用于关键生成环节）

| 模型 ID | 名称 | 上下文长度 | 输入价格/M tokens | 输出价格/M tokens |
|---------|------|-----------|------------------|------------------|
| `anthropic/claude-sonnet-4.6` | Claude Sonnet 4.6 | 409K | $3.00 | $15.00 |
| `openai/gpt-5.4` | GPT-5.4 | 409K | $2.50 | $15.00 |
| `google/gemini-3.1-pro-preview` | Gemini 3.1 Pro | 1M | $2.00 | $12.00 |

### 全部可用模型

```
anthropic/claude-opus-4.6, anthropic/claude-opus-4.5, anthropic/claude-opus-4.1
anthropic/claude-sonnet-4.6, anthropic/claude-sonnet-4.5, anthropic/claude-sonnet-4
anthropic/claude-haiku-4.5
openai/gpt-5.4-pro, openai/gpt-5.4, openai/gpt-5.4-mini, openai/gpt-5.4-nano
openai/gpt-5.2, openai/gpt-5.2-chat, openai/gpt-5.2-codex
openai/gpt-5.1, openai/gpt-5.1-chat, openai/gpt-5
openai/gpt-5.3-codex
openai/gpt-4o, openai/gpt-4o-mini
google/gemini-3.1-pro-preview, google/gemini-3.1-flash-lite-preview
deepseek-ai/DeepSeek-V3.2, deepseek-ai/DeepSeek-V3-0324, deepseek-ai/DeepSeek-R1-0528
Qwen/Qwen3.5-397B-A17B, Qwen/Qwen3.5-122B-A10B, Qwen/Qwen3.5-35B-A3B, Qwen/Qwen3.5-27B
Qwen/Qwen3-Next-80B-A3B-Instruct, Qwen/Qwen3-Next-80B-A3B-Thinking
Qwen/Qwen3-235B-A22B-Instruct-2507-FP8, Qwen/Qwen3-235B-A22B-Thinking-2507-FP8
Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8
moonshotai/Kimi-K2.5, moonshotai/Kimi-K2-Instruct-0905, moonshotai/Kimi-K2-Thinking
zai-org/GLM-5-FP8, zai-org/GLM-4.7-FP8
MiniMaxAI/MiniMax-M2.7, MiniMaxAI/MiniMax-M2.5
bytedance/seed-2.0-mini
```

---

## API 调用示例

### JavaScript/TypeScript（使用 OpenAI SDK）

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.GMI_API_KEY,
  baseURL: 'https://api.gmi-serving.com/v1',
});

// 基本对话
async function chat(messages: OpenAI.ChatCompletionMessageParam[]) {
  const response = await client.chat.completions.create({
    model: 'deepseek-ai/DeepSeek-V3.2',
    messages,
    max_tokens: 4096,
  });
  return response.choices[0].message.content;
}

// 流式输出
async function chatStream(messages: OpenAI.ChatCompletionMessageParam[]) {
  const stream = await client.chat.completions.create({
    model: 'deepseek-ai/DeepSeek-V3.2',
    messages,
    max_tokens: 4096,
    stream: true,
  });
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }
}

// JSON 模式输出（用于结构化数据）
async function chatJSON(messages: OpenAI.ChatCompletionMessageParam[]) {
  const response = await client.chat.completions.create({
    model: 'deepseek-ai/DeepSeek-V3.2',
    messages,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(response.choices[0].message.content || '{}');
}

// 函数调用 / 工具使用
async function chatWithTools(
  messages: OpenAI.ChatCompletionMessageParam[],
  tools: OpenAI.ChatCompletionTool[]
) {
  const response = await client.chat.completions.create({
    model: 'deepseek-ai/DeepSeek-V3.2',
    messages,
    tools,
    max_tokens: 4096,
  });
  return response.choices[0];
}
```

### cURL 示例

```bash
# 基本对话
curl -X POST "https://api.gmi-serving.com/v1/chat/completions" \
  -H "Authorization: Bearer $GMI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-ai/DeepSeek-V3.2",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ],
    "max_tokens": 4096
  }'

# 获取模型列表
curl -X GET "https://api.gmi-serving.com/v1/models" \
  -H "Authorization: Bearer $GMI_API_KEY"
```

---

## API 参数说明

### Chat Completions 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 | 模型 ID |
| `messages` | array | 是 | 对话消息数组 |
| `max_tokens` | int | 否 | 最大生成 token 数，默认 2000 |
| `temperature` | float | 否 | 采样温度 0-2，默认 1 |
| `top_p` | float | 否 | Top-P 采样 |
| `stream` | bool | 否 | 是否流式输出 |
| `response_format` | object | 否 | `{"type": "json_object"}` 强制 JSON 输出 |
| `tools` | array | 否 | 函数调用工具定义 |
| `stop` | array | 否 | 停止序列，最多 4 个 |
| `frequency_penalty` | float | 否 | 频率惩罚 -2 到 2 |
| `presence_penalty` | float | 否 | 存在惩罚 -2 到 2 |

### 关键注意事项

1. **max_tokens 默认值较低**（2000），生成长内容（如 HTML 页面）时需要显式设置为 4096 或更高
2. **上下文超出行为**：默认 `truncate`（截断而非报错）
3. **支持 Function Calling**：通过 `tools` 参数传入工具定义
4. **支持 JSON Mode**：`response_format: {"type": "json_object"}` 确保输出为合法 JSON

---

## 项目中的模型选型策略

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 用户对话引导（多轮） | `deepseek-ai/DeepSeek-V3.2` | 便宜、快、对话能力强 |
| 定位卡片生成（JSON） | `deepseek-ai/DeepSeek-V3.2` | 支持 JSON mode |
| 英文营销文案生成 | `anthropic/claude-sonnet-4.6` 或 `openai/gpt-5.4` | 英文写作质量高 |
| Landing Page HTML 生成 | `Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8` 或 `openai/gpt-5.4` | 代码生成能力强 |
| GTM 策略生成 | `deepseek-ai/DeepSeek-V3.2` | 综合能力好、性价比高 |

---

## MCP 集成（可选）

GMI Cloud 提供 MCP Server 用于搜索其文档：

- **MCP Endpoint**: `https://docs.gmicloud.ai/mcp`
- **工具**: `search_gmi_cloud` — 搜索 GMI Cloud 知识库
- **协议**: JSON-RPC over HTTP + SSE

本项目暂不需要 MCP 集成，但可以在 Demo 中作为加分项展示"AI Agent 使用 MCP 搜索文档"的能力。

---

## 视频/图片生成 API（扩展功能）

GMI Cloud 还提供视频和图片生成模型（Kling、Luma Ray2、Veo3 等），使用异步队列 API：

- **Base URL**: `https://console.gmicloud.ai/api/v1/ie/requestqueue/apikey/`
- **认证**: 同一 API Key
- **模式**: 提交请求 → 轮询状态 → 获取结果

本项目 MVP 暂不使用，但可作为后续扩展方向（如自动生成产品宣传视频）。
