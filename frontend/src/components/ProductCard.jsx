import { Link } from 'react-router-dom';
import { useI18n, pickLocalized } from '../i18n/I18nContext';
import { postJson } from '../lib/api';
import { trackEvent } from '../lib/track';

export default function ProductCard({ product }) {
  const { t, lang } = useI18n();

  async function handleBuy() {
    trackEvent('buy_click', { productId: product.id });
    try {
      // create-checkout is a Netlify Function. In production it talks to
      // a real payment provider (e.g. Stripe) and returns a redirect URL.
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
    trackEvent('free_sample_click', { productId: product.id });
    // For MVP, free samples can be served as static files from /public/samples/.
    // Place the matching file there, named exactly as freeSampleFile in products.json.
    window.location.href = `/samples/${product.freeSampleFile}`;
  }

  return (
    <div className="card product-card">
      <img src={product.image} alt={pickLocalized(product.title, lang)} width="100%" height="160" />
      <h3>{pickLocalized(product.title, lang)}</h3>
      <p className="text-muted">{pickLocalized(product.description, lang)}</p>
      <div className="price">${product.price} {product.currency}</div>
      <div className="card-actions">
        <Link to={`/products/${product.id}`} className="btn btn-outline">{t('products.viewDetails')}</Link>
        {product.hasFreeSample && (
          <button className="btn btn-secondary" onClick={handleFreeSample}>{t('products.freeSample')}</button>
        )}
        <button className="btn btn-primary" onClick={handleBuy}>{t('products.buyNow')}</button>
      </div>
    </div>
  );
}
