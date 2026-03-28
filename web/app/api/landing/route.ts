import { NextResponse } from "next/server";

import { generateLanding } from "@/lib/gmi";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    idea?: string;
    market?: "us" | "jp" | "eu" | "sea";
  };

  const result = await generateLanding({
    idea: body.idea?.trim() || "手工编织的水晶手链，主打能量疗愈与焦虑缓解",
    market: body.market ?? "us",
  });

  return NextResponse.json(result);
}
