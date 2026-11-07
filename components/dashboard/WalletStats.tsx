'use client';

/**
 * WalletStats Component
 *
 * Displays 4 stat cards across the top of the dashboard:
 *   1. Confirmed Balance
 *   2. Unconfirmed (Pending) Balance
 *   3. Total Transactions
 *   4. Total Received / Sent
 *
 * Also shows current Bitcoin network fee rates in a separate row.
 *
 * Receives wallet data from the Dashboard page as props.
 */

import React from 'react';
import { Wallet, Clock, ArrowDownLeft, ArrowUpRight, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { satsToBtc, formatBtc } from '@/lib/utils/format-btc';
import type { WalletApiResponse } from '@/app/api/wallet/[address]/route';

interface WalletStatsProps {
  data: WalletApiResponse;
}

/** Shows a single stat card */
function StatCard({
  icon,
  label,
  value,
  subValue,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  accent?: boolean;
}) {
  return (
    <Card className="flex-1">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium">{label}</p>
            <p className={`text-2xl font-bold font-mono ${accent ? 'text-[#f7931a]' : 'text-neutral-100'}`}>
              {value}
            </p>
            {subValue && <p className="text-xs text-neutral-500">{subValue}</p>}
          </div>
          <div className="p-2 rounded-lg bg-[#090a0f] text-neutral-400">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WalletStats({ data }: WalletStatsProps) {
  const { balance, stats, fees } = data;

  // Convert satoshis to BTC for display
  const confirmedBtc = formatBtc(satsToBtc(balance.confirmed));
  const unconfirmedBtc = formatBtc(satsToBtc(balance.unconfirmed));
  const totalReceivedBtc = formatBtc(satsToBtc(stats.totalReceived));
  const totalSentBtc = formatBtc(satsToBtc(stats.totalSent));

  return (
    <div className="space-y-4">
      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          label="Confirmed Balance"
          value={confirmedBtc}
          subValue="₿ on-chain confirmed"
          accent
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Pending Balance"
          value={balance.unconfirmed !== 0 ? unconfirmedBtc : '0.00000000'}
          subValue={
            stats.unconfirmedTxCount > 0
              ? `${stats.unconfirmedTxCount} tx in mempool`
              : 'No pending transactions'
          }
        />
        <StatCard
          icon={<ArrowDownLeft className="w-5 h-5" />}
          label="Total Received"
          value={totalReceivedBtc}
          subValue="lifetime incoming"
        />
        <StatCard
          icon={<ArrowUpRight className="w-5 h-5" />}
          label="Total Sent"
          value={totalSentBtc}
          subValue={`${stats.txCount.toLocaleString()} total transactions`}
        />
      </div>

      {/* Fee rates row (optional — only shown if fee data is available) */}
      {fees && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#12141c] border border-[#1e2230] text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Zap className="w-3.5 h-3.5 text-[#f7931a]" />
            <span className="font-medium">Network Fees</span>
          </div>
          <div className="h-4 w-px bg-[#1e2230]" />
          <div className="flex flex-wrap gap-4">
            <span>
              <span className="text-neutral-500">Fast: </span>
              <span className="text-green-400 font-mono font-semibold">{fees.fast} sat/vB</span>
            </span>
            <span>
              <span className="text-neutral-500">Medium: </span>
              <span className="text-yellow-400 font-mono font-semibold">{fees.medium} sat/vB</span>
            </span>
            <span>
              <span className="text-neutral-500">Slow: </span>
              <span className="text-neutral-400 font-mono font-semibold">{fees.slow} sat/vB</span>
            </span>
            <span>
              <span className="text-neutral-500">Economy: </span>
              <span className="text-neutral-500 font-mono font-semibold">{fees.economy} sat/vB</span>
            </span>
          </div>
          <div className="ml-auto">
            <Badge variant="outline" className="text-[10px]">Live</Badge>
          </div>
        </div>
      )}
    </div>
  );
}
