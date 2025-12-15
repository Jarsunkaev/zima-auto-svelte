// src/lib/i18n/index.js
import { writable } from 'svelte/store';
import hu from './hu';
import en from './en';

export const translations = {
  hu,
  en
};

export const currentLang = writable('hu');

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