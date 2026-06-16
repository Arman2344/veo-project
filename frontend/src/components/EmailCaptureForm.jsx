import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { postJson } from '../lib/api';
import { trackEvent } from '../lib/track';

export default function EmailCaptureForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  // Honeypot field: real users never see/fill this (hidden via CSS).
  // Bots that auto-fill every field will get caught by the backend check.
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await postJson('subscribe-lead', { email, honeypot });
      trackEvent('lead_signup');
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <div className="email-capture">
      <h2>{t('email.title')}</h2>
      <p className="text-muted">{t('email.subtitle')}</p>
      <form onSubmit={handleSubmit}>
        {/* Honeypot field — hidden from real users via CSS, bots often fill it anyway */}
        <div className="honeypot-field" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
        <input
          type="email"
          required
          placeholder={t('email.placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {t('email.submit')}
        </button>
      </form>
      {status === 'success' && <p className="form-message success">{t('email.success')}</p>}
      {status === 'error' && <p className="form-message error">{t('email.error')}</p>}
    </div>
  );
}
