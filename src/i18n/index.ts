import { Locales } from './locales'

import en from '@/locales/en.json'
import zh from '@/locales/zh.json'

export const messages = {
  [Locales.EN]: en,
  [Locales.ZH]: zh,
}

export const supportedLanguages = [
  {
    key: 'en',
    localizedName: 'English',
  },
  {
    key: 'zh',
    localizedName: '中文',
  },
]

export const defaultLocale = Locales.EN
