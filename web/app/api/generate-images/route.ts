import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest } from "next/server";

export const maxDuration = 120;

// Image provider configuration
const IMAGE_PROVIDER = process.env.IMAGE_PROVIDER ?? "aiping"; // "aiping" or "gmi"

// aiping configuration (default)
const AIPING_BASE_URL = process.env.AIPING_BASE_URL ?? "https://aiping.cn/api/v1";
const AIPING_API_KEY = process.env.AIPING_API_KEY ?? "QC-b98110b89277c3c1dc9cf3dcd25ab881-29bd6fc34a86da9249073d73c7349572";
const AIPING_IMAGE_MODEL = process.env.AIPING_IMAGE_MODEL ?? "Doubao-Seedream-4.0";

// GMI configuration (fallback)
const GMI_BASE_URL = process.env.GMI_BASE_URL ?? "https://api.gmi-serving.com/v1";
const GMI_API_KEY = process.env.GMI_API_KEY;
const GMI_DEFAULT_MODEL = process.env.GMI_DEFAULT_MODEL ?? "deepseek-ai/DeepSeek-V3.2";
const GMI_IMAGE_MODEL = process.env.GMI_IMAGE_MODEL ?? "bytedance/seedream-3";

type ImageType = "lifestyle" | "whitebg" | "banner";

type SSEEvent =
  | { type: "progress"; imageType: ImageType; index: number }
  | { type: "image_done"; imageType: ImageType; index: number; url: string; completedCount: number }
  | { type: "error"; imageType: ImageType; index: number; error: string; completedCount: number }
  | { type: "all_done"; completedCount: number };

// 每种图类型生成 3 张，共 9 张
const IMAGE_SPECS: Array<{ type: ImageType; index: number; size: "1024x1024" | "1792x1024"; promptGuide: string }> = [
  { type: "lifestyle", index: 0, size: "1024x1024", promptGuide: "candid lifestyle scene, golden hour, product in natural use, shallow depth of field, no text" },
  { type: "lifestyle", index: 1, size: "1024x1024", promptGuide: "morning ritual scene, soft natural light, product as part of daily routine, cozy aesthetic, no text" },
  { type: "lifestyle", index: 2, size: "1024x1024", promptGuide: "outdoor lifestyle setting, vibrant atmosphere, product worn or used casually, no text" },
  { type: "whitebg", index: 0, size: "1024x1024", promptGuide: "pure white seamless background, product centered 70% frame, soft studio lighting, subtle drop shadow, photorealistic, no text" },
  { type: "whitebg", index: 1, size: "1024x1024", promptGuide: "clean white studio, product from 45-degree angle, professional e-commerce shot, no props, no text" },
  { type: "whitebg", index: 2, size: "1024x1024", promptGuide: "minimalist white background, product detail close-up, crisp studio lighting, no text" },
  { type: "banner", index: 0, size: "1792x1024", promptGuide: "wide landscape banner, product hero on right, aspirational lifestyle fills left, cinematic color grading, no text no logos" },
  { type: "banner", index: 1, size: "1792x1024", promptGuide: "dramatic wide format, product featured prominently, premium brand feel, dark moody atmosphere, no text" },
  { type: "banner", index: 2, size: "1792x1024", promptGuide: "bright wide banner composition, product in luxurious setting, negative space on left for overlay, no text" },
];

async function buildImagePrompt(idea: string, market: string, spec: typeof IMAGE_SPECS[0], provider: "aiping" | "gmi"): Promise<string> {
  // Simplified: use template prompt directly
  return `${spec.promptGuide}, product: ${idea}, target market: ${market}`;
}

async function generateImage(prompt: string, spec: typeof IMAGE_SPECS[0], provider: "aiping" | "gmi") {
  const baseUrl = provider === "aiping" ? AIPING_BASE_URL : GMI_BASE_URL;
  const apiKey = provider === "aiping" ? AIPING_API_KEY : GMI_API_KEY;
  const model = provider === "aiping" ? AIPING_IMAGE_MODEL : GMI_IMAGE_MODEL;

  // Use standard size format for aiping (as per OpenAI compat)
  const requestBody: Record<string, unknown> = {
    model,
    prompt,
    n: 1,
    size: spec.size, // Use standard format like "1024x1024"
    response_format: "url",
  };

  console.log(`[Image Gen] Provider: ${provider}, Model: ${model}, Size: ${spec.size}`);

  const response = await fetch(`${baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await response.text();
  console.log(`[Image Gen] Response status: ${response.status}`);

  if (!response.ok) {
    throw new Error(`${provider.toUpperCase()} image API error: ${response.status} - ${responseText.slice(0, 200)}`);
  }

  const data = JSON.parse(responseText) as { data?: Array<{ url?: string; b64_json?: string }> };
  console.log(`[Image Gen] Response data keys: ${Object.keys(data).join(', ')}`);

  // Prefer URL, fallback to b64_json
  let url = data.data?.[0]?.url;
  if (!url && data.data?.[0]?.b64_json) {
    // Convert base64 to data URL
    url = `data:image/png;base64,${data.data[0].b64_json}`;
  }

  if (!url) throw new Error("No URL or image data in response");
  console.log(`[Image Gen] Generated URL: ${url?.slice(0, 50)}...`);
  return url;
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { idea?: string; market?: string };
  const idea = body.idea?.trim() || "手工编织的水晶手链，主打能量疗愈与焦虑缓解";
  const market = body.market || "us";

  // Determine provider
  const provider: "aiping" | "gmi" = IMAGE_PROVIDER === "gmi" ? "gmi" : "aiping";

  const apiKey = provider === "aiping" ? AIPING_API_KEY : GMI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: `${provider.toUpperCase()}_API_KEY not configured` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: SSEEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      let completedCount = 0;

      // 并发生成全部图片
      await Promise.all(
        IMAGE_SPECS.map(async (spec) => {
          send({ type: "progress", imageType: spec.type, index: spec.index });
          try {
            const prompt = await buildImagePrompt(idea, market, spec, provider);
            const url = await generateImage(prompt, spec, provider);

            completedCount++;
            send({ type: "image_done", imageType: spec.type, index: spec.index, url, completedCount });
          } catch (err) {
            completedCount++;
            const message = err instanceof Error ? err.message : "Unknown error";
            send({ type: "error", imageType: spec.type, index: spec.index, error: message, completedCount });
          }
        })
      );

      send({ type: "all_done", completedCount });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
