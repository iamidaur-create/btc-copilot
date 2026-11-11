/**
 * NWC (Nostr Wallet Connect — NIP-47) Client & Utilities
 *
 * Implements non-custodial Lightning wallet connection using the official NIP-47 protocol.
 *
 * SECURITY INVARIANTS:
 * 1. Connection strings (nostr+walletconnect://...) contain sensitive secrets.
 *    They are NEVER stored in localStorage, NEVER passed to LLMs, and NEVER logged.
 * 2. This module only performs read, invoice creation, and payment lookup.
 * 3. No automated outgoing payments are allowed.
 */

import { NWCClient } from '@getalby/sdk';

export interface NWCConnectionInfo {
  isConnected: boolean;
  alias?: string;
  color?: string;
  pubkey?: string;
  network?: string;
  blockHeight?: number;
  methods: string[];
}

export interface NWCBalance {
  balanceSats: number;
  currency?: string;
}

export interface NWCInvoice {
  invoice: string;      // bolt11 invoice string
  paymentHash: string;
  amountSats: number;
  memo?: string;
  expiresAt?: number;
  createdAt: number;
}

export interface NWCLookupResult {
  settled: boolean;
  preimage?: string;
  amountSats?: number;
  settledAt?: number;
}

/**
 * Validates whether a given string is a syntactically valid NWC pairing URI.
 * Must start with nostr+walletconnect:// or nostrwalletconnect://
 */
export function validateNwcUri(uri: string): { isValid: boolean; error?: string } {
  if (!uri || typeof uri !== 'string') {
    return { isValid: false, error: 'Connection string is empty' };
  }

  const trimmed = uri.trim();
  if (!trimmed.startsWith('nostr+walletconnect://') && !trimmed.startsWith('nostrwalletconnect://')) {
    return { 
      isValid: false, 
      error: 'Invalid protocol. NWC URI must begin with nostr+walletconnect://' 
    };
  }

  try {
    const url = new URL(trimmed.replace('nostr+walletconnect://', 'https://').replace('nostrwalletconnect://', 'https://'));
    const relay = url.searchParams.get('relay');
    const secret = url.searchParams.get('secret');

    if (!relay) {
      return { isValid: false, error: 'Missing required "relay" parameter in NWC URI' };
    }
    if (!secret) {
      return { isValid: false, error: 'Missing required "secret" parameter in NWC URI' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Malformed NWC URI structure' };
  }
}

/**
 * Creates an ephemeral NWC client from the provided connection secret.
 */
export function createNwcClient(connectionUri: string): NWCClient {
  return new NWCClient({
    nostrWalletConnectUrl: connectionUri.trim(),
  });
}

/**
 * Retrieves wallet metadata and available permissions using get_info (NIP-47).
 */
export async function getNwcInfo(connectionUri: string): Promise<NWCConnectionInfo> {
  const client = createNwcClient(connectionUri);
  try {
    const info = await client.getInfo();
    return {
      isConnected: true,
      alias: info.alias,
      color: info.color,
      pubkey: info.pubkey,
      network: info.network,
      blockHeight: info.block_height,
      methods: info.methods || [],
    };
  } catch (error) {
    throw new Error(`Failed to connect to NWC wallet: ${(error as Error).message}`);
  } finally {
    client.close();
  }
}

/**
 * Retrieves the current balance in satoshis.
 */
export async function getNwcBalance(connectionUri: string): Promise<NWCBalance> {
  const client = createNwcClient(connectionUri);
  try {
    const res = await client.getBalance();
    // Alby NWC returns balance in millisatoshis (msats)
    const balanceSats = Math.floor((res.balance || 0) / 1000);
    return {
      balanceSats,
    };
  } catch (error) {
    throw new Error(`Failed to fetch NWC balance: ${(error as Error).message}`);
  } finally {
    client.close();
  }
}

/**
 * Creates a Lightning BOLT-11 invoice to receive payments.
 * @param amountSats Amount to receive in satoshis.
 * @param memo Description or message for the invoice.
 */
export async function createNwcInvoice(
  connectionUri: string,
  amountSats: number,
  memo: string = 'BTC Copilot Invoice'
): Promise<NWCInvoice> {
  if (amountSats <= 0) {
    throw new Error('Invoice amount must be greater than 0 sats');
  }

  const client = createNwcClient(connectionUri);
  try {
    // Convert sats to millisats for NIP-47
    const amountMsats = amountSats * 1000;
    const res = await client.makeInvoice({
      amount: amountMsats,
      description: memo,
    });

    return {
      invoice: res.invoice,
      paymentHash: res.payment_hash,
      amountSats,
      memo,
      expiresAt: res.expires_at,
      createdAt: Math.floor(Date.now() / 1000),
    };
  } catch (error) {
    throw new Error(`Failed to generate Lightning invoice: ${(error as Error).message}`);
  } finally {
    client.close();
  }
}

/**
 * Verifies whether a previously generated invoice has been settled/paid.
 */
export async function checkNwcInvoiceStatus(
  connectionUri: string,
  paymentHash: string
): Promise<NWCLookupResult> {
  const client = createNwcClient(connectionUri);
  try {
    const res = await client.lookupInvoice({
      payment_hash: paymentHash,
    });

    const isSettled = Boolean(res.settled_at || res.preimage);
    return {
      settled: isSettled,
      preimage: res.preimage,
      amountSats: res.amount ? Math.floor(res.amount / 1000) : undefined,
      settledAt: res.settled_at,
    };
  } catch (error) {
    throw new Error(`Failed to lookup invoice status: ${(error as Error).message}`);
  } finally {
    client.close();
  }
}
