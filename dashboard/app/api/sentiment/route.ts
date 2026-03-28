import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://openai-proxy.miracleplus.com',
})

const mockComments = [
  'Love this product! Amazing quality',
  'Fast shipping, very happy with my purchase',
  'The color is slightly different from photos',
  'Great value for money, will buy again',
  'Will definitely buy again, excellent!',
  'Package was damaged on arrival, disappointed',
  'Excellent customer service, resolved my issue quickly',
  'Not what I expected, quality is poor',
  'Beautiful design, exactly as described',
  'Shipping took too long but product is good',
]

export async function GET(_req: NextRequest) {
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `分析以下用户评论的情感，返回 JSON 格式：{"positive": number, "neutral": number, "negative": number, "keywords": string[]}，其中数字是百分比（合计100），keywords 是最多5个高频关键词。

评论列表：
${mockComments.map((c, i) => `${i + 1}. ${c}`).join('\n')}

只返回 JSON，不要其他文字。`,
        },
      ],
    })

    const text = (message.content[0] as { type: string; text: string }).text
    const result = JSON.parse(text)
    return NextResponse.json({ ...result, comments: mockComments })
  } catch (err) {
    console.error(err)
    // fallback mock
    return NextResponse.json({
      positive: 72,
      neutral: 20,
      negative: 8,
      keywords: ['quality', 'shipping', 'value', 'design', 'service'],
      comments: mockComments,
    })
  }
}
