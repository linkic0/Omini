'use client'

import { useState } from 'react'
import type { CopyResult } from '@/app/page'

interface ShopifyConfig {
  storeUrl: string
  apiKey: string
}

interface Step3Props {
  config: ShopifyConfig
  onChange: (config: ShopifyConfig) => void
  onDeploy: () => void
  onBack: () => void
  brandName: string
  copy: CopyResult | null
  template: string
  brandColor: string
}

const deploySteps = [
  '验证 Shopify 连接',
  '创建品牌主题',
  '配置品牌信息',
  '同步产品目录',
  '部署完成',
]

export default function Step3Deploy({ config, onChange, onDeploy, onBack, brandName, copy, template, brandColor }: Step3Props) {
  const [deploying, setDeploying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [done, setDone] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const handleDeploy = async () => {
    setDeploying(true)
    setCurrentStep(0)
    await new Promise(r => setTimeout(r, 600))
    setCurrentStep(1)
    await new Promise(r => setTimeout(r, 600))
    setCurrentStep(2)
    await new Promise(r => setTimeout(r, 600))
    setCurrentStep(3)

    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeUrl: config.storeUrl,
        apiKey: config.apiKey,
        brandName,
        template,
        color: brandColor,
        copy,
      }),
    })
    const data = await res.json()

    setCurrentStep(4)
    await new Promise(r => setTimeout(r, 400))
    setPreviewUrl(data.previewUrl ?? `https://${config.storeUrl}`)
    setDone(true)
    onDeploy()
  }

  const displayUrl = previewUrl || (config.storeUrl
    ? `https://${config.storeUrl.replace('https://', '').replace('http://', '')}`
    : 'https://your-store.myshopify.com')

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">部署成功！</h2>
        <p className="text-gray-500 mb-8">你的 {brandName} 独立站已上线</p>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-left">
          <div className="text-sm text-green-700 font-medium mb-2">🔗 店铺预览链接</div>
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-mono text-sm hover:underline break-all"
          >
            {displayUrl}
          </a>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-2xl mb-1">🎨</div>
            <div className="font-medium text-gray-900">主题已配置</div>
            <div className="text-gray-500 text-xs mt-1">品牌色彩已应用</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-2xl mb-1">📝</div>
            <div className="font-medium text-gray-900">文案已上传</div>
            <div className="text-gray-500 text-xs mt-1">AI 生成内容已同步</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-2xl mb-1">🛍️</div>
            <div className="font-medium text-gray-900">产品已同步</div>
            <div className="text-gray-500 text-xs mt-1">目录配置完成</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">连接 Shopify 并部署</h2>
      <p className="text-gray-500 mb-8">输入你的 Shopify 信息，一键完成部署</p>

      {!deploying ? (
        <>
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shopify Store URL</label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">https://</span>
                <input
                  type="text"
                  value={config.storeUrl}
                  onChange={e => onChange({ ...config, storeUrl: e.target.value })}
                  placeholder="your-store.myshopify.com"
                  className="flex-1 px-4 py-2.5 focus:outline-none text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin API Access Token</label>
              <input
                type="password"
                value={config.apiKey}
                onChange={e => onChange({ ...config, apiKey: e.target.value })}
                placeholder="shpat_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">在 Shopify Admin → Apps → Develop apps 中获取</p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 mb-8 border border-indigo-100">
            <div className="text-sm font-medium text-indigo-800 mb-2">部署将完成以下操作：</div>
            <div className="space-y-1">
              {deploySteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-indigo-700">
                  <span className="text-indigo-400">→</span> {step}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              ← 返回
            </button>
            <button
              onClick={handleDeploy}
              disabled={!config.storeUrl || !config.apiKey}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-40 hover:bg-indigo-700 transition-colors"
            >
              🚀 一键部署
            </button>
          </div>
        </>
      ) : (
        <div className="py-8">
          <div className="space-y-4">
            {deploySteps.map((step, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                i < currentStep ? 'bg-green-50 border border-green-200' :
                i === currentStep ? 'bg-indigo-50 border border-indigo-200' :
                'bg-gray-50 border border-gray-200'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < currentStep ? 'bg-green-500 text-white' :
                  i === currentStep ? 'bg-indigo-500 text-white animate-pulse' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`font-medium ${
                  i < currentStep ? 'text-green-700' :
                  i === currentStep ? 'text-indigo-700' :
                  'text-gray-400'
                }`}>{step}</span>
                {i === currentStep && (
                  <span className="ml-auto text-indigo-400 animate-spin text-lg">⟳</span>
                )}
                {i < currentStep && (
                  <span className="ml-auto text-green-500">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
