import crypto from "crypto";

const DEFAULT_SECRET = "concours_camer_secure_session_secret_key_2026_super_safe";
const SECRET = process.env.SESSION_SECRET || process.env.NEXTAUTH_SECRET || DEFAULT_SECRET;

/**
 * Signe un userId avec HMAC SHA-256
 * Format : `${userId}.${signature}`
 */
export function signSessionToken(userId: string): string {
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(userId);
  const signature = hmac.digest("base64url");
  return `${userId}.${signature}`;
}

/**
 * Vérifie l'intégrité de la signature du cookie de session
 * Retourne le userId valide ou null si la signature est invalide ou falsifiée.
 */
export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) {
    // Si c'est un UUID legacy sans signature, rejet strict pour empêcher la falsification
    return null;
  }

  const [userId, signature] = parts;
  if (!userId || !signature) return null;

  try {
    const hmac = crypto.createHmac("sha256", SECRET);
    hmac.update(userId);
    const expectedSignature = hmac.digest("base64url");

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    return userId;
  } catch (error) {
    return null;
  }
}
