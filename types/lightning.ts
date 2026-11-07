export interface LightningNodeStats {
  channel_count: number;
  node_count: number;
  total_capacity: number; // in satoshis
  tor_nodes: number;
  clearnet_nodes: number;
  unannounced_nodes: number;
  avg_capacity: number;
  avg_fee_rate: number;
  med_capacity: number;
  med_fee_rate: number;
}

export interface LightningNode {
  publicKey: string;
  alias: string;
  capacity: number; // in satoshis
  channels: number;
  firstSeen: number;
  updatedAt: number;
  city?: {
    en?: string;
    [key: string]: string | undefined;
  } | null;
  country?: {
    en?: string;
    [key: string]: string | undefined;
  } | null;
  iso_code?: string | null;
}

export interface LightningChannel {
  id: string;
  short_id?: string;
  capacity: number;
  transaction_id: string;
  transaction_vout: number;
  closing_transaction_id?: string | null;
  fee_rate?: number;
  node1_public_key: string;
  node2_public_key: string;
}
