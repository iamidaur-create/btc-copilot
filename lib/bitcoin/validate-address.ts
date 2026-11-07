import type { AddressType, AddressValidationResult } from '@/types/bitcoin';

// Base58 characters (excluding 0, O, I, l)
const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]+$/;
// Bech32 characters (lowercase alphanumeric except 1, b, i, o in the data part)
const BECH32_REGEX = /^[a-z0-9]+$/;

/**
 * Validates a Bitcoin public address and identifies its script type and network.
 * Supports:
 * - Legacy (P2PKH): 1...
 * - Pay to Script Hash (P2SH): 3...
 * - Native SegWit (Bech32, P2WPKH / P2WSH): bc1q...
 * - Taproot (Bech32m, P2TR): bc1p...
 * - Testnet / Signet addresses: tb1..., 2..., m..., n...
 */
export function validateBitcoinAddress(rawAddress: string): AddressValidationResult {
  const address = (rawAddress || '').trim();

  if (!address) {
    return {
      isValid: false,
      address,
      type: 'unknown',
      network: 'unknown',
      error: 'Address cannot be empty',
    };
  }

  // 1. Native SegWit & Taproot (Mainnet)
  if (address.toLowerCase().startsWith('bc1')) {
    const lower = address.toLowerCase();
    
    // Check Bech32 charset
    if (!BECH32_REGEX.test(lower)) {
      return {
        isValid: false,
        address,
        type: 'unknown',
        network: 'mainnet',
        error: 'Invalid characters in Bech32 address',
      };
    }

    // Taproot: bc1p... (typically 62 chars)
    if (lower.startsWith('bc1p')) {
      if (lower.length === 62) {
        return {
          isValid: true,
          address: lower,
          type: 'taproot',
          network: 'mainnet',
        };
      }
      return {
        isValid: false,
        address,
        type: 'taproot',
        network: 'mainnet',
        error: `Invalid Taproot address length (${lower.length}, expected 62)`,
      };
    }

    // Native SegWit: bc1q... (42 chars for P2WPKH, 62 chars for P2WSH)
    if (lower.startsWith('bc1q')) {
      if (lower.length === 42 || lower.length === 62) {
        return {
          isValid: true,
          address: lower,
          type: 'segwit',
          network: 'mainnet',
        };
      }
      return {
        isValid: false,
        address,
        type: 'segwit',
        network: 'mainnet',
        error: `Invalid SegWit address length (${lower.length}, expected 42 or 62)`,
      };
    }

    // Generic Bech32 under mainnet
    if (lower.length >= 42 && lower.length <= 62) {
      return {
        isValid: true,
        address: lower,
        type: 'segwit',
        network: 'mainnet',
      };
    }

    return {
      isValid: false,
      address,
      type: 'unknown',
      network: 'mainnet',
      error: 'Unsupported or malformed bc1 address format',
    };
  }

  // 2. Testnet Bech32: tb1...
  if (address.toLowerCase().startsWith('tb1')) {
    const lower = address.toLowerCase();
    if (!BECH32_REGEX.test(lower)) {
      return {
        isValid: false,
        address,
        type: 'unknown',
        network: 'testnet',
        error: 'Invalid characters in Testnet Bech32 address',
      };
    }
    return {
      isValid: true,
      address: lower,
      type: lower.startsWith('tb1p') ? 'taproot' : 'segwit',
      network: 'testnet',
    };
  }

  // 3. Base58 check for Legacy (1...), P2SH (3...), or Testnet (m/n/2...)
  if (!BASE58_REGEX.test(address)) {
    return {
      isValid: false,
      address,
      type: 'unknown',
      network: 'unknown',
      error: 'Contains invalid Base58 characters (0, O, I, l are forbidden)',
    };
  }

  // Standard Base58 address length is 26 to 35 characters
  if (address.length < 26 || address.length > 35) {
    return {
      isValid: false,
      address,
      type: 'unknown',
      network: 'unknown',
      error: `Invalid Base58 length (${address.length}, expected 26-35 characters)`,
    };
  }

  // Legacy P2PKH: starts with '1'
  if (address.startsWith('1')) {
    return {
      isValid: true,
      address,
      type: 'legacy',
      network: 'mainnet',
    };
  }

  // P2SH / Nested SegWit: starts with '3'
  if (address.startsWith('3')) {
    return {
      isValid: true,
      address,
      type: 'p2sh',
      network: 'mainnet',
    };
  }

  // Testnet addresses: 2... (P2SH), m or n (P2PKH)
  if (address.startsWith('2') || address.startsWith('m') || address.startsWith('n')) {
    return {
      isValid: true,
      address,
      type: address.startsWith('2') ? 'p2sh' : 'legacy',
      network: 'testnet',
    };
  }

  return {
    isValid: false,
    address,
    type: 'unknown',
    network: 'unknown',
    error: 'Unrecognized address prefix. Must start with 1, 3, bc1, or testnet prefix.',
  };
}
