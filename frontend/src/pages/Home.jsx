import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import EmailCaptureForm from '../components/EmailCaptureForm';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import { useI18n } from '../i18n/I18nContext';

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      <Hero />
      <TrustSection />
      <section className="section">
        <div className="container">
          <h2 className="text-center">{t('products.title')}</h2>
          <p className="text-center text-muted">{t('products.subtitle')}</p>
          <div className="grid grid-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      <section className="section section-alt">
        <div className="container">
          <EmailCaptureForm />
        </div>
      </section>
    </>
  );
}
