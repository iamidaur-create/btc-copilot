/**
 * Mempool.space API Client
 *
 * This file is the ONLY place in the backend that talks to the Mempool.space API.
 * All Bitcoin blockchain data flows through here.
 *
 * Mempool.space is a public API — no API key required.
 * Base URL: https://mempool.space/api
 *
 * What this file does:
 * - Fetches wallet balance and statistics for a Bitcoin address
 * - Fetches the transaction history for an address
 * - Fetches details about a single transaction by its ID
 * - Fetches current mempool fee rates (how congested the network is)
 * - Includes simple in-memory caching (60s) to avoid hammering the API
 * - Handles errors safely — never crashes the app if the API is down
 */

// ─── Types ───────────────────────────────────────────────────────────────────

/** Raw address info returned by Mempool.space /api/address/:address */
export interface MempoolAddressInfo {
  address: string;
  chain_stats: {
    funded_txo_count: number;   // how many transactions received funds
    funded_txo_sum: number;     // total received (satoshis)
    spent_txo_count: number;    // how many outputs have been spent
    spent_txo_sum: number;      // total sent (satoshis)
    tx_count: number;           // total number of transactions
  };
  mempool_stats: {
    funded_txo_count: number;   // unconfirmed receives
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;           // number of pending (unconfirmed) transactions
  };
}

/** Raw transaction object returned by Mempool.space */
export interface MempoolTransaction {
  txid: string;
  version: number;
  locktime: number;
  size: number;         // bytes
  weight: number;       // weight units (for fee calculation)
  fee: number;          // fee in satoshis
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;  // Unix timestamp
  };
  vin: Array<{
    txid: string;
    vout: number;
    prevout: {
      scriptpubkey_address?: string;
      value: number;      // satoshis
    } | null;
    sequence: number;
    is_coinbase: boolean;
  }>;
  vout: Array<{
    scriptpubkey_address?: string;
    value: number;        // satoshis
    scriptpubkey_type: string;  // e.g. "p2pkh", "p2wpkh", "v1_p2tr"
  }>;
}

/** Current fee estimates from the mempool */
export interface MempoolFeeEstimates {
  fastestFee: number;    // sat/vByte — confirmed in next block
  halfHourFee: number;   // sat/vByte — confirmed within 30 min
  hourFee: number;       // sat/vByte — confirmed within 1 hour
  economyFee: number;    // sat/vByte — slow, cheapest
  minimumFee: number;    // sat/vByte — absolute minimum
}

// ─── Cache ───────────────────────────────────────────────────────────────────

/**
 * Simple in-memory cache.
 * Avoids hitting Mempool.space for the same data within 60 seconds.
 * This is a Map where:
 *   key   = the URL we fetched
 *   value = { data: the response, timestamp: when we fetched it }
 */
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 60_000; // 60 seconds

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key); // expired
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── HTTP Helper ──────────────────────────────────────────────────────────────

const BASE_URL = 'https://mempool.space/api';

/**
 * Makes a GET request to the Mempool.space API.
 * Returns the JSON response, or throws an error with a helpful message.
 */
async function mempoolFetch<T>(path: string, useCache = true): Promise<T> {
  const url = `${BASE_URL}${path}`;

  // Return cached data if available and fresh
  if (useCache) {
    const cached = getCached<T>(url);
    if (cached !== null) return cached;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      // next: { revalidate: 60 } // Next.js cache (alternative to in-memory)
    });

    if (!res.ok) {
      // Mempool returns plain text errors sometimes
      const body = await res.text().catch(() => '');
      throw new Error(`Mempool.space API error ${res.status}: ${body || res.statusText}`);
    }

    const data = await res.json() as T;
    if (useCache) setCache(url, data);
    return data;

  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error('Mempool.space request timed out after 10 seconds');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Public API Functions ─────────────────────────────────────────────────────

/**
 * Fetches balance and stats for a Bitcoin address.
 *
 * Example: getAddressInfo('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
 *
 * Returns the raw Mempool.space address object including:
 *   - chain_stats: confirmed balance and tx counts
 *   - mempool_stats: unconfirmed (pending) transactions
 */
export async function getAddressInfo(address: string): Promise<MempoolAddressInfo> {
  return mempoolFetch<MempoolAddressInfo>(`/address/${address}`);
}

/**
 * Fetches the transaction history for a Bitcoin address.
 * Mempool.space returns the 25 most recent transactions by default.
 *
 * To get older transactions, pass the txid of the last transaction
 * in the current page as `afterTxid` (pagination).
 */
export async function getAddressTransactions(
  address: string,
  afterTxid?: string
): Promise<MempoolTransaction[]> {
  const path = afterTxid
    ? `/address/${address}/txs?after_txid=${afterTxid}`
    : `/address/${address}/txs`;
  return mempoolFetch<MempoolTransaction[]>(path);
}

/**
 * Fetches confirmed transactions only (excludes mempool / unconfirmed).
 */
export async function getConfirmedTransactions(
  address: string
): Promise<MempoolTransaction[]> {
  return mempoolFetch<MempoolTransaction[]>(`/address/${address}/txs/chain`);
}

/**
 * Fetches a single transaction by its transaction ID (txid).
 * Useful when the user asks the AI to explain a specific transaction.
 */
export async function getTransaction(txid: string): Promise<MempoolTransaction> {
  return mempoolFetch<MempoolTransaction>(`/tx/${txid}`);
}

/**
 * Fetches current recommended fee rates from the mempool.
 * These change constantly depending on network congestion.
 *
 * Example output:
 *   { fastestFee: 25, halfHourFee: 18, hourFee: 12, economyFee: 5, minimumFee: 1 }
 * All values are in sat/vByte.
 */
export async function getFeeEstimates(): Promise<MempoolFeeEstimates> {
  return mempoolFetch<MempoolFeeEstimates>('/v1/fees/recommended', false); // don't cache fees
}

/**
 * Calculates the net value flow for a transaction relative to a specific address.
 *
 * Returns:
 *   - positive number = this address RECEIVED bitcoin (incoming tx)
 *   - negative number = this address SENT bitcoin (outgoing tx)
 *   - 0 = address is not involved in this transaction
 *
 * This is used to show "+0.05 BTC" or "-0.02 BTC" in the transaction list.
 */
export function calculateNetValue(tx: MempoolTransaction, address: string): number {
  let received = 0;
  let sent = 0;

  // How much did this address receive in this transaction?
  for (const output of tx.vout) {
    if (output.scriptpubkey_address === address) {
      received += output.value;
    }
  }

  // How much did this address send in this transaction?
  for (const input of tx.vin) {
    if (input.prevout?.scriptpubkey_address === address) {
      sent += input.prevout.value;
    }
  }

  return received - sent; // positive = received, negative = sent
}
