// Shared helper for creating and verifying signed, time-limited download tokens.
// Uses HMAC-SHA256 with a secret stored in the DOWNLOAD_LINK_SECRET env var.
// This avoids needing a database just to issue temporary download links:
// the token itself encodes (productId, expiry) and is tamper-proof because
// only the server knows the secret used to sign it.
import crypto from 'node:crypto';

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

/**
 * Create a signed download token.
 * @param {string} productId
 * @param {number} expiresInSeconds how long the link should remain valid
 * @param {string} secret value of process.env.DOWNLOAD_LINK_SECRET
 */
export function createDownloadToken(productId, expiresInSeconds, secret) {
  if (!secret) throw new Error('DOWNLOAD_LINK_SECRET is not set');
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  const payload = base64url(JSON.stringify({ productId, expiresAt }));
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
}

/**
 * Verify a token previously created with createDownloadToken.
 * Returns { valid: boolean, productId?: string, reason?: string }
 */
export function verifyDownloadToken(token, secret) {
  if (!secret) throw new Error('DOWNLOAD_LINK_SECRET is not set');
  if (!token || !token.includes('.')) return { valid: false, reason: 'malformed' };

  const [payload, signature] = token.split('.');
  const expectedSignature = sign(payload, secret);

  // Constant-time comparison to avoid timing attacks.
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, reason: 'bad_signature' };
  }

  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return { valid: false, reason: 'bad_payload' };
  }

  if (Date.now() > data.expiresAt) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true, productId: data.productId };
}
