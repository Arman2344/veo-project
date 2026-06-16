import { useParams, Link } from 'react-router-dom';
import { useI18n, pickLocalized } from '../i18n/I18nContext';
import products from '../data/products.json';
import FAQ from '../components/FAQ';
import { postJson } from '../lib/api';
import { trackEvent } from '../lib/track';

export default function ProductDetail() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container section">
        <h1>Product not found</h1>
        <Link to="/products">{t('products.title')}</Link>
      </div>
    );
  }

  const faqItems = (product.faq?.[lang] || product.faq?.en || []).map((f) => ({ q: f.q, a: f.a }));

  async function handleBuy() {
    trackEvent('buy_click', { productId: product.id, page: 'detail' });
    try {
      const result = await postJson('create-checkout', { productId: product.id, lang });
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert('Checkout is not fully configured yet. See backend/netlify/functions/create-checkout.js');
      }
    } catch (err) {
      console.error(err);
      alert('Could not start checkout. Please try again later.');
    }
  }

  function handleFreeSample() {
    trackEvent('free_sample_click', { productId: product.id, page: 'detail' });
    window.location.href = `/samples/${product.freeSampleFile}`;
  }

  return (
    <div className="container section">
      <img src={product.image} alt={pickLocalized(product.title, lang)} style={{ maxWidth: 320, margin: '0 auto 1.5rem' }} />
      <h1>{pickLocalized(product.title, lang)}</h1>
      <p className="text-muted">{pickLocalized(product.description, lang)}</p>
      <div className="price">${product.price} {product.currency}</div>

      <div className="card-actions" style={{ margin: '1.5rem 0' }}>
        {product.hasFreeSample && (
          <button className="btn btn-secondary" onClick={handleFreeSample}>{t('products.freeSample')}</button>
        )}
        <button className="btn btn-primary" onClick={handleBuy}>{t('products.buy')}</button>
      </div>
      <p className="text-muted">{t('products.secureDelivery')}</p>

      <h2>{t('products.benefits')}</h2>
      <ul>
        {(product.benefits?.[lang] || product.benefits?.en || []).map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      <h2>{t('products.whatsIncluded')}</h2>
      <ul>
        {(product.included?.[lang] || product.included?.en || []).map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      <h2>{t('products.faq')}</h2>
      <FAQ items={faqItems} />
    </div>
  );
}
