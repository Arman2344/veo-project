import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { trackEvent } from '../lib/track';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero container">
      <h1>{t('hero.headline')}</h1>
      <p>{t('hero.subheadline')}</p>
      <div className="hero-ctas">
        <Link
          to="/products"
          className="btn btn-primary"
          onClick={() => trackEvent('cta_click', { cta: 'free_sample' })}
        >
          {t('hero.ctaFreeSample')}
        </Link>
        <Link
          to="/products"
          className="btn btn-secondary"
          onClick={() => trackEvent('cta_click', { cta: 'buy_full' })}
        >
          {t('hero.ctaBuyFull')}
        </Link>
        <Link
          to="/affiliates"
          className="btn btn-outline"
          onClick={() => trackEvent('cta_click', { cta: 'view_tools' })}
        >
          {t('hero.ctaAffiliates')}
        </Link>
      </div>
    </section>
  );
}
