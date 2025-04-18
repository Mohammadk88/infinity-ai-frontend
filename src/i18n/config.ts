// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import tr from './locales/tr.json';
import ru from './locales/ru.json';
import de from './locales/de.json';
import fa from './locales/fa.json';
import ur from './locales/ur.json';

// Define RTL languages
export const RTL_LANGUAGES = ['ar', 'fa', 'ur'];

// Check if current language is RTL
export const isRTL = (language: string) => RTL_LANGUAGES.includes(language);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      fr: { translation: fr },
      es: { translation: es },
      tr: { translation: tr },
      ru: { translation: ru },
      de: { translation: de },
      fa: { translation: fa },
      ur: { translation: ur },
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
