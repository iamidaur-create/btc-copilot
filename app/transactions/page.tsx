'use client';

/**
 * TransactionsPage — Complete History & Deep-Dive Transaction Inspector (CryptPilot)
 *
 * Connects directly to the live Bitcoin wallet transactions.
 * Features:
 * - Real data from Mempool.space via /api/wallet/[address]
 * - Filter by Direction (All, Received, Sent, Pending)
 * - CSV export
 * - Deep-dive "Expliquer avec l'IA" button -> navigates to Assistant with pre-filled prompt
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Filter,
  Download,
  ExternalLink,
  Bot,
  Sparkles,
  Shield,
  Loader2,
} from 'lucide-react';
import { satsToBtc, formatBtc, truncateTxid, truncateAddress, formatTimeAgo } from '@/lib/utils/format-btc';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { WalletApiResponse, ApiTransaction } from '@/app/api/wallet/[address]/route';

const DEMO_ADDRESS = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
const STORAGE_KEY = 'btc-copilot-last-address';

type FilterType = 'all' | 'in' | 'out' | 'pending';

export default function TransactionsPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [address, setAddress] = useState<string>('');
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchTransactions = useCallback(async (addr: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/wallet/${encodeURIComponent(addr)}`);
      const rawText = await res.text();
      let json: Record<string, unknown> = {};
      try {
        json = JSON.parse(rawText) as Record<string, unknown>;
      } catch {
        setError(`Erreur serveur (${res.status})`);
        return;
      }

      if (!res.ok || !Array.isArray(json.transactions)) {
        setError(typeof json.error === 'string' ? json.error : 'Impossible de récupérer les transactions.');
        return;
      }

      const data = json as unknown as WalletApiResponse;
      setTransactions(data.transactions);
    } catch {
      setError('Erreur de connexion au serveur.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let saved = DEMO_ADDRESS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored.trim() !== '') saved = stored;
    } catch {}
    setAddress(saved);
    void fetchTransactions(saved);
  }, [fetchTransactions]);

  // Filtering logic
  const filteredTxs = useMemo(() => {
    return transactions.filter((tx) => {
      if (filter === 'in') return tx.direction === 'in';
      if (filter === 'out') return tx.direction === 'out';
      if (filter === 'pending') return !tx.confirmed;
      return true;
    });
  }, [transactions, filter]);

  // Export CSV
  const handleExportCsv = () => {
    if (transactions.length === 0) return;
    const headers = ['txid', 'direction', 'amount_sats', 'amount_btc', 'fee_sats', 'confirmed', 'block_height', 'date'];
    const rows = transactions.map((t) => [
      t.txid,
      t.direction,
      Math.abs(t.netValue),
      satsToBtc(Math.abs(t.netValue)),
      t.fee,
      t.confirmed ? 'true' : 'false',
      t.blockHeight ?? '',
      t.blockTime ? new Date(t.blockTime * 1000).toISOString() : '',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `btc-transactions-${address.slice(0, 8)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExplain = (txid: string) => {
    router.push(`/assistant?explainTx=${encodeURIComponent(txid)}`);
  };

  const confirmedCount = transactions.filter((t) => t.confirmed).length;
  const pendingCount = transactions.filter((t) => !t.confirmed).length;

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">{t.transactionsPage.title}</h1>
            <Badge variant="btc">On-Chain</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            {t.transactionsPage.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchTransactions(address)}
            disabled={isLoading || !address}
            className="gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t.transactionsPage.refresh}</span>
          </Button>

          {/* Export CSV */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            disabled={transactions.length === 0}
            className="gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.transactionsPage.exportCsv}</span>
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#12141c] p-2 rounded-xl border border-[#1e2230]">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-neutral-500 ml-2 mr-1" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === 'all' ? 'bg-[#f7931a] text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.transactionsPage.all} ({transactions.length})
          </button>
          <button
            onClick={() => setFilter('in')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === 'in' ? 'bg-[#f7931a] text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.transactionsPage.received}
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === 'out' ? 'bg-[#f7931a] text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.transactionsPage.sent}
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filter === 'pending' ? 'bg-[#f7931a] text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.transactionsPage.pending} ({pendingCount})
          </button>
        </div>

        {address && (
          <div className="text-xs text-neutral-400 font-mono pr-2">
            Wallet : <span className="text-[#f7931a]">{truncateAddress(address, 10)}</span>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <Card>
          <CardContent className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#f7931a] animate-spin mx-auto" />
            <p className="text-neutral-300 text-sm">Chargement des transactions depuis la blockchain...</p>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <Card className="border-red-500/20">
          <CardContent className="py-8 text-center space-y-2">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Transaction Table Card */}
      {!isLoading && !error && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{language === 'fr' ? 'Transactions Récentes' : 'Recent Transactions'}</CardTitle>
              <CardDescription>
                {filteredTxs.length} {language === 'fr' ? 'transaction(s) affichée(s)' : 'transaction(s) shown'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">
                {language === 'fr' ? `Confirmées (${confirmedCount})` : `Confirmed (${confirmedCount})`}
              </Badge>
              {pendingCount > 0 ? (
                <Badge variant="warning" className="animate-pulse">
                  {language === 'fr' ? `En attente (${pendingCount})` : `Pending (${pendingCount})`}
                </Badge>
              ) : (
                <Badge variant="outline">
                  {language === 'fr' ? '0 en attente' : '0 pending'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTxs.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-sm">
                {t.transactionsPage.emptyFilter}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0f1118] text-xs font-semibold text-neutral-400 border-b border-[#1e2230]">
                    <tr>
                      <th className="py-3 px-4">{t.transactionsPage.thType}</th>
                      <th className="py-3 px-4">{t.transactionsPage.thTxid}</th>
                      <th className="py-3 px-4">{t.transactionsPage.thAmount}</th>
                      <th className="py-3 px-4">{t.transactionsPage.thStatus}</th>
                      <th className="py-3 px-4">{t.transactionsPage.thFee}</th>
                      <th className="py-3 px-4">{t.transactionsPage.thDate}</th>
                      <th className="py-3 px-4 text-right">{t.transactionsPage.thAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2230]/60">
                    {filteredTxs.map((tx) => {
                      const isIn = tx.direction === 'in';
                      const isSelf = tx.direction === 'self';
                      const amountBtc = formatBtc(Math.abs(satsToBtc(tx.netValue)));
                      const feeRate = tx.size > 0 ? (tx.fee / tx.size).toFixed(1) : '—';
                      const dateStr = tx.blockTime
                        ? new Date(tx.blockTime * 1000).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : t.transactionsPage.pending;

                      return (
                        <tr key={tx.txid} className="hover:bg-[#151822] transition-colors group">
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                isSelf
                                  ? 'text-neutral-400'
                                  : isIn
                                  ? 'text-emerald-400'
                                  : 'text-red-400'
                              }`}
                            >
                              {isSelf ? (
                                <RefreshCw className="w-3.5 h-3.5" />
                              ) : isIn ? (
                                <ArrowDownLeft className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              )}
                              <span>{isSelf ? t.transactionsPage.selfTransfer : isIn ? t.transactionsPage.received : t.transactionsPage.sent}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <a
                              href={`https://mempool.space/tx/${tx.txid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-neutral-300 hover:text-[#f7931a] transition-colors flex items-center gap-1"
                            >
                              {truncateTxid(tx.txid)}
                              <ExternalLink className="w-3 h-3 text-neutral-500" />
                            </a>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs font-bold">
                            <span
                              className={
                                isSelf
                                  ? 'text-neutral-400'
                                  : isIn
                                  ? 'text-emerald-400'
                                  : 'text-red-400'
                              }
                            >
                              {isSelf ? '±' : isIn ? '+' : '−'}{amountBtc} BTC
                            </span>
                            <div className="text-[10px] text-neutral-500 font-normal">
                              {Math.abs(tx.netValue).toLocaleString()} sats
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {tx.confirmed ? (
                              <Badge variant="success" className="text-[10px]">
                                {t.transactionsPage.confirmed} {tx.blockHeight ? `(#${tx.blockHeight.toLocaleString()})` : ''}
                              </Badge>
                            ) : (
                              <Badge variant="warning" className="text-[10px] animate-pulse">
                                {t.transactionsPage.mempoolPending}
                              </Badge>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-neutral-400">
                            {tx.fee.toLocaleString()} sats
                            <span className="text-[10px] text-neutral-600 block">{feeRate} sat/vB</span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-neutral-400">
                            {dateStr}
                            {tx.blockTime && (
                              <span className="text-[10px] text-neutral-600 block">
                                {formatTimeAgo(tx.blockTime * 1000)}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExplain(tx.txid)}
                              className="gap-1.5 text-xs text-[#f7931a] hover:bg-[#f7931a]/15 hover:text-[#f7931a] font-medium"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Expliquer</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
