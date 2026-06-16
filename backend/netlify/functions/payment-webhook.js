// Receives PayPal webhooks (e.g. "PAYMENT.CAPTURE.COMPLETED" / "CHECKOUT.ORDER.APPROVED"),
// verifies the webhook signature via PayPal's "Verify Webhook Signature" API,
// identifies the purchased product, generates a signed download link,
// triggers a confirmation email, and logs the purchase.
//
// Why this MUST be a backend function and not frontend code:
// - Verifying a webhook requires server-to-server calls to PayPal using your
//   PAYPAL_CLIENT_SECRET, which must never be exposed to the browser.
// - Webhooks are server-to-server calls from PayPal; GitHub Pages (static
//   hosting) cannot receive or process them at all.
import { findProduct } from '../../lib/products.js';
import { createDownloadToken } from '../../lib/downloadToken.js';
import { jsonResponse } from '../../lib/cors.js';

const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken(clientId, clientSecret) {
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`Failed to get PayPal access token: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

// PayPal does not use a simple HMAC like Stripe — verification is a
// server-to-server call to PayPal's "Verify Webhook Signature" endpoint,
// using the PAYPAL_WEBHOOK_ID you get when registering the webhook in the
// PayPal Developer Dashboard.
async function verifyPayPalWebhook(event, accessToken, webhookId) {
  const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: event.headers['paypal-auth-algo'],
      cert_url: event.headers['paypal-cert-url'],
      transmission_id: event.headers['paypal-transmission-id'],
      transmission_sig: event.headers['paypal-transmission-sig'],
      transmission_time: event.headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: JSON.parse(event.body || '{}'),
    }),
  });
  if (!res.ok) return false;
  const result = await res.json();
  return result.verification_status === 'SUCCESS';
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_WEBHOOK_ID) {
    return jsonResponse(501, {
      error: 'Webhook not configured. Set PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET and PAYPAL_WEBHOOK_ID in your Netlify environment variables.',
    });
  }

  let webhookEvent;
  try {
    webhookEvent = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON payload' });
  }

  let accessToken;
  try {
    accessToken = await getPayPalAccessToken(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
  } catch (err) {
    console.error('Failed to get PayPal access token', err);
    return jsonResponse(502, { error: 'Could not reach PayPal to verify webhook' });
  }

  const isValid = await verifyPayPalWebhook(event, accessToken, PAYPAL_WEBHOOK_ID);
  if (!isValid) {
    return jsonResponse(400, { error: 'Invalid PayPal webhook signature' });
  }

  // Only act on the event that confirms money has actually been captured.
  if (webhookEvent.event_type !== 'PAYMENT.CAPTURE.COMPLETED') {
    return jsonResponse(200, { received: true, ignored: webhookEvent.event_type });
  }

  const resource = webhookEvent?.resource;
  const customId = resource?.custom_id || resource?.purchase_units?.[0]?.custom_id;
  let productId, lang;
  try {
    const parsed = JSON.parse(customId || '{}');
    productId = parsed.productId;
    lang = parsed.lang || 'en';
  } catch {
    return jsonResponse(400, { error: 'Missing or invalid custom_id in PayPal webhook payload' });
  }
  const customerEmail = resource?.payer?.email_address;

  if (!productId || !customerEmail) {
    return jsonResponse(400, { error: 'Missing productId or customer email in webhook payload' });
  }

  const product = findProduct(productId);
  if (!product) {
    return jsonResponse(404, { error: 'Unknown product in webhook payload' });
  }

  const DOWNLOAD_LINK_SECRET = process.env.DOWNLOAD_LINK_SECRET;
  if (!DOWNLOAD_LINK_SECRET) {
    return jsonResponse(501, { error: 'DOWNLOAD_LINK_SECRET not set — cannot generate secure download link.' });
  }

  // Link valid for 72 hours.
  const token = createDownloadToken(productId, 60 * 60 * 72, DOWNLOAD_LINK_SECRET);
  const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';
  const downloadLink = `${SITE_URL}/.netlify/functions/generate-download-link?token=${token}`;

  // Log the purchase. For an MVP without a database, we just log to the
  // function's console output (visible in Netlify function logs).
  // TODO (production): replace this with a real datastore write, e.g.
  // Supabase/Airtable/Google Sheets API, so you have a durable purchase record.
  console.log('PURCHASE_LOGGED', JSON.stringify({
    productId,
    customerEmail,
    amount: product.price,
    currency: product.currency,
    timestamp: new Date().toISOString(),
  }));

  // Send confirmation email by re-using the send-email function's logic directly
  // (calling it as a plain function avoids an extra network hop within Netlify).
  try {
    const { sendPurchaseConfirmationEmail } = await import('./send-email.js');
    await sendPurchaseConfirmationEmail({
      to: customerEmail,
      lang,
      productId,
      downloadLink,
    });
  } catch (err) {
    // Don't fail the whole webhook just because email sending had an issue —
    // log it so you can investigate, but still acknowledge the webhook (PayPal
    // will retry webhooks that return non-2xx, which could cause duplicate processing).
    console.error('Failed to send confirmation email', err);
  }

  return jsonResponse(200, { received: true });
}
