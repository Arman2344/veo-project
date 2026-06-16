import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.json';
import de from './de.json';
import fa from './fa.json';

// Simple, dependency-free i18n implementation.
// Translations live in en.json / de.json / fa.json as flat-ish nested objects.
// Usage: const { t, lang, setLang } = useI18n(); t('hero.headline')

const dictionaries = { en, de, fa };

export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'fa', label: 'فارسی/دری', dir: 'rtl' },
];

const STORAGE_KEY = 'site_lang';

function getInitialLang() {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && dictionaries[stored]) return stored;
  const browserLang = (navigator.language || 'en').slice(0, 2);
  if (dictionaries[browserLang]) return browserLang;
  return 'en';
}

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  const dir = useMemo(() => LANGUAGES.find((l) => l.code === lang)?.dir || 'ltr', [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const t = useMemo(() => {
    return (key, fallback) => {
      const value = getByPath(dictionaries[lang], key);
      if (value !== undefined) return value;
      const fallbackValue = getByPath(dictionaries.en, key);
      return fallbackValue !== undefined ? fallbackValue : fallback || key;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, dir, t }), [lang, dir, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

// Helper to pick a localized field from a data object like { en: "...", de: "...", fa: "..." }
export function pickLocalized(field, lang) {
  if (!field) return '';
  return field[lang] || field.en || '';
}
