// Sends transactional emails via a provider's REST API using plain fetch
// (no heavy SDK). Documented concretely for Resend, but any provider with an
// HTTP API (SendGrid, Postmark, etc.) would follow the same pattern — just
// change the URL/headers/body shape.
//
// Why this must be a backend function:
// - Sending email requires an API key (EMAIL_API_KEY) that must stay secret.
//   GitHub Pages cannot hide secrets or make authenticated server-to-server calls.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findProduct } from '../../lib/products.js';
import { jsonResponse, corsHeaders } from '../../lib/cors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EMAILS_DIR = path.join(__dirname, '..', '..', 'emails');

// Human-readable product names per language, used only for email text.
// Keep this in sync with frontend/src/data/products.json titles.
const PRODUCT_NAMES = {
  'mindful-parenting-guide': { en: 'The Mindful Parenting Guide', de: 'Der Leitfaden für achtsame Elternschaft', fa: 'راهنمای والدگری آگاهانه' },
  'creator-social-template-pack': { en: 'Creator Social Media Template Pack', de: 'Social-Media-Vorlagenpaket für Creator', fa: 'پکیج قالب‌های شبکه‌های اجتماعی برای کریتورها' },
  'ebook-business-blueprint': { en: 'Write & Sell Your First PDF Book — The Blueprint', de: 'Schreibe & verkaufe dein erstes PDF-Buch — Der Bauplan', fa: 'نوشتن و فروش اولین کتاب PDF شما — نقشه راه' },
};

function renderTemplate(html, vars) {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value),
    html,
  );
}

/**
 * Sends a purchase confirmation email in the buyer's language.
 * Exported so payment-webhook.js can call it directly without an HTTP round-trip.
 */
export async function sendPurchaseConfirmationEmail({ to, lang = 'en', productId, downloadLink }) {
  const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@example.com';
  const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@example.com';

  const product = findProduct(productId);
  const productName = PRODUCT_NAMES[productId]?.[lang] || PRODUCT_NAMES[productId]?.en || productId;

  const templatePath = path.join(EMAILS_DIR, `confirmation.${lang}.html`);
  const fallbackPath = path.join(EMAILS_DIR, 'confirmation.en.html');
  const templateHtml = fs.readFileSync(fs.existsSync(templatePath) ? templatePath : fallbackPath, 'utf8');

  const html = renderTemplate(templateHtml, {
    name: to.split('@')[0],
    product: productName,
    downloadLink,
    supportEmail: SUPPORT_EMAIL,
  });

  if (!EMAIL_API_KEY) {
    // Don't pretend it worked — log clearly so it's obvious during local dev/testing.
    console.warn('EMAIL_API_KEY not set — skipping real send. Would have sent:', { to, productId, lang });
    return { sent: false, reason: 'no_api_key' };
  }

  // ---------------------------------------------------------------------
  // TODO (real Resend integration) — https://resend.com/docs/api-reference/emails/send-email
  // const res = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${EMAIL_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     from: EMAIL_FROM,
  //     to,
  //     subject: `Your download: ${productName}`,
  //     html,
  //   }),
  // });
  // if (!res.ok) throw new Error(`Email provider error: ${res.status} ${await res.text()}`);
  // return { sent: true };
  // ---------------------------------------------------------------------

  console.warn('send-email.js: provider call is a TODO. See comments for Resend example.');
  return { sent: false, reason: 'provider_not_implemented' };
}

// HTTP entry point, in case you want to trigger emails directly (e.g. for testing).
export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  try {
    const result = await sendPurchaseConfirmationEmail(body);
    return jsonResponse(200, result);
  } catch (err) {
    console.error(err);
    return jsonResponse(500, { error: 'Failed to send email' });
  }
}
