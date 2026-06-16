import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import { useI18n } from '../i18n/I18nContext';

export default function Products() {
  const { t } = useI18n();

  return (
    <section className="section">
      <div className="container">
        <h1 className="text-center">{t('products.title')}</h1>
        <p className="text-center text-muted">{t('products.subtitle')}</p>
        <div className="grid grid-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
