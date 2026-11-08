import { useI18n, pickLocalized } from '../i18n/I18nContext';
import affiliates from '../data/affiliates.json';
import { trackEvent } from '../lib/track';
import { getToolLink, publicAssetUrl } from '../lib/affiliateLinks';

export function AffiliateCard({ affiliate, lang, t }) {
  const link = getToolLink(affiliate);

  return (
    <div className="card affiliate-card">
      <img
        src={publicAssetUrl(affiliate.image, import.meta.env.BASE_URL)}
        alt={pickLocalized(affiliate.name, lang)}
        width="100%"
        height="120"
      />
      <h3>{pickLocalized(affiliate.name, lang)}</h3>
      <p className="text-muted">{pickLocalized(affiliate.description, lang)}</p>
      <div className="affiliate-actions">
        {link.href ? (
          <a
            href={link.href}
            target="_blank"
            rel={link.type === 'affiliate' ? 'sponsored nofollow noopener noreferrer' : 'noopener noreferrer'}
            className="btn btn-primary btn-block"
            onClick={() => trackEvent(link.type === 'affiliate' ? 'affiliate_click' : 'official_tool_click', { toolId: affiliate.id })}
          >
            {t(link.type === 'affiliate' ? 'affiliates.affiliateCta' : 'affiliates.officialCta')}
          </a>
        ) : (
          <button type="button" disabled className="btn btn-primary btn-block">
            {t('affiliates.unavailableCta')}
          </button>
        )}
        <p className="affiliate-link-note text-muted">
          {t(`affiliates.${link.type}Label`)}
        </p>
      </div>
    </div>
  );
}

export default function Affiliates() {
  const { t, lang } = useI18n();
  const hasAffiliateLink = affiliates.some((affiliate) => getToolLink(affiliate).type === 'affiliate');

  return (
    <section className="section">
      <div className="container">
        <h1 className="text-center">{t('affiliates.title')}</h1>
        <p className="text-center text-muted">{t('affiliates.subtitle')}</p>
        <p className="text-center text-muted" style={{ fontSize: '0.85rem' }}>{t('affiliates.disclosure')}</p>
        {!hasAffiliateLink && <p className="text-center text-muted">{t('affiliates.noVerifiedLinks')}</p>}
        <div className="grid grid-3">
          {affiliates.map((a) => (
            <AffiliateCard key={a.id} affiliate={a} lang={lang} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
