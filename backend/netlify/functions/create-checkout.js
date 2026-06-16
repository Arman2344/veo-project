// Creates a checkout session for a product and returns a redirect URL.
//
// This is a clearly-marked REAL STRUCTURE for Stripe Checkout, but the actual
// call to Stripe's API is a TODO — you must plug in your own Stripe secret key
// and (optionally) the Stripe Node SDK or raw REST calls to go live.
//
// Why this can't live only in the frontend (GitHub Pages):
// - Creating a Checkout Session requires your STRIPE_SECRET_KEY, which must
//   NEVER be exposed in client-side code. GitHub Pages can only serve static
//   files, so there is no safe place to keep that secret. Netlify Functions
//   run on a server where env vars stay private.
import { findProduct } from '../../lib/products.js';
import { jsonResponse, corsHeaders } from '../../lib/cors.js';

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

  const { productId, lang } = body;
  const product = findProduct(productId);
  if (!product) {
    return jsonResponse(404, { error: 'Unknown productId' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';

  if (!STRIPE_SECRET_KEY) {
    // No payment provider configured yet — fail loudly and clearly instead of
    // pretending the purchase worked. This is intentional: we do not want a
    // fake "success" flow that silently does nothing.
    return jsonResponse(501, {
      error: 'Payment provider not configured. Set STRIPE_SECRET_KEY in your Netlify environment variables.',
    });
  }

  // ---------------------------------------------------------------------
  // TODO (real Stripe integration):
  // Use Stripe's REST API directly (no SDK needed, just fetch) to create a
  // Checkout Session, e.g.:
  //
  // const params = new URLSearchParams({
  //   'mode': 'payment',
  //   'success_url': `${SITE_URL}/#/thank-you?session_id={CHECKOUT_SESSION_ID}`,
  //   'cancel_url': `${SITE_URL}/#/products/${product.id}`,
  //   'line_items[0][price_data][currency]': product.currency.toLowerCase(),
  //   'line_items[0][price_data][product_data][name]': product.title[lang] || product.title.en,
  //   'line_items[0][price_data][unit_amount]': String(product.price * 100), // cents
  //   'line_items[0][quantity]': '1',
  //   'metadata[productId]': product.id,
  //   'metadata[lang]': lang || 'en',
  // });
  //
  // const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   body: params,
  // });
  // const session = await stripeRes.json();
  // if (!stripeRes.ok) return jsonResponse(502, { error: 'Stripe error', details: session });
  // return jsonResponse(200, { url: session.url });
  // ---------------------------------------------------------------------

  return jsonResponse(501, {
    error: 'create-checkout is a placeholder. Implement the Stripe (or other provider) call above before going live.',
  });
}
