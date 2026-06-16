// Minimal, privacy-friendly analytics endpoint.
// Receives a small event payload from frontend/src/lib/track.js and just logs
// it (visible in Netlify function logs) — no cookies, no third-party trackers,
// no personal data beyond what the event itself carries (we don't even store IP
// addresses here).
//
// For real production analytics, swap this for a privacy-friendly, cookie-free
// service such as Plausible, Umami, or Fathom:
//   1. Add their lightweight script tag to frontend/index.html, OR
//   2. Forward the event below to their HTTP ingestion API instead of/in
//      addition to logging it here.
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

  // TODO (production): forward to Plausible/Umami/Fathom's API here, e.g.:
  // await fetch('https://plausible.io/api/event', { method: 'POST', ... });
  console.log('EVENT_TRACKED', JSON.stringify({ ...body, receivedAt: new Date().toISOString() }));

  return jsonResponse(200, { ok: true });
}
