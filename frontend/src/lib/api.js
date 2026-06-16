// Central place for backend API access.
// VITE_API_BASE_URL should point to your deployed Netlify Functions site,
// e.g. https://your-site.netlify.app/.netlify/functions
// Set it in frontend/.env (see frontend/.env.example) for local dev,
// and as a build-time environment variable in your GitHub Actions / hosting config.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/.netlify/functions';

export async function postJson(path, body) {
  const res = await fetch(`${API_BASE_URL}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  return res.json().catch(() => ({}));
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
