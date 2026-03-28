import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

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

const GMI_BASE_URL =
  process.env.GMI_BASE_URL ?? "https://api.gmi-serving.com/v1";
const GMI_DEFAULT_MODEL =
  process.env.GMI_DEFAULT_MODEL ?? "deepseek-ai/DeepSeek-V3.2";

function createApiError(code: string, message: string): ApiError {
  return { code, message };
}

function getGmiProvider() {
  const apiKey = process.env.GMI_API_KEY;
  if (!apiKey) throw createApiError("missing_api_key", "GMI_API_KEY 未配置");
  return createOpenAI({ baseURL: GMI_BASE_URL, apiKey });
}

async function callGmiJSON<T>(args: {
  system: string;
  user: string;
  temperature?: number;
}) {
  const provider = getGmiProvider();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const { text } = await generateText({
      model: provider(GMI_DEFAULT_MODEL),
      temperature: args.temperature ?? 0.6,
      maxOutputTokens: 4096,
      system: args.system,
      prompt: args.user,
      abortSignal: controller.signal,
    });

    return JSON.parse(text) as T;
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

// ─── Pipeline functions ────────────────────────────────────────────────────

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
      user: JSON.stringify({ task: "generate_chat_step", fallback, input }),
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
    return { source: "fallback", data: fallback, error: errorFromUnknown(error) };
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
    return { source: "fallback", data: fallback, error: errorFromUnknown(error) };
  }
}

export async function generateWorkspace(input: {
  idea: string;
  market: MarketId;
  positioning?: PositioningCard;
}): Promise<ApiEnvelope<WorkspaceData>> {
  const fallback = createWorkspaceFallback(input);

  try {
    const data = await callGmiJSON<Partial<WorkspaceData>>({
      system:
        "You are a launch operator. Return JSON only. Generate a compact GTM workspace object for a demo dashboard.",
      user: JSON.stringify({ task: "generate_workspace", fallback, input }),
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
    return { source: "fallback", data: fallback, error: errorFromUnknown(error) };
  }
}

export async function generateLanding(input: {
  idea: string;
  market: MarketId;
  positioning?: PositioningCard;
}): Promise<ApiEnvelope<LandingData>> {
  const fallback = createLandingFallback(input);

  try {
    const data = await callGmiJSON<Partial<LandingData>>({
      system:
        "You are a creative director generating a consumer-facing landing page data model. Return JSON only and keep the structure compact.",
      user: JSON.stringify({ task: "generate_landing_page", fallback, input }),
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
    return { source: "fallback", data: fallback, error: errorFromUnknown(error) };
  }
}

// ─── New functions (replaces @anthropic-ai/sdk) ───────────────────────────

export type SentimentResult = {
  positive: number;
  neutral: number;
  negative: number;
  keywords: string[];
  comments: string[];
};

export async function generateSentiment(
  idea: string,
  market: MarketId,
): Promise<SentimentResult> {
  const fallback: SentimentResult = {
    positive: 72,
    neutral: 20,
    negative: 8,
    keywords: ["quality", "shipping", "value", "design", "service"],
    comments: [
      "Love this product! Amazing quality",
      "Fast shipping, very happy with my purchase",
      "Great value for money, will buy again",
      "Beautiful design, exactly as described",
      "Excellent customer service",
      "The color is slightly different from photos",
      "Will definitely recommend to friends",
      "Package was damaged on arrival",
      "Shipping took too long but product is good",
      "Not what I expected, quality is poor",
    ],
  };

  try {
    const result = await callGmiJSON<SentimentResult>({
      system:
        "You are a product analyst. Return JSON only with fields: positive (integer percentage), neutral (integer percentage), negative (integer percentage, all three sum to 100), keywords (string[], max 5 high-frequency keywords), comments (string[], exactly 10 realistic customer reviews in English relevant to the product).",
      user: JSON.stringify({
        task: "generate_sentiment_analysis",
        product: idea,
        market,
      }),
    });

    return {
      positive: result.positive ?? fallback.positive,
      neutral: result.neutral ?? fallback.neutral,
      negative: result.negative ?? fallback.negative,
      keywords: result.keywords?.length ? result.keywords : fallback.keywords,
      comments: result.comments?.length ? result.comments : fallback.comments,
    };
  } catch {
    return fallback;
  }
}

export type BrandCopyResult = {
  slogan: string;
  aboutUs: string;
  bannerTitle: string;
  bannerSubtitle: string;
  seoTitle: string;
  seoDescription: string;
};

export async function generateCopy(input: {
  brandName: string;
  category: string;
  color: string;
  story?: string;
}): Promise<BrandCopyResult> {
  const fallback: BrandCopyResult = {
    slogan: `${input.brandName} — Made with Love`,
    aboutUs: `${input.brandName} is a passionate brand dedicated to bringing you the finest ${input.category} products. We believe in quality, authenticity, and the joy of discovery.`,
    bannerTitle: "Shop Now",
    bannerSubtitle: `Discover the world of ${input.brandName}`,
    seoTitle: `${input.brandName} | Premium ${input.category}`,
    seoDescription: `Shop premium ${input.category} at ${input.brandName}. Quality products, fast shipping worldwide.`,
  };

  try {
    const result = await callGmiJSON<BrandCopyResult>({
      system:
        "You are a brand copywriter for global e-commerce. Return JSON only with fields: slogan (string, English, ≤10 words), aboutUs (string, English, ~50 words), bannerTitle (string, English, ≤5 words), bannerSubtitle (string, English, ≤15 words), seoTitle (string, English), seoDescription (string, English, ≤150 chars).",
      user: JSON.stringify({
        task: "generate_brand_copy",
        brandName: input.brandName,
        category: input.category,
        color: input.color,
        story: input.story ?? "",
      }),
    });

    return {
      slogan: result.slogan ?? fallback.slogan,
      aboutUs: result.aboutUs ?? fallback.aboutUs,
      bannerTitle: result.bannerTitle ?? fallback.bannerTitle,
      bannerSubtitle: result.bannerSubtitle ?? fallback.bannerSubtitle,
      seoTitle: result.seoTitle ?? fallback.seoTitle,
      seoDescription: result.seoDescription ?? fallback.seoDescription,
    };
  } catch {
    return fallback;
  }
}
