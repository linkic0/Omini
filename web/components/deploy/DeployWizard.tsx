'use client'

import { useState } from 'react'
import { Step1Template } from '@/components/deploy/Step1Template'
import { Step2BrandInfo } from '@/components/deploy/Step2BrandInfo'
import { Step3Deploy } from '@/components/deploy/Step3Deploy'

const steps = ['选择模板', '品牌信息', '连接部署']

export interface CopyResult {
  slogan: string
  aboutUs: string
  bannerTitle: string
  bannerSubtitle: string
  seoTitle: string
  seoDescription: string
}

interface DeployWizardProps {
  initialBrandName: string
  initialCategory: string
  initialColor: string
}

export function DeployWizard({ initialBrandName, initialCategory, initialColor }: DeployWizardProps) {
  const [step, setStep] = useState(0)
  const [template, setTemplate] = useState('')
  const [brandInfo, setBrandInfo] = useState({
    brandName: initialBrandName,
    category: initialCategory,
    color: initialColor,
    story: '',
  })
  const [shopifyConfig, setShopifyConfig] = useState({
    storeUrl: '',
    apiKey: '',
  })
  const [copy, setCopy] = useState<CopyResult | null>(null)

  return (
    <main className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-white text-lg">Omini Store Deploy</span>
          </div>
          <div className="text-sm text-gray-400">一键部署你的出海独立站</div>
        </div>
      </header>

      {/* Step Progress */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step ? 'bg-[#00d4ff] text-black' :
                    i === step ? 'bg-[#00d4ff] text-black ring-4 ring-[#00d4ff]/20' :
                    'bg-[#2a2a2a] text-gray-500'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm font-medium ${i <= step ? 'text-[#00d4ff]' : 'text-gray-500'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${i < step ? 'bg-[#00d4ff]' : 'bg-[#2a2a2a]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10 bg-[#1a1a1a]">
        <div className="w-full max-w-4xl bg-[#242424] rounded-2xl border border-[#2a2a2a] p-8">
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
