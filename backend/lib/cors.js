// Small helper to attach permissive CORS headers since the frontend (GitHub Pages)
// and backend (Netlify) live on different domains.
// Tighten ALLOWED_ORIGIN in production to your real frontend URL for better security.
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.SITE_URL || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(body),
  };
}
