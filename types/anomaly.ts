export type AnomalyType = 
  | 'LARGE_AMOUNT' 
  | 'HIGH_FREQUENCY' 
  | 'NEW_ADDRESS' 
  | 'DUST_ATTACK' 
  | 'RAPID_OUTFLOW';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AnomalyAlert {
  id: string;
  type: AnomalyType;
  severity: AlertSeverity;
  observedValue: number;
  baselineValue: number;
  reason: string;
  txId: string;
  walletAddress: string;
  detectedAt: string;
  aiExplanation?: string;
  acknowledged?: boolean;
}

export interface AnomalyThresholds {
  largeAmountMultiplier: number;
  highFrequencyWindowHours: number;
  highFrequencyMultiplier: number;
  newAddressLookbackTxs: number;
  dustThresholdSats: number;
  rapidOutflowWindowMinutes: number;
  rapidOutflowMinCount: number;
}
