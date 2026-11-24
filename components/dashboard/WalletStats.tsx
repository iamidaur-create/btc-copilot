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
import { useLanguage } from '@/lib/i18n/LanguageContext';
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
  const { t } = useLanguage();
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
          label={t.walletStats.confirmedBalance}
          value={confirmedBtc}
          subValue={`${balance.confirmed.toLocaleString()} sats`}
          accent
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label={t.walletStats.pendingBalance}
          value={balance.unconfirmed !== 0 ? unconfirmedBtc : '0.00000000'}
          subValue={
            balance.unconfirmed !== 0
              ? `${balance.unconfirmed.toLocaleString()} sats`
              : t.walletStats.noPending
          }
        />
        <StatCard
          icon={<ArrowDownLeft className="w-5 h-5" />}
          label={t.walletStats.totalReceived}
          value={totalReceivedBtc}
          subValue={`${stats.totalReceived.toLocaleString()} sats entrants`}
        />
        <StatCard
          icon={<ArrowUpRight className="w-5 h-5" />}
          label={t.walletStats.totalSent}
          value={totalSentBtc}
          subValue={`${stats.txCount.toLocaleString()} ${t.walletStats.totalTransactions}`}
        />
      </div>

      {/* Fee rates row (optional — only shown if fee data is available) */}
      {fees && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#12141c] border border-[#1e2230] text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Zap className="w-3.5 h-3.5 text-[#f7931a]" />
            <span className="font-medium">{t.walletStats.networkFees}</span>
          </div>
          <div className="h-4 w-px bg-[#1e2230]" />
          <div className="flex flex-wrap gap-4">
            <span>
              <span className="text-neutral-500">{t.walletStats.fast}: </span>
              <span className="text-green-400 font-mono font-semibold">{fees.fast} sat/vB</span>
            </span>
            <span>
              <span className="text-neutral-500">{t.walletStats.medium}: </span>
              <span className="text-yellow-400 font-mono font-semibold">{fees.medium} sat/vB</span>
            </span>
            <span>
              <span className="text-neutral-500">{t.walletStats.slow}: </span>
              <span className="text-neutral-400 font-mono font-semibold">{fees.slow} sat/vB</span>
            </span>
            <span>
              <span className="text-neutral-500">{t.walletStats.economy}: </span>
              <span className="text-neutral-500 font-mono font-semibold">{fees.economy} sat/vB</span>
            </span>
          </div>
          <div className="ml-auto">
            <Badge variant="outline" className="text-[10px]">{t.walletStats.live}</Badge>
          </div>
        </div>
      )}
    </div>
  );
}
