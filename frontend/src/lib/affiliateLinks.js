// A syntactically valid URL does not establish an affiliate relationship.
// Only an explicitly verified affiliate URL can be shown as commission-bearing.
const PLACEHOLDER = /replace_with|placeholder|your[_-]?(?:affiliate|link)|\{\{|\}\}|<[^>]+>|\btodo\b/i;
const NON_PRODUCTION_HOST = /(^|\.)(?:localhost|local|test|invalid)$|(^|\.)example\.(?:com|org|net)$|^(?:127\.\d+\.\d+\.\d+|0\.0\.0\.0)$/i;

export function isUsableExternalUrl(value) {
  if (typeof value !== 'string' || !value.trim() || PLACEHOLDER.test(value)) return false;

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:'
      && url.hostname.includes('.')
      && !NON_PRODUCTION_HOST.test(url.hostname)
      && !url.username
      && !url.password;
  } catch {
    return false;
  }
}

export function getToolLink(tool) {
  if (tool?.affiliateVerified === true && isUsableExternalUrl(tool.affiliateUrl)) {
    return { href: tool.affiliateUrl.trim(), type: 'affiliate' };
  }

  if (isUsableExternalUrl(tool?.officialUrl)) {
    return { href: tool.officialUrl.trim(), type: 'official' };
  }

  return { href: null, type: 'unavailable' };
}

// Files in public/ are served under Vite's base path on GitHub Pages.
export function publicAssetUrl(path, baseUrl) {
  return `${baseUrl.replace(/\/?$/, '/')}${path.replace(/^\/+/, '')}`;
}
