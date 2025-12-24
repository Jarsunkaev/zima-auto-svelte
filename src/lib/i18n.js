import { get, writable } from 'svelte/store';
import { translations, currentLang as baseLang } from './i18n/index.js';

// Re-export the shared language store so both import styles stay in sync
export const currentLang = baseLang;

// Translation helper that falls back to English or a provided default string
export function t(key, fallback = '') {
  const lang = get(currentLang) || 'en';
  const dict = translations[lang] || translations.en || {};
  const keys = key.split('.');
  let value = dict;

  for (const k of keys) {
    if (value && Object.prototype.hasOwnProperty.call(value, k)) {
      value = value[k];
    } else {
      return fallback || key;
    }
  }

  return value ?? fallback ?? key;
}

export function setLanguage(lang) {
  currentLang.set(lang);

  if (typeof window !== 'undefined') {
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
  }
}

// Initialize language from localStorage or browser preference
if (typeof window !== 'undefined') {
  const savedLang = localStorage.getItem('preferredLanguage');
  const browserLang = navigator.language?.split?.('-')?.[0];
  const defaultLang = ['en', 'hu'].includes(browserLang) ? browserLang : 'en';

  setLanguage(savedLang || defaultLang);
}
