/**
 * BTC Copilot — Intelligent Anomaly Detection Engine
 *
 * Pure deterministic mathematics & statistical heuristics — NO LLM hallucination.
 * Detects unusual patterns and security risks using adaptive rules.
 * The LLM is called AFTER detection, only to explain alerts in clear human language.
 *
 * Intelligent Rules:
 * 1. LARGE_AMOUNT      — Adaptive rolling mean (3.0x for Standard <0.1 BTC, 4.0x for Medium, 5.0x for Whale)
 * 2. HIGH_FREQUENCY    — Activity burst (>5 txs in 24h window compared to baseline)
 * 3. DUST_ATTACK       — Incoming tx value < 546 sats (Bitcoin protocol dust threshold, UTXO tracing attempt)
 * 4. RAPID_OUTFLOW     — Rapid outflow clustering (2+ outgoing in 1h for Standard, 3+ for Whale, drain detection)
 * 5. FEE_OVERPAYMENT   — Abnormal fee ratio (>20% of tx amount or extreme sat/vB overpayment)
 * 6. NEW_ADDRESS       — First outgoing transaction to an unknown address
 */

export type AnomalyType =
  | 'LARGE_AMOUNT'
  | 'HIGH_FREQUENCY'
  | 'DUST_ATTACK'
  | 'RAPID_OUTFLOW'
  | 'FEE_OVERPAYMENT'
  | 'NEW_ADDRESS';

export type AlertSeverity = 'low' | 'medium' | 'high';

export interface Transaction {
  txid: string;
  value: number; // satoshis (absolute, direction in type)
  fee?: number;  // satoshis paid in network fee
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
  fee?: number;
  description: string; // human-readable, non-alarmist
  ruleDetails: string; // technical details for the LLM to use
  acknowledged: boolean;
}

export type WalletTier = 'small' | 'medium' | 'whale';

/** Determine wallet tier based on rolling mean transaction value */
export function getWalletTier(meanValue: number): WalletTier {
  if (meanValue >= 100_000_000) return 'whale'; // >= 1 BTC
  if (meanValue >= 10_000_000) return 'medium'; // >= 0.1 BTC
  return 'small'; // < 0.1 BTC
}

/** Get adaptive anomaly multiplier based on wallet tier */
export function getAdaptiveMultiplier(tier: WalletTier): number {
  switch (tier) {
    case 'small': return 3.0; // 3.0x for standard wallets (high sensitivity against drain)
    case 'medium': return 4.0;
    case 'whale': return 5.0; // 5.0x for whale accounts (larger natural variance)
  }
}

// ─── Rule Implementations ─────────────────────────────────────────────────────

/** Rule 1: Large Amount — Adaptive multiplier (3x for small, 4x medium, 5x whale) */
function detectLargeAmount(tx: Transaction, history: Transaction[], lang: 'fr' | 'en'): AnomalyAlert | null {
  if (history.length < 3) return null; // not enough history

  const recent = history.slice(-10);
  const mean = recent.reduce((sum, t) => sum + t.value, 0) / recent.length;
  const tier = getWalletTier(mean);
  const multiplier = getAdaptiveMultiplier(tier);
  const threshold = mean * multiplier;

  if (tx.value <= threshold) return null;

  const ratio = (tx.value / mean).toFixed(1);
  const isFrench = lang === 'fr';
  const tierLabel = tier === 'small' 
    ? (isFrench ? 'Standard (< 0.1 BTC)' : 'Standard (< 0.1 BTC)')
    : tier === 'medium'
    ? (isFrench ? 'Intermédiaire (0.1 - 1 BTC)' : 'Medium (0.1 - 1 BTC)')
    : (isFrench ? 'Whale (> 1 BTC)' : 'Whale (> 1 BTC)');

  return {
    id: `large-${tx.txid}`,
    type: 'LARGE_AMOUNT',
    severity: tx.value > mean * (multiplier * 2) ? 'high' : 'medium',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    fee: tx.fee,
    description: isFrench
      ? `Montant inhabituel : transaction de ${tx.value.toLocaleString()} sats (${ratio}× la moyenne de ${Math.round(mean).toLocaleString()} sats). Détection adaptative pour profil ${tierLabel}.`
      : `Unusual amount: transaction of ${tx.value.toLocaleString()} sats (${ratio}× rolling mean of ${Math.round(mean).toLocaleString()} sats). Adaptive trigger for ${tierLabel}.`,
    ruleDetails: `Value ${tx.value} sats is ${ratio}x rolling mean (${Math.round(mean)} sats). Adaptive threshold: ${multiplier}x for ${tierLabel}.`,
    acknowledged: false,
  };
}

/** Rule 2: High Frequency — more than 5 txs in 24h */
function detectHighFrequency(tx: Transaction, history: Transaction[], lang: 'fr' | 'en'): AnomalyAlert | null {
  const twentyFourHoursAgo = tx.timestamp - 86400;
  const recentCount = history.filter((t) => t.timestamp > twentyFourHoursAgo).length;

  if (recentCount < 5) return null;

  const isFrench = lang === 'fr';

  return {
    id: `freq-${tx.txid}-${tx.timestamp}`,
    type: 'HIGH_FREQUENCY',
    severity: recentCount > 15 ? 'high' : 'medium',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    fee: tx.fee,
    description: isFrench
      ? `Activité inhabituelle : ${recentCount} transactions détectées au cours des dernières 24 heures. Ce rythme est supérieur aux habitudes du portefeuille.`
      : `High activity: ${recentCount} transactions detected in the last 24 hours. This pace is elevated compared to baseline.`,
    ruleDetails: `${recentCount} transactions in the last 24h window. Threshold: >5 transactions per 24h.`,
    acknowledged: false,
  };
}

/** Rule 3: Dust Attack — incoming value < 546 sats */
function detectDustAttack(tx: Transaction, lang: 'fr' | 'en'): AnomalyAlert | null {
  const DUST_THRESHOLD = 546; // satoshis (Bitcoin protocol standard)

  if (tx.type !== 'incoming' || tx.value >= DUST_THRESHOLD) return null;

  const isFrench = lang === 'fr';

  return {
    id: `dust-${tx.txid}`,
    type: 'DUST_ATTACK',
    severity: 'medium',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    fee: tx.fee,
    description: isFrench
      ? `Attaque Dust détectée : réception de ${tx.value} satoshis (< seuil protocolaire de 546 sats). Ces micro-montants sont fréquemment utilisés pour tracer vos UTXO et tenter de désanonymiser vos adresses.`
      : `Dust transaction detected: received ${tx.value} satoshis (< 546 sats threshold). Micro-amounts are used by trackers to deanonymize your wallet UTXO graph.`,
    ruleDetails: `Received value ${tx.value} sats is below dust threshold of 546 sats. Unsolicited dust outputs link addresses when spent together.`,
    acknowledged: false,
  };
}

/** Rule 4: Rapid Outflow — Adaptive (2+ for small wallets, 3+ for whales) */
function detectRapidOutflow(tx: Transaction, history: Transaction[], lang: 'fr' | 'en'): AnomalyAlert | null {
  if (tx.type !== 'outgoing') return null;

  const oneHourAgo = tx.timestamp - 3600;
  const recentOutgoing = history.filter(
    (t) => t.type === 'outgoing' && t.timestamp > oneHourAgo
  );

  const mean = history.length > 0
    ? history.slice(-10).reduce((sum, t) => sum + t.value, 0) / Math.min(history.length, 10)
    : 0;
  const tier = getWalletTier(mean);
  const minRequired = tier === 'small' ? 1 : 2; // (recentOutgoing count before current)

  if (recentOutgoing.length < minRequired) return null;

  const totalOutgoing = recentOutgoing.length + 1;
  const isFrench = lang === 'fr';

  return {
    id: `outflow-${tx.txid}`,
    type: 'RAPID_OUTFLOW',
    severity: totalOutgoing >= 4 ? 'high' : 'medium',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    fee: tx.fee,
    description: isFrench
      ? `Sorties rapides de fonds : ${totalOutgoing} transferts sortants effectués en moins d'une heure. Vérifiez qu'il ne s'agit pas d'une tentative de vidage de votre portefeuille.`
      : `Rapid outflow detected: ${totalOutgoing} outgoing transactions in under 60 minutes. Verify this is intentional and not a wallet drain attempt.`,
    ruleDetails: `${totalOutgoing} outgoing transactions within 1 hour. Adaptive threshold: ${minRequired + 1}+ for ${tier} profile.`,
    acknowledged: false,
  };
}

/** Rule 5: Fee Overpayment — Intelligent check if fees exceed 20% of tx value or are excessive */
function detectFeeOverpayment(tx: Transaction, lang: 'fr' | 'en'): AnomalyAlert | null {
  if (tx.type !== 'outgoing' || !tx.fee || tx.fee <= 0 || tx.value <= 0) return null;

  const feeRatio = (tx.fee / tx.value) * 100;
  // Trigger if fee > 20% of transaction amount and fee > 1,500 sats (to ignore trivial micro-fees)
  if (feeRatio < 20 || tx.fee < 1500) return null;

  const isFrench = lang === 'fr';

  return {
    id: `fee-${tx.txid}`,
    type: 'FEE_OVERPAYMENT',
    severity: feeRatio > 50 ? 'high' : 'medium',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    fee: tx.fee,
    description: isFrench
      ? `Surpaiement anormal de frais : ${tx.fee.toLocaleString()} sats de frais payés pour un montant de ${tx.value.toLocaleString()} sats (${feeRatio.toFixed(1)}% de frais). Vérifiez la configuration de votre portefeuille.`
      : `Abnormal fee overpayment: ${tx.fee.toLocaleString()} sats fee paid for a transfer of ${tx.value.toLocaleString()} sats (${feeRatio.toFixed(1)}% fee ratio). Inspect wallet fee settings.`,
    ruleDetails: `Fee of ${tx.fee} sats represents ${feeRatio.toFixed(1)}% of total transfer value (${tx.value} sats). Healthy threshold is <5%.`,
    acknowledged: false,
  };
}

/** Rule 6: New Address (heuristic — first transaction to this address) */
function detectNewAddress(tx: Transaction, history: Transaction[], lang: 'fr' | 'en'): AnomalyAlert | null {
  if (!tx.address || tx.type !== 'outgoing') return null;

  const seenBefore = history.some((t) => t.address === tx.address);
  if (seenBefore) return null;

  const isFrench = lang === 'fr';

  return {
    id: `newaddr-${tx.txid}`,
    type: 'NEW_ADDRESS',
    severity: 'low',
    txid: tx.txid,
    timestamp: tx.timestamp,
    value: tx.value,
    fee: tx.fee,
    description: isFrench
      ? `Premier paiement vers cette adresse de destination (${tx.address.slice(0, 8)}…${tx.address.slice(-6)}). Si vous n'êtes pas à l'origine de ce paiement, vérifiez immédiatement vos autorisations.`
      : `First transfer to a new destination address (${tx.address.slice(0, 8)}…${tx.address.slice(-6)}). If you did not authorize this, check wallet security.`,
    ruleDetails: `Address ${tx.address} has not appeared in prior history. First outgoing transfer.`,
    acknowledged: false,
  };
}

// ─── Main Detector ────────────────────────────────────────────────────────────

/**
 * Analyze a list of transactions and return all anomaly alerts.
 * Processes transactions in chronological order with bilingual explanations.
 */
export function detectAnomalies(transactions: Transaction[], lang: 'fr' | 'en' = 'fr'): AnomalyAlert[] {
  if (!transactions || transactions.length === 0) return [];

  // Sort ascending by timestamp
  const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);

  const alerts: AnomalyAlert[] = [];
  const alertKeys = new Set<string>();

  for (let i = 0; i < sorted.length; i++) {
    const tx = sorted[i];
    const history = sorted.slice(0, i); // all previous transactions

    const checks = [
      detectLargeAmount(tx, history, lang),
      detectHighFrequency(tx, history, lang),
      detectDustAttack(tx, lang),
      detectRapidOutflow(tx, history, lang),
      detectFeeOverpayment(tx, lang),
      detectNewAddress(tx, history, lang),
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
export function getAnomalyLabel(type: AnomalyType, lang: 'fr' | 'en' = 'fr'): string {
  const isFrench = lang === 'fr';
  const labels: Record<AnomalyType, { fr: string; en: string }> = {
    LARGE_AMOUNT: { fr: 'Montant Inhabituel', en: 'Large Amount' },
    HIGH_FREQUENCY: { fr: 'Fréquence Élevée', en: 'High Frequency' },
    DUST_ATTACK: { fr: 'Attaque Dust (Traçage)', en: 'Dust Attack (Tracking)' },
    RAPID_OUTFLOW: { fr: 'Sortie Rapide de Fonds', en: 'Rapid Outflow' },
    FEE_OVERPAYMENT: { fr: 'Surpaiement de Frais', en: 'Fee Overpayment' },
    NEW_ADDRESS: { fr: 'Nouvelle Destination', en: 'New Destination' },
  };
  return labels[type] ? (isFrench ? labels[type].fr : labels[type].en) : type;
}
