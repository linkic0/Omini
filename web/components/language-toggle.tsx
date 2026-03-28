'use client'
import { useLanguage } from '@/components/providers/language-provider'

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#00d4ff] transition-colors"
    >
      {lang === 'zh' ? 'EN' : '中文'}
    </button>
  )
}
