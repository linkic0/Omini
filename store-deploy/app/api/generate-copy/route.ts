import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://openai-proxy.miracleplus.com',
})

export async function POST(req: NextRequest) {
  const { brandName, category, color, story } = await req.json()

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `为出海独立站品牌生成营销文案，返回 JSON 格式。

品牌信息：
- 品牌名：${brandName}
- 品类：${category}
- 主色调：${color}
- 品牌故事：${story || '暂无'}

返回格式：
{
  "slogan": "一句话品牌口号（英文，10字以内）",
  "aboutUs": "About Us 文案（英文，50字左右）",
  "bannerTitle": "首页 Banner 大标题（英文，5字以内）",
  "bannerSubtitle": "Banner 副标题（英文，15字以内）",
  "seoTitle": "SEO 页面标题（英文）",
  "seoDescription": "SEO 描述（英文，150字以内）"
}

只返回 JSON，不要其他文字。`,
        },
      ],
    })

    const text = (message.content[0] as { type: string; text: string }).text
    const result = JSON.parse(text)
    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return NextResponse.json({
      slogan: `${brandName} — Made with Love`,
      aboutUs: `${brandName} is a passionate brand dedicated to bringing you the finest ${category} products. We believe in quality, authenticity, and the joy of discovery.`,
      bannerTitle: 'Shop Now',
      bannerSubtitle: `Discover the world of ${brandName}`,
      seoTitle: `${brandName} | Premium ${category}`,
      seoDescription: `Shop premium ${category} at ${brandName}. Quality products, fast shipping worldwide.`,
    })
  }
}
