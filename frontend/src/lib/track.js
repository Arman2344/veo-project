// Privacy-friendly, minimal analytics stub.
// This sends a tiny event to our own backend function (track-event.js),
// which currently just logs the event (no cookies, no third-party trackers).
//
// For real production analytics, swap this out for a privacy-friendly,
// cookie-free service such as Plausible, Umami, or Fathom:
//   1. Sign up and add their lightweight <script> snippet to index.html, OR
//   2. Keep calling trackEvent() but forward events to their HTTP API instead
//      of / in addition to our own track-event function.
// Either approach avoids invasive cross-site tracking and cookie banners.
import { getApiBaseUrl } from './api';

export function trackEvent(eventName, data = {}) {
  try {
    const payload = JSON.stringify({ event: eventName, data, path: window.location.pathname, ts: Date.now() });
    const url = `${getApiBaseUrl()}/track-event`;
    // navigator.sendBeacon is fire-and-forget and won't block page navigation.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, payload);
    } else {
      fetch(url, { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
    }
  } catch {
    // Never let analytics break the app.
  }
}
