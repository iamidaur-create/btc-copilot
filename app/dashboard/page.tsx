'use client';

/**
 * Dashboard Page — Live Wallet Dashboard
 *
 * This is the main page of BTC Copilot.
 *
 * What happens here:
 * 1. User types a Bitcoin address (or clicks "Load Demo Wallet")
 * 2. We validate the address in the browser (instant, no network)
 * 3. We call our own API route: GET /api/wallet/[address]
 * 4. Our API route fetches from Mempool.space (server-side, safe)
 * 5. We display the balance, stats, and transaction list
 *
 * State management:
 * - activeAddress: the current Bitcoin address being analyzed
 * - walletData: the response from our API (null = not loaded yet)
 * - isLoading: true while the API call is in progress
 * - error: error message if the API call failed
 *
 * We persist the last used address in localStorage so it
 * reloads automatically on page refresh.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Info, Shield } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { AddressInput } from '@/components/dashboard/AddressInput';
import { WalletStats } from '@/components/dashboard/WalletStats';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { truncateAddress, formatTimeAgo } from '@/lib/utils/format-btc';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { WalletApiResponse } from '@/app/api/wallet/[address]/route';

const DEMO_ADDRESS = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
const STORAGE_KEY = 'btc-copilot-last-address';

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [activeAddress, setActiveAddress] = useState<string>('');
  const [walletData, setWalletData] = useState<WalletApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  // On first load, check if user had a previous address saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        loadWallet(saved);
      }
    } catch {
      // localStorage not available (e.g. private browsing) — that's fine
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetches wallet data from our server-side API route.
   * This function is called when the user submits an address.
   */
  const loadWallet = useCallback(async (address: string) => {
    setActiveAddress(address);
    setIsLoading(true);
    setError(null);
    setWalletData(null);

    try {
      const res = await fetch(`/api/wallet/${encodeURIComponent(address)}`);
      const rawText = await res.text();
      let json: Record<string, unknown> = {};

      try {
        json = JSON.parse(rawText) as Record<string, unknown>;
      } catch {
        setError(`Server returned status ${res.status}. Please refresh the page.`);
        return;
      }

      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Failed to load wallet data.');
        return;
      }

      const data = json as unknown as WalletApiResponse;
      setWalletData(data);
      setLastFetched(Date.now());

      // Save for next session
      try {
        localStorage.setItem(STORAGE_KEY, address);
        // Sync context to AI Assistant and Monitoring pages
        const context = {
          walletAddress: data.address,
          balance: data.balance?.total,
          feeRate: data.fees?.medium,
          transactions: data.transactions?.slice(0, 10).map((t) => ({
            txid: t.txid,
            value: Math.abs(t.netValue),
            timestamp: t.blockTime ?? Math.floor(Date.now() / 1000),
            type: t.direction === 'out' ? 'outgoing' : 'incoming',
            confirmed: t.confirmed,
          })),
        };
        sessionStorage.setItem('btc-copilot-context', JSON.stringify(context));
      } catch {
        // ignore storage errors
      }
    } catch {
      setError('Could not connect to the server. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    if (activeAddress) loadWallet(activeAddress);
  }, [activeAddress, loadWallet]);

  const isDemo = activeAddress === DEMO_ADDRESS;

  return (
    <PageShell>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>

        {/* Refresh + demo badges */}
        <div className="flex items-center gap-2">
          {isDemo && (
            <Badge variant="btc" className="text-xs gap-1">
              🟠 {t.topBar.demoWallet}
            </Badge>
          )}
          {walletData && (
            <Badge variant="outline" className="text-xs text-neutral-500">
              {lastFetched ? `${t.dashboard.updated} ${formatTimeAgo(lastFetched)}` : 'Live'}
            </Badge>
          )}
          {activeAddress && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2 text-neutral-400"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              {t.dashboard.refresh}
            </Button>
          )}
        </div>
      </div>

      {/* Address input */}
      <div className="mt-4">
        <AddressInput
          onAddressSubmit={loadWallet}
          isLoading={isLoading}
          currentAddress={activeAddress}
        />
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="mt-6 space-y-4 animate-pulse">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-[#12141c] rounded-xl border border-[#1e2230]" />
            ))}
          </div>
          <div className="h-64 bg-[#12141c] rounded-xl border border-[#1e2230]" />
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <Card className="mt-6 border-red-500/20">
          <CardContent className="py-8 text-center space-y-2">
            <Info className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-red-400 font-medium text-sm">{error}</p>
            <p className="text-neutral-500 text-xs">
              {language === 'fr' ? "Vérifiez que l'adresse est correcte et réessayez." : "Check the address is correct and try again."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty state — no address loaded yet */}
      {!walletData && !isLoading && !error && (
        <Card className="mt-6">
          <CardContent className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f7931a]/10 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-[#f7931a]" />
            </div>
            <p className="text-neutral-300 font-semibold">{t.dashboard.noWalletLoaded}</p>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              {t.dashboard.noWalletDesc}
            </p>
            <div className="pt-2">
              <Badge variant="outline" className="text-xs text-neutral-600">
                <Shield className="w-3 h-3 mr-1" />
                {t.dashboard.readOnlyBadge}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live wallet data */}
      {walletData && !isLoading && (
        <div className="mt-6 space-y-6">
          {/* Address pill */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
            <span className="text-neutral-600">Analyzing:</span>
            <span className="text-neutral-300 bg-[#12141c] px-3 py-1 rounded-full border border-[#1e2230]">
              {truncateAddress(walletData.address, 12)}
            </span>
            <Badge variant="outline" className="capitalize text-[10px]">
              {walletData.addressType}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {walletData.network}
            </Badge>
          </div>

          {/* Persona Scenario Banner (if applicable) */}
          {activeAddress === 'bc1qzg00x6y3s6j3w798lese4aklk5xe3xed5hzk9n' && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">🟢</span>
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                    {language === 'fr' ? 'Profil Démo : Fatou (Épargne & Découverte Bitcoin)' : 'Demo Profile: Fatou (Bitcoin Savings & Learning)'}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {language === 'fr'
                      ? 'Adresse SegWit propre (60 000 sats). Aucun risque détecté. Parfait pour tester l’explication pédagogique de l’IA.'
                      : 'Clean SegWit address (60,000 sats). Zero risk detected. Perfect for testing AI plain-language education.'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => router.push('/assistant')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 text-xs gap-1.5"
              >
                <span>💬 {language === 'fr' ? "Demander à l'IA" : "Ask AI"}</span>
              </Button>
            </div>
          )}

          {activeAddress === '13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94' && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">🟠</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    {language === 'fr' ? 'Profil Démo : Moussa (Alerte Dust Attack & Risque)' : 'Demo Profile: Moussa (Dust Attack & Threat Alert)'}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {language === 'fr'
                      ? 'Adresse Legacy ciblée par du dust (< 546 sats). BTC Copilot détecte l’attaque et prévient le désanonymat.'
                      : 'Legacy address targeted by dust (< 546 sats). BTC Copilot alerts and prevents deanonymization.'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => router.push('/monitoring')}
                className="bg-amber-600 hover:bg-amber-500 text-white shrink-0 text-xs gap-1.5"
              >
                <span>🛡️ {language === 'fr' ? "Voir la Surveillance" : "View Monitoring"}</span>
              </Button>
            </div>
          )}

          {/* Stats cards + fee rates */}
          <WalletStats data={walletData} />

          {/* Quick Actions Row: Copilot Intelligence & Security Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => router.push('/assistant')}
              className="p-3.5 rounded-xl bg-[#12141c] hover:bg-[#161a24] border border-[#1e2230] hover:border-purple-500/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                  <span className="text-sm">💬</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-100 group-hover:text-purple-300 transition-colors">
                    {language === 'fr' ? 'Explication IA du Portefeuille' : 'AI Wallet Summary'}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {language === 'fr' ? 'Analyse en langage clair de vos fonds' : 'Plain language breakdown of your funds'}
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => router.push('/monitoring')}
              className="p-3.5 rounded-xl bg-[#12141c] hover:bg-[#161a24] border border-[#1e2230] hover:border-amber-500/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <span className="text-sm">🛡️</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-100 group-hover:text-amber-300 transition-colors">
                    {language === 'fr' ? 'Surveillance des Risques' : 'Risk & Anomaly Monitor'}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {language === 'fr' ? 'Détection dust, drains et anomalies' : 'Dust attacks, outflows & anomaly checks'}
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => router.push('/security')}
              className="p-3.5 rounded-xl bg-[#12141c] hover:bg-[#161a24] border border-[#1e2230] hover:border-emerald-500/40 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <span className="text-sm">🔍</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-100 group-hover:text-emerald-300 transition-colors">
                    {language === 'fr' ? 'Vérificateur Anti-Arnaque' : 'Anti-Scam Verifier'}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {language === 'fr' ? 'Vérifier une adresse avant tout envoi' : 'Check address against risk databases'}
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Transaction list */}
          <TransactionList
            transactions={walletData.transactions}
            address={walletData.address}
            onExplain={(txid) => {
              router.push(`/assistant?explainTx=${encodeURIComponent(txid)}`);
            }}
          />
        </div>
      )}
    </PageShell>
  );
}
