'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'

type Lang = 'zh' | 'en'

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (zh: string, en: string) => string
}

const LangContext = createContext<LangContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = (zh: string, en: string) => lang === 'zh' ? zh : en
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLanguage() {
  const value = useContext(LangContext)
  if (!value) throw new Error('useLanguage must be used within LanguageProvider')
  return value
}
