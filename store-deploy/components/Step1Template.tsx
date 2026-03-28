'use client'

const templates = [
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    nameZh: '时尚服装',
    emoji: '👗',
    tags: ['服装', '配饰', '潮流'],
    desc: '简约现代风格，适合服装配饰品牌',
    gradient: 'from-pink-500 to-rose-600',
    accent: 'bg-pink-500',
  },
  {
    id: 'handmade',
    name: 'Handmade & Crafts',
    nameZh: '手工艺品',
    emoji: '🧶',
    tags: ['手工', '定制', '原创'],
    desc: '温暖质感风格，适合手工制品品牌',
    gradient: 'from-amber-500 to-orange-600',
    accent: 'bg-amber-500',
  },
  {
    id: 'beauty',
    name: 'Beauty & Skincare',
    nameZh: '美妆护肤',
    emoji: '✨',
    tags: ['美妆', '护肤', '天然'],
    desc: '高端精致风格，适合美妆护肤品牌',
    gradient: 'from-purple-500 to-violet-600',
    accent: 'bg-purple-500',
  },
]

interface Step1Props {
  selected: string
  onSelect: (id: string) => void
  onNext: () => void
}

export default function Step1Template({ selected, onSelect, onNext }: Step1Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">选择你的店铺模板</h2>
      <p className="text-gray-500 mb-8">根据你的品类选择最合适的模板风格</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`rounded-2xl border-2 overflow-hidden text-left transition-all ${
              selected === t.id ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`h-32 bg-gradient-to-br ${t.gradient} flex items-center justify-center`}>
              <span className="text-5xl">{t.emoji}</span>
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-900">{t.name}</div>
              <div className="text-sm text-gray-500 mb-2">{t.nameZh}</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {t.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{tag}</span>
                ))}
              </div>
              <p className="text-xs text-gray-400">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-40 hover:bg-indigo-700 transition-colors"
      >
        下一步：填写品牌信息 →
      </button>
    </div>
  )
}
