import { NextRequest, NextResponse } from "next/server";

import { generateCopy } from "@/lib/gmi";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const brandName = String(body.brandName ?? "").trim().slice(0, 100);
  const category = String(body.category ?? "").trim().slice(0, 100);
  const color = String(body.color ?? "").trim().slice(0, 50);
  const story = String(body.story ?? "").trim().slice(0, 500);

  const result = await generateCopy({ brandName, category, color, story });
  return NextResponse.json(result);
}
