/**
 * BTC Copilot — Anomaly Detection Engine
 *
 * Pure deterministic math — NO LLM involvement.
 * Detects unusual patterns using statistical rules.
 * The LLM is called AFTER detection, only to explain alerts in human language.
 *
 * Rules:
 * 1. LARGE_AMOUNT   — tx value > 5x rolling mean of last 10 transactions
 * 2. HIGH_FREQUENCY — more than 5 transactions in a 24h window
 * 3. DUST_ATTACK    — incoming tx value < 546 satoshis (dust threshold)
 * 4. RAPID_OUTFLOW  — 3+ outgoing transactions within 60 minutes
 * 5. NEW_ADDRESS    — first seen address (heuristic: no tx history)
 */

export type AnomalyType =
  | 'LARGE_AMOUNT'
  | 'HIGH_FREQUENCY'
  | 'DUST_ATTACK'
  | 'RAPID_OUTFLOW'
  | 'NEW_ADDRESS';

export type AlertSeverity = 'low' | 'medium' | 'high';

export interface Transaction {
  txid: string;
  value: number; // satoshis (absolute, sign indicates direction)
  timestamp: number; // unix seconds
  type: 'incoming' | 'outgoing';
  confirmed: boolean;
  address?: string;
}

export interface AnomalyAlert {
  id: string;
  type: AnomalyType;
  severity: AlertSeverity;
  txid: string;
  timestamp: number;
  value: number;
  description: string; // human-readable, non-alarmist
  ruleDetails: string; // technical details for the LLM to use
  acknowledged: boolean;
}

// ─── Rule Implementations ─────────────────────────────────────────────────────

/** Rule 1: Large Amount — 5× rolling mean of last 10 txs */
function detectLargeAmount(tx: Transaction, history: Transaction[]): AnomalyAlert | null {
  if (history.length < 3) return null; // not enough history

  const recent = history.slice(-10);
  const mean = recent.reduce((sum, t) => sum + t.value, 0) / recent.length;
  const threshold = mean * 5;

  if (tx.value <= threshold) return null;

  return {
    id: `large-${tx.txid}`,
    type: 'LARGE_AMOUNT',
    severity: tx.value > mean * 20 ? 'high' : 'medium',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    description: `Unusual amount: this transaction (${tx.value.toLocaleString()} sats) is significantly larger than your typical activity.`,
    ruleDetails: `Transaction value ${tx.value} sats is ${(tx.value / mean).toFixed(1)}x the rolling mean of ${mean.toFixed(0)} sats (last ${recent.length} transactions). Threshold: 5x mean.`,
    acknowledged: false,
  };
}

/** Rule 2: High Frequency — more than 5 txs in 24h */
function detectHighFrequency(tx: Transaction, history: Transaction[]): AnomalyAlert | null {
  const twentyFourHoursAgo = tx.timestamp - 86400;
  const recentCount = history.filter((t) => t.timestamp > twentyFourHoursAgo).length;

  if (recentCount < 5) return null;

  return {
    id: `freq-${tx.txid}-${tx.timestamp}`,
    type: 'HIGH_FREQUENCY',
    severity: recentCount > 15 ? 'high' : 'medium',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    description: `High activity: ${recentCount} transactions detected in the last 24 hours. This is unusual compared to typical wallet usage.`,
    ruleDetails: `${recentCount} transactions in the last 24h window. Rule threshold: 5 transactions per 24h.`,
    acknowledged: false,
  };
}

/** Rule 3: Dust Attack — incoming value < 546 sats */
function detectDustAttack(tx: Transaction): AnomalyAlert | null {
  const DUST_THRESHOLD = 546; // satoshis (Bitcoin protocol standard)

  if (tx.type !== 'incoming' || tx.value >= DUST_THRESHOLD) return null;

  return {
    id: `dust-${tx.txid}`,
    type: 'DUST_ATTACK',
    severity: 'medium',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    description: `Dust transaction detected: you received ${tx.value} satoshis — an amount below the Bitcoin dust threshold (546 sats). This may be an attempt to track your wallet activity.`,
    ruleDetails: `Received value ${tx.value} sats is below dust threshold of 546 sats. These small amounts are sometimes used to link wallet addresses (dust attack / address clustering).`,
    acknowledged: false,
  };
}

/** Rule 4: Rapid Outflow — 3+ outgoing txs in 60 minutes */
function detectRapidOutflow(tx: Transaction, history: Transaction[]): AnomalyAlert | null {
  if (tx.type !== 'outgoing') return null;

  const oneHourAgo = tx.timestamp - 3600;
  const recentOutgoing = history.filter(
    (t) => t.type === 'outgoing' && t.timestamp > oneHourAgo
  );

  if (recentOutgoing.length < 2) return null; // need at least 2 previous + current = 3

  return {
    id: `outflow-${tx.txid}`,
    type: 'RAPID_OUTFLOW',
    severity: recentOutgoing.length > 5 ? 'high' : 'medium',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    description: `Rapid outgoing activity: ${recentOutgoing.length + 1} outgoing transactions in the past hour. Worth monitoring if this was not intentional.`,
    ruleDetails: `${recentOutgoing.length + 1} outgoing transactions within 60 minutes. Rule threshold: 3+ outgoing txs per hour.`,
    acknowledged: false,
  };
}

/** Rule 5: New Address (heuristic — first transaction to this address) */
function detectNewAddress(tx: Transaction, history: Transaction[]): AnomalyAlert | null {
  if (!tx.address) return null;

  const seenBefore = history.some((t) => t.address === tx.address);
  if (seenBefore) return null;

  // Only flag outgoing to new addresses (receiving from new address is normal)
  if (tx.type !== 'outgoing') return null;

  return {
    id: `newaddr-${tx.txid}`,
    type: 'NEW_ADDRESS',
    severity: 'low',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    description: `First transaction to a new address. If you did not initiate this payment, check your wallet security.`,
    ruleDetails: `Address ${tx.address} has not appeared in the last ${history.length} transactions. This is the first outgoing payment to this destination.`,
    acknowledged: false,
  };
}

// ─── Main Detector ────────────────────────────────────────────────────────────

/**
 * Analyze a list of transactions and return all anomaly alerts.
 * Processes transactions in chronological order.
 */
export function detectAnomalies(transactions: Transaction[]): AnomalyAlert[] {
  if (!transactions || transactions.length === 0) return [];

  // Sort ascending by timestamp
  const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);

  const alerts: AnomalyAlert[] = [];
  const alertKeys = new Set<string>();

  for (let i = 0; i < sorted.length; i++) {
    const tx = sorted[i];
    const history = sorted.slice(0, i); // all previous transactions

    const checks = [
      detectLargeAmount(tx, history),
      detectHighFrequency(tx, history),
      detectDustAttack(tx),
      detectRapidOutflow(tx, history),
      detectNewAddress(tx, history),
    ];

    for (const alert of checks) {
      if (alert && !alertKeys.has(alert.id)) {
        alerts.push(alert);
        alertKeys.add(alert.id);
      }
    }
  }

  // Return most recent alerts first
  return alerts.sort((a, b) => b.timestamp - a.timestamp);
}

/** Get severity color for UI */
export function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'high': return '#ef4444';
    case 'medium': return '#f7931a';
    case 'low': return '#facc15';
    default: return '#6b7280';
  }
}

/** Get human-readable anomaly type label */
export function getAnomalyLabel(type: AnomalyType): string {
  const labels: Record<AnomalyType, string> = {
    LARGE_AMOUNT: 'Large Amount',
    HIGH_FREQUENCY: 'High Frequency',
    DUST_ATTACK: 'Dust Transaction',
    RAPID_OUTFLOW: 'Rapid Outflow',
    NEW_ADDRESS: 'New Address',
  };
  return labels[type];
}
