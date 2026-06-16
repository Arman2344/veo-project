import { useI18n } from '../i18n/I18nContext';
import SocialLinks from './SocialLinks';

// Support email placeholder — replace with your real support address.
// Also used in backend email templates (backend/.env SUPPORT_EMAIL) — keep them in sync.
export const SUPPORT_EMAIL = 'support@example.com'; // TODO: replace with your real support email

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p>&copy; {year} CreatorCraft. {t('footer.rights')}</p>
          <p className="text-muted">{t('footer.contact')}: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
        </div>
        <div>
          <p>{t('footer.followUs')}</p>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
