import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="logo">CreatorCraft</Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">{t('nav.home')}</Link></li>
            <li><Link to="/products">{t('nav.products')}</Link></li>
            <li><Link to="/affiliates">{t('nav.affiliates')}</Link></li>
          </ul>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
