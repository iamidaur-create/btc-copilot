'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Activity, ShieldAlert, AlertTriangle, CheckCircle2,
  RefreshCw, Bot, Loader2, ChevronDown, ChevronUp, Search
} from 'lucide-react';
import { detectAnomalies, getSeverityColor, getAnomalyLabel } from '@/lib/anomaly/detector';
import type { AnomalyAlert, Transaction } from '@/lib/anomaly/detector';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ApiTransaction {
  txid: string;
  confirmed: boolean;
  blockHeight: number | null;
  blockTime: number | null;
  fee: number;
  size: number;
  netValue: number;
  direction: 'in' | 'out' | 'self';
}

// ─── Alert Card ──────────────────────────────────────────────────────────────
function AlertCard({ alert, onExplain }: { alert: AnomalyAlert; onExplain: (a: AnomalyAlert) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);

  const color = getSeverityColor(alert.severity);

  const handleExplain = async () => {
    if (explanation) {
      setExpanded(!expanded);
      return;
    }
    setExpanded(true);
    setExplaining(true);
    onExplain(alert);

    try {
      const res = await fetch('/api/ai/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert, level: 'beginner' }),
      });
      const data = await res.json() as { explanation?: string; error?: string };
      setExplanation(data.explanation ?? data.error ?? 'Unable to get explanation.');
    } catch {
      setExplanation('Network error. Could not get AI explanation.');
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="border border-[#1e2230] rounded-xl overflow-hidden">
      <div className="p-4 bg-[#12141c] flex items-start gap-3">
        {/* Severity indicator */}
        <div
          className="w-2 h-full min-h-[40px] rounded-full shrink-0 self-stretch"
          style={{ backgroundColor: color, opacity: 0.8 }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" style={{ color }} />
              <span className="font-semibold text-sm text-neutral-100">
                {getAnomalyLabel(alert.type)}
              </span>
              <span
                className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                style={{ color, backgroundColor: `${color}20` }}
              >
                {alert.severity}
              </span>
            </div>
            <span className="text-xs text-neutral-500 shrink-0">
              {new Date(alert.timestamp * 1000).toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">{alert.description}</p>

          <div className="flex items-center gap-2 mt-3">
            <code className="text-[10px] font-mono text-neutral-500 bg-[#0d0f15] px-2 py-0.5 rounded truncate max-w-[200px]">
              {alert.txid.slice(0, 8)}…{alert.txid.slice(-6)}
            </code>
            <span className="text-[10px] text-neutral-500">
              {alert.value.toLocaleString()} sats
            </span>
          </div>
        </div>

        <button
          onClick={() => void handleExplain()}
          className="shrink-0 flex items-center gap-1.5 text-xs text-[#f7931a] hover:text-[#ff9f20] transition-colors px-2 py-1 rounded-lg bg-[#f7931a]/10 hover:bg-[#f7931a]/20"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Explain</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {expanded && (
        <div className="p-4 bg-[#0d0f15] border-t border-[#1e2230]">
          {explaining ? (
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f7931a]" />
              <span>Getting AI explanation…</span>
            </div>
          ) : (
            <div className="text-xs text-neutral-300 leading-relaxed space-y-1">
              {explanation?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MonitoringPage() {
  const [address, setAddress] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [txCount, setTxCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const runScan = useCallback(async (addr: string) => {
    if (!addr) return;
    setScanning(true);
    setError(null);

    try {
      // Fetch transactions from our existing backend proxy
      const res = await fetch(`/api/wallet/${addr}`);
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as { transactions?: ApiTransaction[] };

      if (!data.transactions || data.transactions.length === 0) {
        setAlerts([]);
        setTxCount(0);
        setLastScan(new Date());
        return;
      }

      // Convert to detector format
      const txs: Transaction[] = data.transactions.map((tx) => ({
        txid: tx.txid,
        value: Math.abs(tx.netValue || 0),
        timestamp: tx.blockTime ?? Math.floor(Date.now() / 1000),
        type: tx.direction === 'out' ? 'outgoing' : 'incoming',
        confirmed: tx.confirmed,
      }));

      const detected = detectAnomalies(txs);
      setAlerts(detected);
      setTxCount(txs.length);
      setLastScan(new Date());
    } catch (err) {
      const e = err as { message: string };
      setError(e.message);
    } finally {
      setScanning(false);
    }
  }, []);

  // Auto-scan on page load if address is in sessionStorage
  useEffect(() => {
    try {
      const ctx = sessionStorage.getItem('btc-copilot-context');
      if (ctx) {
        const parsed = JSON.parse(ctx) as { walletAddress?: string };
        if (parsed.walletAddress) {
          setAddress(parsed.walletAddress);
          setInputAddress(parsed.walletAddress);
          void runScan(parsed.walletAddress);
        }
      }
    } catch {}
  }, [runScan]);

  const handleScan = () => {
    const addr = inputAddress.trim();
    if (!addr) return;
    setAddress(addr);
    void runScan(addr);
  };

  const highAlerts = alerts.filter((a) => a.severity === 'high');
  const medAlerts = alerts.filter((a) => a.severity === 'medium');
  const lowAlerts = alerts.filter((a) => a.severity === 'low');

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#f7931a]" />
              <span>Wallet Monitoring</span>
            </h1>
            <Badge variant="btc">Deterministic Engine</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Statistical anomaly detection — no AI guessing. LLM explains alerts on demand.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={() => address && void runScan(address)}
          disabled={scanning || !address}
        >
          {scanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />}
          <span>{scanning ? 'Scanning…' : 'Scan Now'}</span>
        </Button>
      </div>

      {/* Address Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                placeholder="Enter Bitcoin address to monitor (e.g. 1A1zP1…)"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#090a0f] border border-[#232736] text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-[#f7931a] focus:ring-1 focus:ring-[#f7931a]/40 transition-colors"
              />
            </div>
            <Button variant="primary" size="md" onClick={handleScan} disabled={scanning || !inputAddress.trim()}>
              {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
            </Button>
          </div>
          {lastScan && (
            <p className="text-[11px] text-neutral-500 mt-2">
              Last scan: {lastScan.toLocaleTimeString()} — {txCount} transactions analyzed
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-neutral-100">{alerts.length}</div>
            <div className="text-xs text-neutral-400 mt-0.5">Total Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">{highAlerts.length}</div>
            <div className="text-xs text-neutral-400 mt-0.5">High Severity</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#f7931a]">{medAlerts.length}</div>
            <div className="text-xs text-neutral-400 mt-0.5">Medium</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">{lowAlerts.length}</div>
            <div className="text-xs text-neutral-400 mt-0.5">Low</div>
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="p-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Scan error: {error}</span>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {!address && !scanning && (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm text-neutral-400">Enter a Bitcoin address above to start monitoring.</p>
              <p className="text-xs text-neutral-500 mt-1">The engine will analyze transaction patterns for anomalies.</p>
            </CardContent>
          </Card>
        )}

        {address && !scanning && alerts.length === 0 && !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm text-neutral-200 font-medium">No anomalies detected</p>
              <p className="text-xs text-neutral-400 mt-1">
                {txCount} transactions analyzed — all within normal parameters.
              </p>
            </CardContent>
          </Card>
        )}

        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onExplain={(a) => console.log('[Monitoring] Explain request for', a.id)}
          />
        ))}
      </div>

      {/* Engine Info */}
      <Card variant="accent">
        <CardContent className="p-4">
          <CardTitle className="text-xs font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#f7931a]" />
            Detection Rules Active
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Large Amount (5× rolling mean)</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> High Frequency (&gt;5 txs / 24h)</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Dust Attack (&lt;546 sats)</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Rapid Outflow (3+ txs / 1h)</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> New Destination Address</div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
