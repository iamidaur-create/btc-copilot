'use client';

/**
 * TransactionList Component
 *
 * Shows the list of recent Bitcoin transactions for the active wallet.
 *
 * For each transaction it shows:
 * - Direction: incoming (green arrow ↓) or outgoing (red arrow ↑)
 * - Amount in BTC (positive = received, negative = sent)
 * - Confirmation status badge
 * - Block height (which block it was mined in)
 * - Date and time
 * - Fee paid (in satoshis and sat/vByte)
 * - Truncated transaction ID (clickable — links to Mempool.space explorer)
 *
 * The "Explain with AI" button is a placeholder for Milestone 4.
 */

import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { satsToBtc, formatBtc, truncateTxid, formatTimeAgo } from '@/lib/utils/format-btc';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { WalletApiResponse } from '@/app/api/wallet/[address]/route';

type TxRow = WalletApiResponse['transactions'][number];

interface TransactionListProps {
  transactions: TxRow[];
  address: string;
  /** Called when user clicks Explain on a transaction */
  onExplain?: (txid: string) => void;
}

function TxRow({ tx, address, onExplain }: { tx: TxRow; address: string; onExplain?: (txid: string) => void }) {
  const { t, language } = useLanguage();
  const isIn = tx.direction === 'in';
  const isSelf = tx.direction === 'self';
  const amountBtc = formatBtc(Math.abs(satsToBtc(tx.netValue)));
  const feeSatsPerVbyte = tx.size > 0 ? (tx.fee / tx.size).toFixed(1) : '—';

  const dateStr = tx.blockTime
    ? new Date(tx.blockTime * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

  const timeAgo = tx.blockTime ? formatTimeAgo(tx.blockTime * 1000) : 'Pending';

  const explorerUrl = `https://mempool.space/tx/${tx.txid}`;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#1a1e2b] last:border-0 hover:bg-[#0d0f17] transition-colors px-1 rounded-lg group">
      {/* Direction icon */}
      <div
        className={`p-2 rounded-lg shrink-0 ${
          isSelf
            ? 'bg-neutral-800 text-neutral-400'
            : isIn
            ? 'bg-green-900/40 text-green-400'
            : 'bg-red-900/30 text-red-400'
        }`}
      >
        {isSelf ? (
          <RefreshCw className="w-4 h-4" />
        ) : isIn ? (
          <ArrowDownLeft className="w-4 h-4" />
        ) : (
          <ArrowUpRight className="w-4 h-4" />
        )}
      </div>

      {/* Txid + date */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-neutral-300 hover:text-[#f7931a] transition-colors flex items-center gap-1 truncate"
          >
            {truncateTxid(tx.txid)}
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
          {tx.confirmed ? (
            <Badge variant="success" className="text-[10px] shrink-0">Confirmed</Badge>
          ) : (
            <Badge variant="warning" className="text-[10px] shrink-0 animate-pulse">Pending</Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-neutral-500">
          <span>{timeAgo}</span>
          <span>·</span>
          <span>{dateStr}</span>
          {tx.blockHeight && (
            <>
              <span>·</span>
              <span>Block #{tx.blockHeight.toLocaleString()}</span>
            </>
          )}
          <span>·</span>
          <span>Fee: {tx.fee.toLocaleString()} sats ({feeSatsPerVbyte} sat/vB)</span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p
          className={`font-mono font-semibold text-sm ${
            isSelf
              ? 'text-neutral-400'
              : isIn
              ? 'text-green-400'
              : 'text-red-400'
          }`}
        >
          {isSelf ? '±' : isIn ? '+' : '−'}
          {amountBtc}
        </p>
        <p className="text-[11px] text-neutral-600">BTC</p>
      </div>

      {/* Explain button */}
      {onExplain && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExplain(tx.txid)}
          className="shrink-0 text-xs gap-1 text-[#f7931a] hover:bg-[#f7931a]/10 hover:text-[#f7931a]"
          title={language === 'fr' ? "Demander à l'assistant d'expliquer cette transaction" : "Ask assistant to explain this transaction"}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.dashboard.explainBtn}</span>
        </Button>
      )}
    </div>
  );
}

export function TransactionList({ transactions, address, onExplain }: TransactionListProps) {
  const { t, language } = useLanguage();

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-neutral-500 text-sm">
            {language === 'fr' ? 'Aucune transaction trouvée pour cette adresse.' : 'No transactions found for this address.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t.dashboard.recentTransactions}</span>
          <Badge variant="outline" className="text-xs font-normal">
            {transactions.length} {t.dashboard.shown}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {transactions.map((tx) => (
          <TxRow
            key={tx.txid}
            tx={tx}
            address={address}
            onExplain={onExplain}
          />
        ))}
      </CardContent>
    </Card>
  );
}
