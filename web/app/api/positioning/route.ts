import { NextResponse } from "next/server";

import { generatePositioning } from "@/lib/gmi";
import type { MarketId } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    idea?: string;
    market?: MarketId;
    audienceId?: string;
    hookId?: string;
  };

  const result = await generatePositioning({
    idea: (body.idea?.trim() ?? "手工编织的水晶手链，主打能量疗愈与焦虑缓解").slice(0, 500),
    market: body.market ?? "us",
    audienceId: body.audienceId,
    hookId: body.hookId,
  });

  return NextResponse.json(result);
}
