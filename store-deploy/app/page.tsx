'use client'

import { useState } from 'react'
import Step1Template from '@/components/Step1Template'
import Step2BrandInfo from '@/components/Step2BrandInfo'
import Step3Deploy from '@/components/Step3Deploy'

const steps = ['选择模板', '品牌信息', '连接部署']

export interface CopyResult {
  slogan: string
  aboutUs: string
  bannerTitle: string
  bannerSubtitle: string
  seoTitle: string
  seoDescription: string
}

export default function Home() {
  const [step, setStep] = useState(0)
  const [template, setTemplate] = useState('')
  const [brandInfo, setBrandInfo] = useState({
    brandName: '',
    category: 'Fashion',
    color: '#6366f1',
    story: '',
  })
  const [shopifyConfig, setShopifyConfig] = useState({
    storeUrl: '',
    apiKey: '',
  })
  const [copy, setCopy] = useState<CopyResult | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-gray-900 text-lg">Omini Store Deploy</span>
          </div>
          <div className="text-sm text-gray-400">一键部署你的出海独立站</div>
        </div>
      </header>

      {/* Step Progress */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step ? 'bg-indigo-600 text-white' :
                    i === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm font-medium ${i <= step ? 'text-indigo-600' : 'text-gray-400'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${i < step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {step === 0 && (
            <Step1Template
              selected={template}
              onSelect={setTemplate}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <Step2BrandInfo
              info={brandInfo}
              onChange={setBrandInfo}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
              onCopyGenerated={setCopy}
            />
          )}
          {step === 2 && (
            <Step3Deploy
              config={shopifyConfig}
              onChange={setShopifyConfig}
              onDeploy={() => {}}
              onBack={() => setStep(1)}
              brandName={brandInfo.brandName}
              copy={copy}
              template={template}
              brandColor={brandInfo.color}
            />
          )}
        </div>
      </div>
    </main>
  )
}
