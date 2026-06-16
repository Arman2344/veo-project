// Two responsibilities, both around signed/time-limited download links:
// 1. GET ?token=... -> verifies the token and redirects to the actual file.
// 2. (Optional) POST { productId } -> issues a fresh token, for cases where
//    you want to re-generate a link (e.g. "resend my download link" flow).
//
// Why signed tokens: we don't want every product file URL to be guessable
// and permanently public. The token encodes productId + expiry and is
// signed with DOWNLOAD_LINK_SECRET, so it can't be forged or extended.
//
// File storage note: for the MVP, "real" files are expected to live in a
// place the function can redirect to — e.g. a private S3/Supabase Storage
// bucket with a long random path, or simply files served from
// frontend/public/files/ (less secure, but workable for low-stakes products).
// TODO: replace PRODUCT_FILE_BASE_URL below with your real file storage location.
import { findProduct } from '../../lib/products.js';
import { createDownloadToken, verifyDownloadToken } from '../../lib/downloadToken.js';
import { jsonResponse, corsHeaders } from '../../lib/cors.js';

const PRODUCT_FILE_BASE_URL = process.env.PRODUCT_FILE_BASE_URL || 'https://example-files.invalid/products';
// TODO: point this at your real private file storage (e.g. an S3 bucket with
// signed access, or a Supabase Storage bucket). The .invalid domain above is
// a deliberate placeholder that will never resolve, so failures are obvious.

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const DOWNLOAD_LINK_SECRET = process.env.DOWNLOAD_LINK_SECRET;
  if (!DOWNLOAD_LINK_SECRET) {
    return jsonResponse(501, { error: 'DOWNLOAD_LINK_SECRET not set.' });
  }

  if (event.httpMethod === 'GET') {
    const token = event.queryStringParameters?.token;
    if (!token) return jsonResponse(400, { error: 'Missing token' });

    const result = verifyDownloadToken(token, DOWNLOAD_LINK_SECRET);
    if (!result.valid) {
      return jsonResponse(403, { error: `Invalid or expired download link (${result.reason}).` });
    }

    const product = findProduct(result.productId);
    if (!product) return jsonResponse(404, { error: 'Unknown product' });

    const fileUrl = `${PRODUCT_FILE_BASE_URL}/${product.fullFile}`;
    return {
      statusCode: 302,
      headers: { Location: fileUrl, ...corsHeaders },
      body: '',
    };
  }

  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return jsonResponse(400, { error: 'Invalid JSON body' });
    }
    const product = findProduct(body.productId);
    if (!product) return jsonResponse(404, { error: 'Unknown productId' });

    const token = createDownloadToken(product.id, 60 * 60 * 72, DOWNLOAD_LINK_SECRET);
    const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';
    return jsonResponse(200, {
      downloadLink: `${SITE_URL}/.netlify/functions/generate-download-link?token=${token}`,
    });
  }

  return jsonResponse(405, { error: 'Method not allowed' });
}
