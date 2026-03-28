import { NextRequest, NextResponse } from "next/server";

import { generateSentiment } from "@/lib/gmi";
import type { MarketId } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idea = searchParams.get("idea")?.trim().slice(0, 500) ?? "product";
  const market = (searchParams.get("market") ?? "us") as MarketId;

  const result = await generateSentiment(idea, market);
  return NextResponse.json(result);
}
