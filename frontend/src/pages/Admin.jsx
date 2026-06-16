import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import products from '../data/products.json';
import affiliates from '../data/affiliates.json';

// IMPORTANT: This is NOT real authentication. It's a simple client-side
// "convenience gate" so casual visitors don't stumble onto this page.
// The "password" is shipped inside the public JS bundle and can be trivially
// extracted by anyone who opens devtools — never use this to protect secrets.
//
// For a real admin area with multiple users, roles, and secure login, you'd
// need a backend with proper authentication (e.g. Netlify Identity, Auth0,
// Supabase Auth) and a database — that's out of scope for this MVP.
// For now, the actual source of truth is:
//   frontend/src/data/products.json
//   frontend/src/data/affiliates.json
// Edit those files directly (locally or via GitHub) to change products/affiliates.
const ADMIN_CODE = 'letmein'; // TODO: change this if you keep using the gate at all

export default function Admin() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (input === ADMIN_CODE) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!unlocked) {
    return (
      <div className="container admin-gate">
        <h1>{t('admin.title')}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder={t('admin.passwordPrompt')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            {t('admin.submit')}
          </button>
        </form>
        {error && <p className="form-message error">{t('admin.wrongPassword')}</p>}
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>{t('admin.title')}</h1>
      <p className="text-muted">{t('admin.notice')}</p>

      <h2>{t('admin.products')}</h2>
      <pre className="data-viewer">{JSON.stringify(products, null, 2)}</pre>

      <h2>{t('admin.affiliates')}</h2>
      <pre className="data-viewer">{JSON.stringify(affiliates, null, 2)}</pre>
    </div>
  );
}
