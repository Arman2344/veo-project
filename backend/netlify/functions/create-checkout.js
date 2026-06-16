// Creates a PayPal order and returns the approval URL the browser should
// redirect the buyer to.
//
// Why this can't live only in the frontend (GitHub Pages):
// - Creating an order with PayPal's API requires your PAYPAL_CLIENT_SECRET,
//   which must NEVER be exposed in client-side code. GitHub Pages can only
//   serve static files, so there is no safe place to keep that secret.
//   Netlify Functions run on a server where env vars stay private.
import { findProduct } from '../../lib/products.js';
import { jsonResponse, corsHeaders } from '../../lib/cors.js';

// PayPal has separate API hosts for sandbox (testing) and live (real money).
// Switch this once you're ready to accept real payments.
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
  if (!res.ok) {
    throw new Error(`Failed to get PayPal access token: ${res.status}`);
  }
  const data = await res.json();
  return data.access_token;
}

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

  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
  const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';

  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    // No payment provider configured yet — fail loudly and clearly instead of
    // pretending the purchase worked. This is intentional: we do not want a
    // fake "success" flow that silently does nothing.
    return jsonResponse(501, {
      error: 'Payment provider not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your Netlify environment variables.',
    });
  }

  const accessToken = await getPayPalAccessToken(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);

  const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: JSON.stringify({ productId: product.id, lang: lang || 'en' }),
          amount: {
            currency_code: product.currency,
            value: product.price.toFixed(2),
          },
          description: (product.title[lang] || product.title.en).slice(0, 127),
        },
      ],
      application_context: {
        brand_name: 'CreatorCraft',
        return_url: `${SITE_URL}/#/thank-you?productId=${product.id}`,
        cancel_url: `${SITE_URL}/#/products/${product.id}`,
      },
    }),
  });
  const order = await orderRes.json();
  if (!orderRes.ok) return jsonResponse(502, { error: 'PayPal error', details: order });
  const approveLink = order.links?.find((l) => l.rel === 'approve')?.href;
  return jsonResponse(200, { url: approveLink });
}
