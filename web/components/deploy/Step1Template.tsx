'use client'

import { useLanguage } from '@/components/providers/language-provider'

const templates = [
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    nameZh: '时尚服装',
    emoji: '👗',
    tagsZh: ['服装', '配饰', '潮流'],
    tagsEn: ['Apparel', 'Accessories', 'Trendy'],
    descZh: '简约现代风格，适合服装配饰品牌',
    descEn: 'Minimalist modern style for fashion brands',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'handmade',
    name: 'Handmade & Crafts',
    nameZh: '手工艺品',
    emoji: '🧶',
    tagsZh: ['手工', '定制', '原创'],
    tagsEn: ['Handmade', 'Custom', 'Original'],
    descZh: '温暖质感风格，适合手工制品品牌',
    descEn: 'Warm texture style for handmade brands',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'beauty',
    name: 'Beauty & Skincare',
    nameZh: '美妆护肤',
    emoji: '✨',
    tagsZh: ['美妆', '护肤', '天然'],
    tagsEn: ['Beauty', 'Skincare', 'Natural'],
    descZh: '高端精致风格，适合美妆护肤品牌',
    descEn: 'Premium elegant style for beauty brands',
    gradient: 'from-purple-500 to-violet-600',
  },
]

interface Step1Props {
  selected: string
  onSelect: (id: string) => void
  onNext: () => void
}

export function Step1Template({ selected, onSelect, onNext }: Step1Props) {
  const { t, lang } = useLanguage()
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">{t('选择你的店铺模板', 'Choose Your Store Template')}</h2>
      <p className="text-gray-400 mb-8">{t('根据你的品类选择最合适的模板风格', 'Select the best template style for your category')}</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            className={`rounded-2xl border-2 overflow-hidden text-left transition-all bg-[#242424] ${
              selected === tpl.id
                ? 'border-[#00d4ff] shadow-lg shadow-[#00d4ff]/20'
                : 'border-[#2a2a2a] hover:border-[#00d4ff]/50'
            }`}
          >
            <div className={`h-32 bg-gradient-to-br ${tpl.gradient} flex items-center justify-center`}>
              <span className="text-5xl">{tpl.emoji}</span>
            </div>
            <div className="p-4">
              <div className="font-semibold text-white">{tpl.name}</div>
              <div className="text-sm text-gray-400 mb-2">{tpl.nameZh}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {(lang === 'zh' ? tpl.tagsZh : tpl.tagsEn).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-[#2a2a2a] text-gray-400 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="text-xs text-gray-500">{lang === 'zh' ? tpl.descZh : tpl.descEn}</p>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full py-3 bg-[#00d4ff] text-black rounded-xl font-semibold disabled:opacity-40 hover:bg-[#00b8e6] transition-colors"
      >
        {t('下一步：填写品牌信息 →', 'Next: Fill Brand Info →')}
      </button>
    </div>
  )
}
