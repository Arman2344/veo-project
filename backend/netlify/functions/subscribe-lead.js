// Handles the email-capture / lead-magnet form on the homepage.
// For the MVP, we just validate + log the lead. Swap in a real datastore
// before going live (see TODO below).
//
// Why this needs a backend: storing leads durably and reliably (and avoiding
// spam) is not something a static GitHub Pages site can do — there's no
// server to write to a database or call a third-party API with a secret key.
import { jsonResponse, corsHeaders } from '../../lib/cors.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const { email, honeypot } = body;

  // Basic honeypot spam check: real users never fill this hidden field.
  if (honeypot) {
    // Pretend success to not tip off bots, but don't actually store anything.
    return jsonResponse(200, { ok: true });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return jsonResponse(400, { error: 'Invalid email address' });
  }

  // TODO (production): replace this console.log with a real storage call, e.g.:
  // - Supabase: insert into a "leads" table via its REST API
  // - Airtable: POST to https://api.airtable.com/v0/{baseId}/{table} with AIRTABLE_API_KEY
  // - Or forward straight to your email provider's "add contact to list" endpoint
  //   (e.g. Resend audiences, ConvertKit/Kit API, Mailchimp API).
  console.log('LEAD_CAPTURED', JSON.stringify({ email, timestamp: new Date().toISOString() }));

  // Optionally also trigger the free-sample confirmation email here by calling
  // sendPurchaseConfirmationEmail-style logic with a "lead magnet" template —
  // left as a TODO since it depends on which free sample you want to send.

  return jsonResponse(200, { ok: true });
}
