import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const keyLength = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, keyLength).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash) {
    return false;
  }

  const [scheme, salt, hash] = storedHash.split(":");

  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const actual = Buffer.from(hash, "hex");
  const expected = scryptSync(password, salt, keyLength);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function validatePasswordStrength(password?: string | null) {
  if (!password || password.length < 10) {
    return "Use at least 10 characters.";
  }

  if (!/[a-z]/.test(password)) {
    return "Add at least one lowercase letter.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Add at least one uppercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Add at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Add at least one symbol.";
  }

  return null;
}
