import { NextResponse } from "next/server";

import { generateLanding } from "@/lib/gmi";
import type { MarketId, PositioningCard } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    idea?: string;
    market?: MarketId;
    positioning?: PositioningCard;
  };

  const result = await generateLanding({
    idea: (body.idea?.trim() ?? "手工编织的水晶手链，主打能量疗愈与焦虑缓解").slice(0, 500),
    market: body.market ?? "us",
    positioning: body.positioning,
  });

  return NextResponse.json(result);
}
