const COOKIE_NAME = 'hmns_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  return keyMaterial;
}

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

export async function signSession(payload: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return `${payload}.${bufToHex(sig)}`;
}

export async function verifySession(token: string, secret: string): Promise<string | null> {
  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot);
  const sigHex = token.slice(lastDot + 1);
  const key = await getKey(secret);
  const enc = new TextEncoder();
  const valid = await crypto.subtle.verify('HMAC', key, hexToBuf(sigHex), enc.encode(payload));
  return valid ? payload : null;
}

export function makeSessionCookie(value: string): string {
  return `${COOKIE_NAME}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${COOKIE_MAX_AGE}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function getSessionCookie(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  return match ? match[1] : null;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // storedHash format: "pbkdf2:sha256:iterations:salt:hash" (all hex)
  const parts = storedHash.split(':');
  if (parts.length !== 5 || parts[0] !== 'pbkdf2') return false;
  const [, , iterStr, saltHex, hashHex] = parts;
  const iterations = parseInt(iterStr, 10);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBuf(saltHex),
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  const derivedHex = bufToHex(derived);
  return derivedHex === hashHex;
}

export async function requireAuth(
  cookieHeader: string | null | undefined,
  secret: string
): Promise<string | null> {
  const token = getSessionCookie(cookieHeader);
  if (!token) return null;
  return verifySession(token, secret);
}
