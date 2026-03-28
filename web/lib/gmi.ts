import {
  createChatFallback,
  createLandingFallback,
  createPositioningFallback,
  createWorkspaceFallback,
} from "@/lib/fallback-data";
import type {
  ApiEnvelope,
  ApiError,
  ChatResponse,
  ChatStage,
  LandingData,
  MarketId,
  PositioningCard,
  WorkspaceData,
} from "@/lib/types";

const GMI_BASE_URL = process.env.GMI_BASE_URL ?? "https://api.gmi-serving.com/v1";
const GMI_DEFAULT_MODEL =
  process.env.GMI_DEFAULT_MODEL ?? "deepseek-ai/DeepSeek-V3.2";

function createApiError(code: string, message: string): ApiError {
  return { code, message };
}

async function callGmiJSON<T>(args: {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
}) {
  const apiKey = process.env.GMI_API_KEY;

  if (!apiKey) {
    throw createApiError("missing_api_key", "GMI_API_KEY 未配置");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${GMI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: args.model ?? GMI_DEFAULT_MODEL,
        temperature: args.temperature ?? 0.6,
        max_tokens: 4096,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: args.system },
          { role: "user", content: args.user },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      throw createApiError(
        "upstream_error",
        `GMI 请求失败（${response.status}）：${text.slice(0, 180)}`,
      );
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      throw createApiError("invalid_response", "GMI 没有返回可解析内容");
    }

    return JSON.parse(content) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw createApiError("timeout", "GMI 请求超时");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function errorFromUnknown(error: unknown): ApiError {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  ) {
    return error as ApiError;
  }

  if (error instanceof Error) {
    return createApiError("unknown_error", error.message);
  }

  return createApiError("unknown_error", "未知错误");
}

export async function generateChat(input: {
  idea: string;
  stage?: ChatStage;
  market?: MarketId;
}): Promise<ApiEnvelope<ChatResponse>> {
  const fallback = createChatFallback(input);

  try {
    const data = await callGmiJSON<Partial<ChatResponse>>({
      system:
        "You are a launch strategist for an idea-to-deploy product. Respond with JSON only. Keep the stage intact and provide short, product-focused option copy.",
      user: JSON.stringify({
        task: "generate_chat_step",
        fallback,
        input,
      }),
    });

    return {
      source: "gmi",
      data: {
        stage: data.stage ?? fallback.stage,
        assistant: data.assistant ?? fallback.assistant,
        options: data.options?.length ? data.options : fallback.options,
        suggestedIdea: data.suggestedIdea ?? fallback.suggestedIdea,
      },
    };
  } catch (error) {
    return {
      source: "fallback",
      data: fallback,
      error: errorFromUnknown(error),
    };
  }
}

export async function generatePositioning(input: {
  idea: string;
  market: MarketId;
  audienceId?: string;
  hookId?: string;
}): Promise<ApiEnvelope<PositioningCard>> {
  const fallback = createPositioningFallback(input);

  try {
    const data = await callGmiJSON<Partial<PositioningCard>>({
      system:
        "You are a go-to-market strategist. Return JSON only. Generate a concise positioning card for a launch demo. Reuse the fallback structure when unsure.",
      user: JSON.stringify({
        task: "generate_positioning_card",
        fallback,
        input,
      }),
    });

    return {
      source: "gmi",
      data: {
        ...fallback,
        ...data,
        targetAudience: {
          ...fallback.targetAudience,
          ...(data.targetAudience ?? {}),
        },
        hooks: data.hooks?.length ? data.hooks : fallback.hooks,
      },
    };
  } catch (error) {
    return {
      source: "fallback",
      data: fallback,
      error: errorFromUnknown(error),
    };
  }
}

export async function generateWorkspace(input: {
  idea: string;
  market: MarketId;
}): Promise<ApiEnvelope<WorkspaceData>> {
  const fallback = createWorkspaceFallback(input);

  try {
    const data = await callGmiJSON<Partial<WorkspaceData>>({
      system:
        "You are a launch operator. Return JSON only. Generate a compact GTM workspace object for a demo dashboard.",
      user: JSON.stringify({
        task: "generate_workspace",
        fallback,
        input,
      }),
    });

    return {
      source: "gmi",
      data: {
        ...fallback,
        ...data,
        timeline: data.timeline?.length ? data.timeline : fallback.timeline,
        checklist: data.checklist?.length ? data.checklist : fallback.checklist,
        posts: data.posts?.length ? data.posts : fallback.posts,
        storyFrames: data.storyFrames?.length
          ? data.storyFrames
          : fallback.storyFrames,
        metrics: data.metrics?.length ? data.metrics : fallback.metrics,
        traffic: data.traffic?.length ? data.traffic : fallback.traffic,
        channelSplit: data.channelSplit?.length
          ? data.channelSplit
          : fallback.channelSplit,
        contentPerformance: data.contentPerformance?.length
          ? data.contentPerformance
          : fallback.contentPerformance,
        warnings: data.warnings?.length ? data.warnings : fallback.warnings,
        recommendations: data.recommendations?.length
          ? data.recommendations
          : fallback.recommendations,
      },
    };
  } catch (error) {
    return {
      source: "fallback",
      data: fallback,
      error: errorFromUnknown(error),
    };
  }
}

export async function generateLanding(input: {
  idea: string;
  market: MarketId;
}): Promise<ApiEnvelope<LandingData>> {
  const fallback = createLandingFallback(input);

  try {
    const data = await callGmiJSON<Partial<LandingData>>({
      system:
        "You are a creative director generating a consumer-facing landing page data model. Return JSON only and keep the structure compact.",
      user: JSON.stringify({
        task: "generate_landing_page",
        fallback,
        input,
      }),
    });

    return {
      source: "gmi",
      data: {
        ...fallback,
        ...data,
        products: data.products?.length ? data.products : fallback.products,
        faqs: data.faqs?.length ? data.faqs : fallback.faqs,
        editPrompts: data.editPrompts?.length
          ? data.editPrompts
          : fallback.editPrompts,
      },
    };
  } catch (error) {
    return {
      source: "fallback",
      data: fallback,
      error: errorFromUnknown(error),
    };
  }
}
