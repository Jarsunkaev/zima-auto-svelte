// src/lib/i18n/index.js
import { writable } from 'svelte/store';
import hu from './hu';
import en from './en';

export const translations = {
  hu,
  en
};

const initialLang = (typeof window !== 'undefined' && localStorage.getItem('app_language')) || 'hu';
export const currentLang = writable(initialLang);

if (typeof window !== 'undefined') {
  currentLang.subscribe((lang) => {
    try {
      localStorage.setItem('app_language', lang);
    } catch (e) {
      // ignore
    }
  });
}

export function t(key, lang) {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return value;
}