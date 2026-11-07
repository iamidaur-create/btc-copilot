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
import { RefreshCw, Info, Shield } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { AddressInput } from '@/components/dashboard/AddressInput';
import { WalletStats } from '@/components/dashboard/WalletStats';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { truncateAddress, formatTimeAgo } from '@/lib/utils/format-btc';
import type { WalletApiResponse } from '@/app/api/wallet/[address]/route';

const DEMO_ADDRESS = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
const STORAGE_KEY = 'btc-copilot-last-address';

export default function DashboardPage() {
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
      const json = await res.json();

      if (!res.ok) {
        // Our API returned an error (e.g. invalid address, network failure)
        setError(json.error ?? 'Failed to load wallet data.');
        return;
      }

      setWalletData(json as WalletApiResponse);
      setLastFetched(Date.now());

      // Save for next session
      try {
        localStorage.setItem(STORAGE_KEY, address);
      } catch {
        // ignore localStorage errors
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
            Wallet Dashboard
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Enter any Bitcoin address to analyze it. Read-only — no private keys ever.
          </p>
        </div>

        {/* Refresh + demo badges */}
        <div className="flex items-center gap-2">
          {isDemo && (
            <Badge variant="btc" className="text-xs gap-1">
              🟠 Demo Wallet
            </Badge>
          )}
          {walletData && (
            <Badge variant="outline" className="text-xs text-neutral-500">
              {lastFetched ? `Updated ${formatTimeAgo(lastFetched)}` : 'Live'}
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
              Refresh
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
              Check the address is correct and try again.
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
            <p className="text-neutral-300 font-semibold">No wallet loaded</p>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              Enter a Bitcoin address above or click{' '}
              <span className="text-[#f7931a]">Load Demo Wallet</span> to explore the
              Satoshi Genesis address.
            </p>
            <div className="pt-2">
              <Badge variant="outline" className="text-xs text-neutral-600">
                <Shield className="w-3 h-3 mr-1" />
                Read-only · No private keys · No wallet connection required
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

          {/* Stats cards + fee rates */}
          <WalletStats data={walletData} />

          {/* Transaction list */}
          <TransactionList
            transactions={walletData.transactions}
            address={walletData.address}
            onExplain={(txid) => {
              // TODO Milestone 4: navigate to AI assistant with this txid pre-loaded
              alert(`AI explanation coming in Milestone 4!\n\nTransaction: ${txid}`);
            }}
          />
        </div>
      )}
    </PageShell>
  );
}
