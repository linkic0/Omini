import { NextResponse } from "next/server";

import { generatePositioning } from "@/lib/gmi";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    idea?: string;
    market?: "us" | "jp" | "eu" | "sea";
    audienceId?: string;
    hookId?: string;
  };

  const result = await generatePositioning({
    idea: body.idea?.trim() || "手工编织的水晶手链，主打能量疗愈与焦虑缓解",
    market: body.market ?? "us",
    audienceId: body.audienceId,
    hookId: body.hookId,
  });

  return NextResponse.json(result);
}
