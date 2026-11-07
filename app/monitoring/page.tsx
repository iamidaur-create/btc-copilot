import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Activity, ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, Bot } from 'lucide-react';

export default function MonitoringPage() {
  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#f7931a]" />
              <span>Wallet Monitoring & Anomaly Detection</span>
            </h1>
            <Badge variant="btc">Deterministic Engine</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Autonomous statistical surveillance against large spikes, rapid outflows, and dust attacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Poll Now (Interval: 5m)</span>
          </Button>
        </div>
      </div>

      {/* Engine Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Engine Status</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Active Surveillance
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Zero LLM interference in detection rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Monitored Target</span>
              <Badge variant="btc">Demo</Badge>
            </div>
            <div className="text-sm font-bold text-neutral-100 font-mono mt-2">
              1A1zP1eP5Q...Divfna
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Satoshi Nakamoto Genesis Address
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Active Alerts</span>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-neutral-100 font-mono mt-2">
              0 Critical Anomaly
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Baseline: normal tribute inflows
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detection Rules Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Deterministic Detection Rules</CardTitle>
          <CardDescription>
            Configured thresholds applied mathematically to every incoming and outgoing transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#090a0f] border border-[#1e2230] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-200">1. Large Amount Outlier</span>
                <Badge variant="warning">5× Rolling Mean</Badge>
              </div>
              <p className="text-xs text-neutral-400">
                Flags any transaction exceeding 500% of the wallet&apos;s 20-transaction rolling average amount.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090a0f] border border-[#1e2230] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-200">2. Transaction Frequency Burst</span>
                <Badge variant="warning">3× 24h Rate</Badge>
              </div>
              <p className="text-xs text-neutral-400">
                Flags abnormal transaction spikes exceeding 300% of the historical daily baseline.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090a0f] border border-[#1e2230] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-200">3. Dust Attack Detector</span>
                <Badge variant="danger">&lt; 546 Sats</Badge>
              </div>
              <p className="text-xs text-neutral-400">
                Identifies microscopic dust outputs designed to deanonymize wallet clustering.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090a0f] border border-[#1e2230] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-200">4. Rapid Outflow Drainage</span>
                <Badge variant="danger">≥ 3 txs / 60m</Badge>
              </div>
              <p className="text-xs text-neutral-400">
                Flags rapid successive outgoing transactions indicating possible unauthorized wallet draining.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
