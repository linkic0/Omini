import { NextResponse } from "next/server";

import { generateChat } from "@/lib/gmi";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    idea?: string;
    stage?: "market" | "audience" | "hook" | "done";
    market?: "us" | "jp" | "eu" | "sea";
  };

  const result = await generateChat({
    idea: body.idea?.trim() || "手工编织的水晶手链，主打能量疗愈与焦虑缓解",
    stage: body.stage,
    market: body.market,
  });

  return NextResponse.json(result);
}
