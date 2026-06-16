// Optional helper: fetches OpenGraph metadata (title/description/image) for a
// given URL server-side, to avoid CORS issues that would occur if the
// frontend tried to fetch another site's HTML directly from the browser.
//
// Currently unused by the Affiliates page (affiliate cards use manually
// curated copy in affiliates.json), but available as an enhancement if you
// want to auto-populate previews for new affiliate links in the future.
import { jsonResponse, corsHeaders } from '../../lib/cors.js';

function extractMetaTag(html, property) {
  const regex = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  const url = event.queryStringParameters?.url;
  if (!url) {
    return jsonResponse(400, { error: 'Missing url query parameter' });
  }

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OGFetcher/1.0)' } });
    if (!res.ok) {
      return jsonResponse(200, { title: null, description: null, image: null, fallback: true });
    }
    const html = await res.text();
    const metadata = {
      title: extractMetaTag(html, 'og:title'),
      description: extractMetaTag(html, 'og:description'),
      image: extractMetaTag(html, 'og:image'),
      fallback: false,
    };
    return jsonResponse(200, metadata);
  } catch (err) {
    console.error('fetch-og-metadata failed', err);
    // Fail gracefully — the frontend should fall back to its own manual copy.
    return jsonResponse(200, { title: null, description: null, image: null, fallback: true });
  }
}
