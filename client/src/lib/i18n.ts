import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../language/en.json';
import am from '../language/am.json';
import or from '../language/or.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
      or: { translation: or },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
