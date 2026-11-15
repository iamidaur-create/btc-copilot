/**
 * GET /api/wallet/[address]
 *
 * This is a Next.js server-side API route.
 * "Server-side" means this code NEVER runs in the user's browser.
 * It runs on the server, fetches data from Mempool.space, and sends
 * back only what the frontend needs.
 *
 * Why do we need this route?
 * - Validates the Bitcoin address before hitting external APIs
 * - Acts as a safe proxy between our frontend and Mempool.space
 * - Handles errors in one place
 * - In the future: adds rate limiting here
 *
 * Usage:
 *   GET /api/wallet/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
 *
 * Returns JSON with wallet info + recent transactions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateBitcoinAddress } from '@/lib/bitcoin/validate-address';
import {
  getAddressInfo,
  getAddressTransactions,
  getFeeEstimates,
  calculateNetValue,
} from '@/lib/bitcoin/mempool';

// ─── Response Shape ───────────────────────────────────────────────────────────

/**
 * This is what the frontend receives.
 * We transform raw Mempool.space data into our own clean format.
 */
export interface WalletApiResponse {
  address: string;
  addressType: string;
  network: string;

  balance: {
    confirmed: number;    // satoshis — confirmed balance
    unconfirmed: number;  // satoshis — pending in mempool
    total: number;        // satoshis — confirmed + unconfirmed
  };

  stats: {
    totalReceived: number;  // satoshis
    totalSent: number;      // satoshis
    txCount: number;        // total number of transactions
    utxoCount: number;      // unspent outputs (roughly = number of coins)
    unconfirmedTxCount: number;
  };

  transactions: Array<{
    txid: string;
    confirmed: boolean;
    blockHeight: number | null;
    blockTime: number | null;    // Unix timestamp
    fee: number;                 // satoshis
    size: number;                // bytes
    netValue: number;            // satoshis (positive = received, negative = sent)
    direction: 'in' | 'out' | 'self';
  }>;

  fees: {
    fast: number;      // sat/vByte
    medium: number;
    slow: number;
    economy: number;
  } | null;

  fetchedAt: string;   // ISO timestamp
}

export type ApiTransaction = WalletApiResponse['transactions'][number];

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  // 1. Extract the address from the URL
  const { address } = await params;

  // 2. Validate the address using our deterministic validator
  //    This prevents us from ever sending garbage to Mempool.space
  const validation = validateBitcoinAddress(address);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: `Invalid Bitcoin address: ${validation.error}` },
      { status: 400 }
    );
  }

  // Reject testnet addresses — we only support mainnet in this app
  if (validation.network === 'testnet') {
    return NextResponse.json(
      { error: 'Testnet addresses are not supported. Please use a mainnet address.' },
      { status: 400 }
    );
  }

  // Use the normalized address (e.g. lowercase for bech32)
  const normalizedAddress = validation.address;

  try {
    // 3. Fetch data from Mempool.space in parallel
    //    Promise.allSettled means: try both, don't crash if one fails
    const [addressResult, txResult, feeResult] = await Promise.allSettled([
      getAddressInfo(normalizedAddress),
      getAddressTransactions(normalizedAddress),
      getFeeEstimates(),
    ]);

    // 4. Check the most critical fetch (address info) succeeded
    if (addressResult.status === 'rejected') {
      console.error('[wallet/api] Address info fetch failed:', addressResult.reason);
      return NextResponse.json(
        { error: 'Failed to fetch wallet data from the blockchain. Please try again.' },
        { status: 502 }
      );
    }

    const info = addressResult.value;
    const rawTxs = txResult.status === 'fulfilled' ? txResult.value : [];
    const fees = feeResult.status === 'fulfilled' ? feeResult.value : null;

    // 5. Calculate balances
    //    Mempool stores funded and spent amounts separately — we subtract to get balance
    const confirmedBalance = info.chain_stats.funded_txo_sum - info.chain_stats.spent_txo_sum;
    const unconfirmedBalance = info.mempool_stats.funded_txo_sum - info.mempool_stats.spent_txo_sum;

    // 6. Transform raw transactions into our clean format
    const transactions = rawTxs.map((tx) => {
      const netValue = calculateNetValue(tx, normalizedAddress);
      const direction: 'in' | 'out' | 'self' =
        netValue > 0 ? 'in' : netValue < 0 ? 'out' : 'self';

      return {
        txid: tx.txid,
        confirmed: tx.status.confirmed,
        blockHeight: tx.status.block_height ?? null,
        blockTime: tx.status.block_time ?? null,
        fee: tx.fee,
        size: tx.size,
        netValue,
        direction,
      };
    });

    // 7. Build the final response
    const response: WalletApiResponse = {
      address: normalizedAddress,
      addressType: validation.type,
      network: validation.network,

      balance: {
        confirmed: confirmedBalance,
        unconfirmed: unconfirmedBalance,
        total: confirmedBalance + unconfirmedBalance,
      },

      stats: {
        totalReceived: info.chain_stats.funded_txo_sum,
        totalSent: info.chain_stats.spent_txo_sum,
        txCount: info.chain_stats.tx_count + info.mempool_stats.tx_count,
        utxoCount: info.chain_stats.funded_txo_count - info.chain_stats.spent_txo_count,
        unconfirmedTxCount: info.mempool_stats.tx_count,
      },

      transactions,

      fees: fees
        ? {
            fast: fees.fastestFee,
            medium: fees.halfHourFee,
            slow: fees.hourFee,
            economy: fees.economyFee,
          }
        : null,

      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        // Tell browsers and CDN: cache this response for 60 seconds
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });

  } catch (err) {
    // Catch-all for unexpected errors
    console.error('[wallet/api] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
