'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/providers/language-provider'

interface CopyResult {
  slogan: string
  aboutUs: string
  bannerTitle: string
  bannerSubtitle: string
  seoTitle: string
  seoDescription: string
}

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

export function Step3Deploy({ config, onChange, onDeploy, onBack, brandName, copy, template, brandColor }: Step3Props) {
  const router = useRouter()
  const { t } = useLanguage()
  const deployStepLabels = [
    t('验证 Shopify 连接', 'Validating Shopify connection'),
    t('创建品牌主题', 'Creating brand theme'),
    t('配置品牌信息', 'Configuring brand settings'),
    t('同步产品目录', 'Syncing product catalog'),
    t('部署完成', 'Deployment complete'),
  ]
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

    const res = await fetch('/api/deploy/shopify', {
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
        <h2 className="text-2xl font-bold text-white mb-2">{t('部署成功！', 'Deployed Successfully!')}</h2>
        <p className="text-gray-400 mb-8">{t(`你的 ${brandName} 独立站已上线`, `Your ${brandName} store is live`)}</p>
        <div className="bg-[#242424] border border-[#2a2a2a] rounded-2xl p-6 mb-6 text-left">
          <div className="text-sm text-gray-400 font-medium mb-2">🔗 {t('店铺预览链接', 'Store Preview Link')}</div>
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00d4ff] font-mono text-sm hover:underline break-all"
          >
            {displayUrl}
          </a>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm mb-8">
          <div className="bg-[#242424] rounded-xl p-4 border border-[#2a2a2a]">
            <div className="text-2xl mb-1">🎨</div>
            <div className="font-medium text-white">{t('主题已配置', 'Theme Configured')}</div>
            <div className="text-gray-500 text-xs mt-1">{t('品牌色彩已应用', 'Brand colors applied')}</div>
          </div>
          <div className="bg-[#242424] rounded-xl p-4 border border-[#2a2a2a]">
            <div className="text-2xl mb-1">📝</div>
            <div className="font-medium text-white">{t('文案已上传', 'Copy Uploaded')}</div>
            <div className="text-gray-500 text-xs mt-1">{t('AI 生成内容已同步', 'AI content synced')}</div>
          </div>
          <div className="bg-[#242424] rounded-xl p-4 border border-[#2a2a2a]">
            <div className="text-2xl mb-1">🛍️</div>
            <div className="font-medium text-white">{t('产品已同步', 'Products Synced')}</div>
            <div className="text-gray-500 text-xs mt-1">{t('目录配置完成', 'Catalog configured')}</div>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[#00d4ff] text-black rounded-xl font-semibold hover:bg-[#00b8e6] transition-colors"
          >
            📊 {t('查看数据面板', 'View Dashboard')}
          </button>
          <button
            onClick={() => router.push('/workspace')}
            className="px-6 py-3 border border-[#2a2a2a] text-gray-400 rounded-xl hover:bg-[#2a2a2a] transition-colors"
          >
            {t('返回工作台', 'Back to Workspace')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">{t('连接 Shopify 并部署', 'Connect Shopify & Deploy')}</h2>
      <p className="text-gray-400 mb-8">{t('输入你的 Shopify 信息，一键完成部署', 'Enter your Shopify credentials to deploy in one click')}</p>

      {!deploying ? (
        <>
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Shopify Store URL</label>
              <div className="flex items-center border border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-[#00d4ff]">
                <span className="px-3 py-2.5 bg-[#1a1a1a] text-gray-500 text-sm border-r border-[#2a2a2a]">https://</span>
                <input
                  type="text"
                  value={config.storeUrl}
                  onChange={e => onChange({ ...config, storeUrl: e.target.value })}
                  placeholder="your-store.myshopify.com"
                  className="flex-1 px-4 py-2.5 bg-[#1a1a1a] focus:outline-none text-white placeholder-gray-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Admin API Access Token</label>
              <input
                type="password"
                value={config.apiKey}
                onChange={e => onChange({ ...config, apiKey: e.target.value })}
                placeholder="shpat_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl focus:outline-none focus:border-[#00d4ff] text-white font-mono text-sm placeholder-gray-600"
              />
              <p className="text-xs text-gray-600 mt-1">{t('在 Shopify Admin → Apps → Develop apps 中获取', 'Get this from Shopify Admin → Apps → Develop apps')}</p>
            </div>
          </div>

          <div className="bg-[#00d4ff]/5 rounded-xl p-4 mb-8 border border-[#00d4ff]/20">
            <div className="text-sm font-medium text-[#00d4ff] mb-2">{t('部署将完成以下操作：', 'Deployment will complete the following:')}</div>
            <div className="space-y-1">
              {deployStepLabels.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-[#00d4ff]/60">→</span> {s}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-[#2a2a2a] text-gray-400 rounded-xl hover:bg-[#2a2a2a] transition-colors"
            >
              ← {t('返回', 'Back')}
            </button>
            <button
              onClick={handleDeploy}
              disabled={!config.storeUrl || !config.apiKey}
              className="flex-1 py-3 bg-[#00d4ff] text-black rounded-xl font-semibold disabled:opacity-40 hover:bg-[#00b8e6] transition-colors"
            >
              🚀 {t('一键部署', 'Deploy Now')}
            </button>
          </div>
        </>
      ) : (
        <div className="py-8">
          <div className="space-y-4">
            {deployStepLabels.map((s, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                i < currentStep ? 'bg-[#00d4ff]/10 border border-[#00d4ff]/30' :
                i === currentStep ? 'bg-[#242424] border border-[#00d4ff]' :
                'bg-[#1a1a1a] border border-[#2a2a2a]'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < currentStep ? 'bg-[#00d4ff] text-black' :
                  i === currentStep ? 'bg-[#00d4ff] text-black animate-pulse' :
                  'bg-[#2a2a2a] text-gray-500'
                }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`font-medium ${
                  i < currentStep ? 'text-[#00d4ff]' :
                  i === currentStep ? 'text-[#00d4ff]' :
                  'text-gray-500'
                }`}>{s}</span>
                {i === currentStep && (
                  <span className="ml-auto text-[#00d4ff] animate-spin text-lg">⟳</span>
                )}
                {i < currentStep && (
                  <span className="ml-auto text-[#00d4ff]">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
