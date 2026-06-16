import { useI18n, pickLocalized } from '../i18n/I18nContext';
import affiliates from '../data/affiliates.json';
import { trackEvent } from '../lib/track';

export default function Affiliates() {
  const { t, lang } = useI18n();

  return (
    <section className="section">
      <div className="container">
        <h1 className="text-center">{t('affiliates.title')}</h1>
        <p className="text-center text-muted">{t('affiliates.subtitle')}</p>
        <p className="text-center text-muted" style={{ fontSize: '0.85rem' }}>{t('affiliates.disclosure')}</p>
        <div className="grid grid-3">
          {affiliates.map((a) => (
            <div key={a.id} className="card affiliate-card">
              <img src={a.image} alt={pickLocalized(a.name, lang)} width="100%" height="120" />
              <h3>{pickLocalized(a.name, lang)}</h3>
              <p className="text-muted">{pickLocalized(a.description, lang)}</p>
              <p className="affiliate-benefit">{pickLocalized(a.benefit, lang)}</p>
              <a
                href={a.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="btn btn-primary btn-block"
                onClick={() => trackEvent('affiliate_click', { affiliateId: a.id })}
              >
                {t('affiliates.cta')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
