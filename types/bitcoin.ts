export type AddressType = 'legacy' | 'p2sh' | 'segwit' | 'taproot' | 'unknown';

export interface AddressValidationResult {
  isValid: boolean;
  address: string;
  type: AddressType;
  network: 'mainnet' | 'testnet' | 'unknown';
  error?: string;
}

export interface UTXO {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  value: number; // in satoshis
}

export interface TransactionStatus {
  confirmed: boolean;
  block_height?: number;
  block_hash?: string;
  block_time?: number;
}

export interface TransactionVin {
  txid: string;
  vout: number;
  prevout?: {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address?: string;
    value: number;
  };
  scriptsig: string;
  scriptsig_asm: string;
  witness?: string[];
  is_coinbase: boolean;
  sequence: number;
}

export interface TransactionVout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address?: string;
  value: number; // satoshis
}

export interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  vin: TransactionVin[];
  vout: TransactionVout[];
  size: number;
  weight: number;
  fee: number;
  status: TransactionStatus;
  // Computed fields for UI convenience
  type?: 'incoming' | 'outgoing' | 'internal';
  amount?: number; // satoshis net for the address
  timestamp?: number;
}

export interface AddressStats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

export interface WalletOverview {
  address: string;
  addressType: AddressType;
  chain_stats: AddressStats;
  mempool_stats: AddressStats;
  balanceSatoshis: number;
  balanceBtc: number;
  totalReceivedBtc: number;
  totalSentBtc: number;
  totalTransactions: number;
  unconfirmedCount: number;
  unconfirmedBalanceBtc: number;
}
