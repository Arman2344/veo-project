// Receives payment-provider webhooks (e.g. Stripe "checkout.session.completed"),
// verifies the webhook signature, identifies the purchased product, generates a
// signed download link, triggers a confirmation email, and logs the purchase.
//
// Why this MUST be a backend function and not frontend code:
// - Verifying a webhook signature requires a secret (STRIPE_WEBHOOK_SECRET)
//   that must never be exposed to the browser.
// - Webhooks are server-to-server calls from the payment provider; GitHub
//   Pages (static hosting) cannot receive or process them at all.
import crypto from 'node:crypto';
import { findProduct } from '../../lib/products.js';
import { createDownloadToken } from '../../lib/downloadToken.js';
import { jsonResponse } from '../../lib/cors.js';

// ---------------------------------------------------------------------------
// TODO (real Stripe signature verification):
// Stripe signs webhooks using the `Stripe-Signature` header and a timestamp +
// HMAC-SHA256 scheme. Verify like this (no SDK required):
//
//   function verifyStripeSignature(rawBody, sigHeader, secret) {
//     const parts = Object.fromEntries(sigHeader.split(',').map((kv) => kv.split('=')));
//     const signedPayload = `${parts.t}.${rawBody}`;
//     const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
//     return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
//   }
//
// Then reject the request with 400 if verification fails.
// ---------------------------------------------------------------------------

function verifyWebhookSignature(rawBody, signatureHeader, secret) {
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }
  if (!signatureHeader) return false;

  try {
    const parts = Object.fromEntries(signatureHeader.split(',').map((kv) => kv.split('=')));
    const signedPayload = `${parts.t}.${rawBody}`;
    const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
    const expectedBuf = Buffer.from(expected);
    const actualBuf = Buffer.from(parts.v1 || '');
    return expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  const signatureHeader = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const rawBody = event.body || '';

  if (!WEBHOOK_SECRET) {
    return jsonResponse(501, {
      error: 'Webhook not configured. Set STRIPE_WEBHOOK_SECRET in your Netlify environment variables.',
    });
  }

  const isValid = verifyWebhookSignature(rawBody, signatureHeader, WEBHOOK_SECRET);
  if (!isValid) {
    return jsonResponse(400, { error: 'Invalid webhook signature' });
  }

  let stripeEvent;
  try {
    stripeEvent = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON payload' });
  }

  // TODO: handle the real Stripe event shape. Example for checkout.session.completed:
  // const session = stripeEvent.data.object;
  // const productId = session.metadata?.productId;
  // const customerEmail = session.customer_details?.email;
  // const lang = session.metadata?.lang || 'en';
  const productId = stripeEvent?.data?.object?.metadata?.productId;
  const customerEmail = stripeEvent?.data?.object?.customer_details?.email;
  const lang = stripeEvent?.data?.object?.metadata?.lang || 'en';

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
    // log it so you can investigate, but still acknowledge the webhook (Stripe
    // will retry webhooks that return non-2xx, which could cause duplicate processing).
    console.error('Failed to send confirmation email', err);
  }

  return jsonResponse(200, { received: true });
}
