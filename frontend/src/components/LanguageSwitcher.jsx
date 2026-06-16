import { LANGUAGES, useI18n } from '../i18n/I18nContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="lang-switcher" role="group" aria-label="Language switcher">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          className={l.code === lang ? 'active' : ''}
          onClick={() => setLang(l.code)}
          aria-pressed={l.code === lang}
        >
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
