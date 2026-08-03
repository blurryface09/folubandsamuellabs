/**
 * Single source of truth for the public domain.
 *
 * The site moved from folubandsamuellabs.com to fslabs.tech after the original
 * domain was suspended. Keeping the domain here means the next move is one edit
 * instead of a hunt across eleven files.
 *
 * NEXT_PUBLIC_ matters: this value is read from client components as well as the
 * server, and NEXT_PUBLIC_ vars are inlined at build time. A server-only var
 * would be undefined on the client, silently fall back, and render a different
 * string than the server did — a hydration mismatch.
 */
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN?.trim() || "fslabs.tech";

/** Canonical origin, no trailing slash. */
export const SITE_URL = `https://${SITE_DOMAIN}`;

/**
 * Inbox that receives contact-form and enquiry mail, and the address shown
 * publicly on the site. Must be a real mailbox on the domain — it is the Zoho
 * account's primary address, not an alias.
 */
export const CONTACT_INBOX = `folubandsamuel@${SITE_DOMAIN}`;

/**
 * Envelope sender for transactional mail. Must belong to a domain verified in
 * Resend, or sends fail — see docs/DEPLOYMENT.md.
 */
export const MAIL_FROM = {
  fslabsContact: `FSLabs Contact <contact@${SITE_DOMAIN}>`,
  fslabs: `FSLabs <contact@${SITE_DOMAIN}>`,
  fslabsExchange: `FSLabs Exchange <exchange@${SITE_DOMAIN}>`,
  folubBuilders: `FOLUB Builders <contact@${SITE_DOMAIN}>`,
} as const;
