'use client'

import { useState } from 'react'

interface BrandInfo {
  brandName: string
  category: string
  color: string
  story: string
}

interface CopyResult {
  slogan: string
  aboutUs: string
  bannerTitle: string
  bannerSubtitle: string
  seoTitle: string
  seoDescription: string
}

interface Step2Props {
  info: BrandInfo
  onChange: (info: BrandInfo) => void
  onNext: () => void
  onBack: () => void
  onCopyGenerated?: (copy: CopyResult) => void
}

export function Step2BrandInfo({ info, onChange, onNext, onBack, onCopyGenerated }: Step2Props) {
  const [copy, setCopy] = useState<CopyResult | null>(null)
  const [generating, setGenerating] = useState(false)

  const generateCopy = async () => {
    if (!info.brandName) return
    setGenerating(true)
    try {
      const res = await fetch('/api/deploy/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      })
      const data = await res.json()
      setCopy(data)
      onCopyGenerated?.(data)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">填写品牌信息</h2>
      <p className="text-gray-400 mb-8">AI 将根据这些信息自动生成你的品牌文案</p>

      <div className="grid grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">品牌名称 *</label>
            <input
              type="text"
              value={info.brandName}
              onChange={e => onChange({ ...info, brandName: e.target.value })}
              placeholder="e.g. Luna Craft"
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#00d4ff] text-white placeholder-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">品类</label>
            <select
              value={info.category}
              onChange={e => onChange({ ...info, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#00d4ff] text-white"
            >
              <option value="Fashion">时尚服装</option>
              <option value="Handmade Crafts">手工艺品</option>
              <option value="Beauty & Skincare">美妆护肤</option>
              <option value="Jewelry">珠宝首饰</option>
              <option value="Home Decor">家居装饰</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">主色调</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={info.color}
                onChange={e => onChange({ ...info, color: e.target.value })}
                className="w-12 h-10 rounded-lg border border-[#2a2a2a] cursor-pointer bg-[#1a1a1a]"
              />
              <span className="text-gray-400 text-sm">{info.color}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">品牌故事（可选）</label>
            <textarea
              value={info.story}
              onChange={e => onChange({ ...info, story: e.target.value })}
              placeholder="简单描述你的品牌理念或故事..."
              rows={3}
              className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#00d4ff] text-white placeholder-gray-600 resize-none"
            />
          </div>
          <button
            onClick={generateCopy}
            disabled={!info.brandName || generating}
            className="w-full py-2.5 bg-[#00d4ff] text-black rounded-xl font-medium hover:bg-[#00b8e6] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
          >
            {generating ? (
              <><span className="animate-spin">⟳</span> AI 生成中...</>
            ) : (
              <>✨ AI 生成品牌文案</>
            )}
          </button>
        </div>

        {/* Right: Preview */}
        <div className="bg-[#242424] rounded-2xl p-5 border border-[#2a2a2a]">
          <div className="text-sm font-medium text-gray-400 mb-4">文案预览</div>
          {copy ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Slogan</div>
                <div className="text-lg font-bold text-white">"{copy.slogan}"</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Banner 标题</div>
                <div className="text-2xl font-black" style={{ color: info.color }}>{copy.bannerTitle}</div>
                <div className="text-sm text-gray-400">{copy.bannerSubtitle}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">About Us</div>
                <div className="text-sm text-gray-300 leading-relaxed">{copy.aboutUs}</div>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-3 border border-[#2a2a2a]">
                <div className="text-xs text-gray-500 mb-1">SEO</div>
                <div className="text-sm font-medium text-[#00d4ff]">{copy.seoTitle}</div>
                <div className="text-xs text-gray-500 mt-1">{copy.seoDescription}</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-600">
              <div className="text-4xl mb-3">✨</div>
              <div className="text-sm">填写品牌信息后点击生成</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-[#2a2a2a] text-gray-400 rounded-xl hover:bg-[#2a2a2a] transition-colors"
        >
          ← 返回
        </button>
        <button
          onClick={onNext}
          disabled={!info.brandName}
          className="flex-1 py-3 bg-[#00d4ff] text-black rounded-xl font-semibold disabled:opacity-40 hover:bg-[#00b8e6] transition-colors"
        >
          下一步：连接 Shopify →
        </button>
      </div>
    </div>
  )
}
