import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import guTranslations from './locales/gu.json';
import hiTranslations from './locales/hi.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  gu: {
    translation: guTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
