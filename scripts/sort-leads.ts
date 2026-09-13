/**
 * Lead sorter → SuperMailer export.
 *
 * Reads one or more CSV/TSV/TXT files of leads, normalises and de-duplicates
 * them, derives First/Last name, and writes SuperMailer-ready CSV files.
 *
 *   npx tsx scripts/sort-leads.ts leads.csv --out out/
 *   npx tsx scripts/sort-leads.ts a.csv b.csv --out out/ --delimiter ";" --tag "2025 Participants"
 *
 * Outputs in --out:
 *   supermailer.csv   personal addresses, ready to import
 *   role-accounts.csv info@/support@/etc — send to these deliberately, not in bulk
 *   rejected.csv      invalid / unusable rows, with a reason column
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";
import { resolveMx } from "node:dns/promises";

type Lead = {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  company: string;
  source: string;
  domain: string;
  provider: string;
};

type Rejected = { value: string; reason: string; source: string };

// ---------- CSV ----------

function detectDelimiter(line: string): string {
  const counts = [",", ";", "\t", "|"].map((d) => [d, line.split(d).length] as const);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 1 ? counts[0][0] : ",";
}

function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function toCsv(rows: string[][], delimiter: string): string {
  const escape = (value: string) =>
    /["\n\r]/.test(value) || value.includes(delimiter) ? `"${value.replace(/"/g, '""')}"` : value;
  return rows.map((r) => r.map(escape).join(delimiter)).join("\r\n") + "\r\n";
}

// ---------- Email ----------

// Deliberately conservative: one @, no spaces, a dot-bearing TLD of 2+ chars.
const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const ROLE_LOCALS = new Set([
  "info", "admin", "support", "sales", "contact", "hello", "help", "office",
  "team", "enquiries", "inquiries", "careers", "hr", "billing", "accounts",
  "noreply", "no-reply", "donotreply", "postmaster", "webmaster", "mail",
  "marketing", "service", "services", "feedback", "press", "media",
]);

// Typos common in hand-entered lists; extend as you meet new ones.
const DOMAIN_FIXES: Record<string, string> = {
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.comm": "gmail.com",
  "yahoo.co": "yahoo.com",
  "yaho.com": "yahoo.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
};

function extractEmail(raw: string): string | null {
  // Handles "Jane Doe <jane@x.com>", "mailto:jane@x.com", stray punctuation.
  const cleaned = raw.replace(/^mailto:/i, "").trim();
  const angle = cleaned.match(/<([^>]+)>/);
  const candidate = (angle ? angle[1] : cleaned).trim().replace(/^[<("']+|[>)"',.;]+$/g, "");
  if (!candidate.includes("@")) return null;
  const [local, ...rest] = candidate.split("@");
  if (rest.length !== 1) return null;
  let domain = rest[0].toLowerCase();
  domain = DOMAIN_FIXES[domain] ?? domain;
  const email = `${local}@${domain}`;
  return EMAIL_RE.test(email) ? email.toLowerCase() : null;
}

function isRoleAccount(email: string): boolean {
  return ROLE_LOCALS.has(email.split("@")[0]);
}

// Gmail ignores dots and +tags; use a canonical form for de-duplication only.
function dedupeKey(email: string): string {
  const [local, domain] = email.split("@");
  const isGoogle = domain === "gmail.com" || domain === "googlemail.com";
  let key = local.split("+")[0];
  if (isGoogle) key = key.replace(/\./g, "");
  return `${key}@${isGoogle ? "gmail.com" : domain}`;
}

// ---------- Mailbox provider ----------

// Which mail platform actually hosts the address. Matters for sending:
// Google and Microsoft apply the strictest bulk-sender rules, and free
// consumer domains behave very differently from company mailboxes.
const CONSUMER_DOMAINS: Record<string, string> = {
  "gmail.com": "Google",
  "googlemail.com": "Google",
  "outlook.com": "Microsoft",
  "hotmail.com": "Microsoft",
  "hotmail.co.uk": "Microsoft",
  "live.com": "Microsoft",
  "msn.com": "Microsoft",
  "yahoo.com": "Yahoo",
  "yahoo.co.uk": "Yahoo",
  "ymail.com": "Yahoo",
  "rocketmail.com": "Yahoo",
  "aol.com": "Yahoo",
  "icloud.com": "Apple",
  "me.com": "Apple",
  "mac.com": "Apple",
  "proton.me": "Proton",
  "protonmail.com": "Proton",
  "pm.me": "Proton",
  "zoho.com": "Zoho",
  "gmx.com": "GMX",
  "mail.com": "GMX",
  "yandex.com": "Yandex",
};

// MX hostname fingerprints for custom domains (fslabs.tech, acme.com, ...).
const MX_SIGNATURES: [RegExp, string][] = [
  [/aspmx.*\.google\.com$|googlemail\.com$/i, "Google Workspace"],
  [/\.outlook\.com$|\.protection\.outlook\.com$/i, "Microsoft 365"],
  [/\.zoho\.(com|eu|in)$/i, "Zoho"],
  [/\.protonmail\.ch$|\.proton\.me$/i, "Proton"],
  [/\.yahoodns\.net$/i, "Yahoo"],
  [/\.mail\.icloud\.com$/i, "Apple"],
  [/\.messagingengine\.com$/i, "Fastmail"],
  [/\.zoho|\.improvmx\.com$/i, "ImprovMX"],
  [/\.mimecast\.com$/i, "Mimecast"],
  [/\.pphosted\.com$|\.ppe-hosted\.com$/i, "Proofpoint"],
  [/\.secureserver\.net$/i, "GoDaddy"],
  [/\.registrar-servers\.com$|privateemail\.com$/i, "Namecheap"],
  [/\.titan\.email$|\.flockmail\.com$/i, "Titan"],
  [/\.yandex\.net$/i, "Yandex"],
  [/\.hostinger|\.hostingermail/i, "Hostinger"],
];

function providerFromDomain(domain: string): string {
  return CONSUMER_DOMAINS[domain] ?? "Other";
}

/** Resolve MX records to name the platform behind each custom domain. */
async function resolveProviders(domains: string[]): Promise<Map<string, string>> {
  const resolved = new Map<string, string>();
  const queue = [...domains];
  const workers = Array.from({ length: 10 }, async () => {
    for (;;) {
      const domain = queue.shift();
      if (!domain) return;
      try {
        const records = await resolveMx(domain);
        records.sort((a, b) => a.priority - b.priority);
        // A null MX (a lone ".") means the domain explicitly accepts no mail.
        const hosts = records.map((r) => r.exchange.trim().replace(/\.$/, "")).filter(Boolean);
        const hit = MX_SIGNATURES.find(([re]) => hosts.some((h) => re.test(h)));
        if (hit) resolved.set(domain, hit[1]);
        else if (hosts.length > 0) resolved.set(domain, `Self-hosted (${hosts[0]})`);
        else resolved.set(domain, "No MX — undeliverable");
      } catch {
        resolved.set(domain, "No MX — undeliverable");
      }
    }
  });
  await Promise.all(workers);
  return resolved;
}

// ---------- Names ----------

const NAME_PARTICLES = new Set(["de", "da", "van", "von", "der", "del", "di", "la", "le", "bin", "al"]);

function titleCase(word: string): string {
  if (!word) return word;
  const lower = word.toLowerCase();
  if (NAME_PARTICLES.has(lower)) return lower;
  // O'Brien, Mary-Jane
  return lower.replace(/(^|['\-])([a-z])/g, (_m, sep: string, ch: string) => sep + ch.toUpperCase());
}

function splitFullName(full: string): { firstName: string; lastName: string } {
  let name = full.replace(/\s+/g, " ").trim();
  if (!name) return { firstName: "", lastName: "" };

  // "Doe, Jane" → "Jane Doe"
  if (name.includes(",")) {
    const [last, first] = name.split(",").map((p) => p.trim());
    if (first) name = `${first} ${last}`;
  }

  const parts = name
    .split(" ")
    .filter((p) => !/^(mr|mrs|ms|miss|dr|prof|engr|barr|rev|sir|chief)\.?$/i.test(p))
    .filter(Boolean);

  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: titleCase(parts[0]), lastName: "" };

  const first = titleCase(parts[0]);
  const rest = parts.slice(1);
  // Keep particles attached to the surname: "Jane van der Berg".
  const lastStart = rest.findIndex((p) => NAME_PARTICLES.has(p.toLowerCase()));
  const lastParts = lastStart >= 0 ? rest.slice(lastStart) : [rest[rest.length - 1]];
  return { firstName: first, lastName: lastParts.map(titleCase).join(" ") };
}

function nameFromEmail(email: string): { firstName: string; lastName: string } {
  const local = email.split("@")[0].split("+")[0];
  const parts = local
    .split(/[._\-]+/)
    .map((p) => p.replace(/\d+/g, ""))
    .filter((p) => p.length > 1);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: titleCase(parts[0]), lastName: "" };
  return { firstName: titleCase(parts[0]), lastName: parts.slice(1).map(titleCase).join(" ") };
}

// ---------- Column mapping ----------

const HEADER_ALIASES: Record<string, string[]> = {
  email: ["email", "email address", "e-mail", "mail", "emailaddress", "work email"],
  fullName: ["name", "full name", "fullname", "participant", "participant name", "contact", "contact name"],
  firstName: ["first name", "firstname", "first", "given name", "fname"],
  lastName: ["last name", "lastname", "last", "surname", "family name", "lname"],
  company: ["company", "organisation", "organization", "org", "business", "employer"],
};

function mapHeaders(header: string[]): Record<string, number> {
  const map: Record<string, number> = {};
  header.forEach((raw, index) => {
    const key = raw.trim().toLowerCase();
    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      if (map[field] === undefined && aliases.includes(key)) map[field] = index;
    }
  });
  return map;
}

function looksLikeHeader(row: string[]): boolean {
  return row.some((cell) => cell.includes("@")) === false;
}

// ---------- Pipeline ----------

function processFile(path: string, forcedDelimiter?: string) {
  const text = readFileSync(path, "utf8").replace(/^﻿/, "");
  const firstLine = text.split("\n")[0] ?? "";
  const delimiter = forcedDelimiter ?? detectDelimiter(firstLine);
  const rows = parseDelimited(text, delimiter);
  const source = basename(path);

  const leads: Lead[] = [];
  const rejected: Rejected[] = [];
  if (rows.length === 0) return { leads, rejected };

  const hasHeader = looksLikeHeader(rows[0]);
  const columns = hasHeader ? mapHeaders(rows[0]) : {};
  const body = hasHeader ? rows.slice(1) : rows;

  for (const row of body) {
    const cell = (index?: number) => (index === undefined ? "" : (row[index] ?? "").trim());

    // Find the email wherever it is: mapped column, else first cell containing "@".
    let email: string | null = null;
    let rawEmail = cell(columns.email);
    if (rawEmail) email = extractEmail(rawEmail);
    if (!email) {
      for (const value of row) {
        const found = extractEmail(value);
        if (found) {
          email = found;
          rawEmail = value.trim();
          break;
        }
      }
    }
    if (!email) {
      const shown = row.join(delimiter).trim();
      if (shown) rejected.push({ value: shown, reason: rawEmail ? "invalid email" : "no email found", source });
      continue;
    }

    const explicitFirst = cell(columns.firstName);
    const explicitLast = cell(columns.lastName);
    let firstName = explicitFirst;
    let lastName = explicitLast;

    if (!firstName) {
      const full = cell(columns.fullName) || (hasHeader ? "" : row.find((v) => v.trim() && !v.includes("@")) || "");
      const split = splitFullName(full);
      firstName = split.firstName;
      lastName = lastName || split.lastName;
    } else {
      firstName = titleCase(firstName);
      lastName = lastName ? lastName.split(" ").map(titleCase).join(" ") : "";
    }

    if (!firstName) {
      const guess = nameFromEmail(email);
      firstName = guess.firstName;
      lastName = lastName || guess.lastName;
    }

    const domain = email.split("@")[1];
    leads.push({
      email,
      firstName,
      lastName,
      fullName: [firstName, lastName].filter(Boolean).join(" "),
      company: cell(columns.company),
      source,
      domain,
      provider: providerFromDomain(domain),
    });
  }

  return { leads, rejected };
}

async function main() {
  const argv = process.argv.slice(2);
  const files: string[] = [];
  let outDir = "out";
  let delimiter: string | undefined;
  let outDelimiter = ",";
  let tag = "";
  let useMx = false;
  let splitByProvider = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--out") outDir = argv[++i];
    else if (arg === "--delimiter") delimiter = argv[++i];
    else if (arg === "--out-delimiter") outDelimiter = argv[++i];
    else if (arg === "--tag") tag = argv[++i];
    else if (arg === "--mx") useMx = true;
    else if (arg === "--split-by-provider") splitByProvider = true;
    else if (arg.startsWith("--")) throw new Error(`Unknown flag: ${arg}`);
    else files.push(arg);
  }

  if (files.length === 0) {
    console.error(
      "Usage: npx tsx scripts/sort-leads.ts <file.csv> [more.csv ...] [--out DIR] [--delimiter ,]\n" +
        "       [--out-delimiter ;] [--tag LABEL] [--mx] [--split-by-provider]",
    );
    process.exit(1);
  }

  const allLeads: Lead[] = [];
  const rejected: Rejected[] = [];
  for (const file of files) {
    const result = processFile(file, delimiter);
    allLeads.push(...result.leads);
    rejected.push(...result.rejected);
  }

  const seen = new Map<string, Lead>();
  let duplicates = 0;
  for (const lead of allLeads) {
    const key = dedupeKey(lead.email);
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, lead);
      continue;
    }
    duplicates++;
    // Keep whichever record carries the better name.
    const score = (l: Lead) => (l.firstName ? 1 : 0) + (l.lastName ? 1 : 0) + (l.company ? 1 : 0);
    if (score(lead) > score(existing)) seen.set(key, lead);
  }

  const unique = [...seen.values()].sort((a, b) => a.email.localeCompare(b.email));
  if (useMx) {
    const custom = [...new Set(unique.filter((l) => l.provider === "Other").map((l) => l.domain))];
    process.stderr.write(`Looking up MX for ${custom.length} custom domain(s)...\n`);
    const resolved = await resolveProviders(custom);
    for (const lead of unique) {
      if (lead.provider === "Other") lead.provider = resolved.get(lead.domain) ?? "Other";
    }
  }

  const personal = unique.filter((l) => !isRoleAccount(l.email));
  const roles = unique.filter((l) => isRoleAccount(l.email));

  mkdirSync(outDir, { recursive: true });

  // SuperMailer maps these headers to merge fields directly.
  const header = ["Email", "FirstName", "LastName", "FullName", "Company", "Domain", "Provider", "Source"];
  if (tag) header.push("Tag");
  const toRows = (leads: Lead[]) => [
    header,
    ...leads.map((l) => {
      const row = [l.email, l.firstName, l.lastName, l.fullName, l.company, l.domain, l.provider, l.source];
      if (tag) row.push(tag);
      return row;
    }),
  ];

  const mainPath = join(outDir, "supermailer.csv");
  writeFileSync(mainPath, toCsv(toRows(personal), outDelimiter), "utf8");
  writeFileSync(join(outDir, "role-accounts.csv"), toCsv(toRows(roles), outDelimiter), "utf8");
  writeFileSync(
    join(outDir, "rejected.csv"),
    toCsv([["Value", "Reason", "Source"], ...rejected.map((r) => [r.value, r.reason, r.source])], outDelimiter),
    "utf8",
  );

  const byProvider = new Map<string, Lead[]>();
  for (const lead of personal) {
    const list = byProvider.get(lead.provider) ?? [];
    list.push(lead);
    byProvider.set(lead.provider, list);
  }
  const providerCounts = [...byProvider.entries()].sort((a, b) => b[1].length - a[1].length);

  if (splitByProvider) {
    const providerDir = join(outDir, "by-provider");
    mkdirSync(providerDir, { recursive: true });
    for (const [provider, leads] of providerCounts) {
      const slug = provider.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unknown";
      writeFileSync(join(providerDir, `${slug}.csv`), toCsv(toRows(leads), outDelimiter), "utf8");
    }
  }

  const missingName = personal.filter((l) => !l.firstName).length;
  console.log(`Read      ${allLeads.length + rejected.length} rows from ${files.length} file(s)`);
  console.log(`Duplicates removed  ${duplicates}`);
  console.log(`Rejected            ${rejected.length}  → ${join(outDir, "rejected.csv")}`);
  console.log(`Role accounts       ${roles.length}  → ${join(outDir, "role-accounts.csv")}`);
  console.log(`Ready to send       ${personal.length}  → ${mainPath}`);
  console.log("\nBy mailbox provider:");
  for (const [provider, leads] of providerCounts) {
    const share = ((leads.length / Math.max(personal.length, 1)) * 100).toFixed(1);
    console.log(`  ${provider.padEnd(28)} ${String(leads.length).padStart(5)}  ${share}%`);
  }
  if (splitByProvider) console.log(`  → split into ${join(outDir, "by-provider")}/`);
  const undeliverable = personal.filter((l) => l.provider.startsWith("No MX")).length;
  if (undeliverable) console.log(`  ⚠ ${undeliverable} on domains with no MX record — these will bounce.`);
  if (missingName) console.log(`  ⚠ ${missingName} have no first name — set a fallback greeting in SuperMailer.`);
}

void main();
