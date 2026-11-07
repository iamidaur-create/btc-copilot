/**
 * Formatting and conversion utilities for Bitcoin and Satoshi amounts
 */

export const SATS_PER_BTC = 100_000_000;

export function satsToBtc(sats: number): number {
  return sats / SATS_PER_BTC;
}

export function btcToSats(btc: number): number {
  return Math.round(btc * SATS_PER_BTC);
}

export function formatBtc(btc: number, decimals: number = 8): string {
  if (isNaN(btc)) return '0.00000000';
  return btc.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

export function formatSats(sats: number): string {
  if (isNaN(sats)) return '0';
  return Math.round(sats).toLocaleString('en-US');
}

/**
 * Truncate an address for safe display: e.g. 1A1zP1...Divfna
 */
export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars + 3) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Truncate a transaction ID: e.g. 4a5e1e...b411
 */
export function truncateTxid(txid: string, chars = 6): string {
  if (!txid) return '';
  if (txid.length <= chars * 2 + 3) return txid;
  return `${txid.slice(0, chars)}...${txid.slice(-chars)}`;
}

/**
 * Format timestamp (seconds or milliseconds) to readable date
 */
export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return 'Unconfirmed';
  // If timestamp is in seconds, convert to milliseconds
  const ms = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const date = new Date(ms);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., '5 mins ago')
 */
export function formatTimeAgo(timestamp: number): string {
  if (!timestamp) return 'Pending in mempool';
  const ms = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const elapsedSec = Math.floor((Date.now() - ms) / 1000);

  if (elapsedSec < 60) return `${elapsedSec}s ago`;
  const elapsedMin = Math.floor(elapsedSec / 60);
  if (elapsedMin < 60) return `${elapsedMin}m ago`;
  const elapsedHours = Math.floor(elapsedMin / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays}d ago`;
}
