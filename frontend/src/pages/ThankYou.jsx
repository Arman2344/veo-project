import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { SUPPORT_EMAIL } from '../components/Footer';

export default function ThankYou() {
  const { t } = useI18n();

  return (
    <section className="section container text-center">
      <h1>{t('thankYou.title')}</h1>
      <p>{t('thankYou.message')}</p>
      <p className="text-muted">{t('thankYou.checkEmail')}</p>
      <p className="text-muted">
        {t('thankYou.support')} <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
      </p>
      <Link to="/" className="btn btn-primary">{t('thankYou.backHome')}</Link>
    </section>
  );
}
