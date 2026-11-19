/**
 * Privacy Gateway — sanitizes all data before it reaches any LLM.
 *
 * Rules enforced here:
 * - Private keys / seed phrases are hard-blocked (regex pattern match)
 * - NWC connection strings are stripped
 * - Full Bitcoin addresses are truncated to first 8 + last 4 chars
 * - Amounts are preserved (not sensitive on-chain data)
 * - Any field named "privateKey", "mnemonic", "seed" is redacted
 *
 * NEVER transmit raw wallet credentials to an LLM.
 */

import * as bip39 from 'bip39';

/** Patterns that must NEVER reach an LLM */
const DANGEROUS_PATTERNS: RegExp[] = [
  // WIF private keys (51-52 chars starting with 5, K or L)
  /\b[5KL][1-9A-HJ-NP-Za-km-z]{50,51}\b/g,
  // NWC connection strings
  /nostr\+walletconnect:\/\/[^\s"']+/gi,
  // Extended private keys (xprv/zprv/tprv)
  /\b(?:xprv|zprv|tprv|vprv)[1-9A-HJ-NP-Za-km-z]{100,}\b/g,
];

/** Truncate a Bitcoin address for display */
function truncateAddress(addr: string): string {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-4)}`;
}

/** Redact a sequence only when it validates as a 12- or 24-word BIP39 mnemonic. */
function redactBip39Mnemonic(text: string): string {
  return text.replace(/\b[a-z]+(?:[\s-]+[a-z]+){11,23}\b/gi, (match) => {
    const words = match.trim().split(/[\s-]+/);
    for (const length of [24, 12]) {
      if (words.length >= length) {
        for (let start = 0; start <= words.length - length; start += 1) {
          const candidate = words.slice(start, start + length).join(' ');
          if (bip39.validateMnemonic(candidate)) {
            return '[REDACTED]';
          }
        }
      }
    }
    return match;
  });
}

/** Remove dangerous patterns from a string */
function stripDangerous(text: string): string {
  let result = redactBip39Mnemonic(text);
  for (const pattern of DANGEROUS_PATTERNS) {
    result = result.replace(pattern, '[REDACTED]');
  }
  return result;
}

/** Truncate addresses in a string */
function truncateAddresses(text: string): string {
  // Legacy addresses (1... or 3...)
  text = text.replace(/\b[13][1-9A-HJ-NP-Za-km-z]{25,34}\b/g, (m) => truncateAddress(m));
  // SegWit bech32 (bc1...)
  text = text.replace(/\bbc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{6,87}\b/gi, (m) => truncateAddress(m));
  // Taproot (bc1p...)
  text = text.replace(/\bbc1p[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{6,87}\b/gi, (m) => truncateAddress(m));
  return text;
}

export interface SanitizedContext {
  walletSummary?: string;
  recentTransactions?: string;
  currentBalance?: string;
  networkFees?: string;
  lightningInfo?: string;
}

/** Main sanitization function — call before ANY LLM request */
export function sanitizeContext(raw: Record<string, unknown>): SanitizedContext {
  const json = JSON.stringify(raw);

  // 1. Strip dangerous patterns
  let safe = stripDangerous(json);

  // 2. Truncate addresses
  safe = truncateAddresses(safe);

  // 3. Remove dangerous field names
  const parsed = JSON.parse(safe) as Record<string, unknown>;
  const forbiddenKeys = ['privateKey', 'mnemonic', 'seed', 'secret', 'xprv', 'nwcUri', 'connectionString'];
  for (const key of forbiddenKeys) {
    if (key in parsed) {
      delete parsed[key];
    }
  }

  return parsed as SanitizedContext;
}

/** Sanitize a plain text message from the user (block prompt injection) */
export function sanitizeUserMessage(message: string): string {
  // Remove dangerous patterns
  let safe = stripDangerous(message);
  // Truncate addresses
  safe = truncateAddresses(safe);
  // Block prompt injection attempts (very basic — LLM is server-side)
  safe = safe.replace(/\bignore (previous|above|all) instructions?\b/gi, '[filtered]');
  safe = safe.replace(/\bsystem prompt\b/gi, '[filtered]');
  return safe.trim();
}
