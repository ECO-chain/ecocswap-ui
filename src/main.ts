import { createApp } from 'vue'
import vClickOutside from 'click-outside-vue3'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { messages, defaultLocale, supportedLanguages } from '@/i18n'

const localeFromBrowser = navigator.language.split('-')[0]

const i18n = createI18n({
  messages,
  locale: supportedLanguages.find((lang) => lang.key === localeFromBrowser)
    ? localeFromBrowser
    : defaultLocale,
  fallbackLocale: defaultLocale,
  legacy: false,
  globalInjection: true,
})

createApp(App).use(store).use(i18n).use(router).use(vClickOutside).mount('#app')
