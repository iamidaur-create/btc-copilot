'use client';

import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Zap, Network, Globe, Layers, ExternalLink } from 'lucide-react';
import { NWCWalletManager } from '@/components/lightning/NWCWalletManager';

export default function LightningPage() {
  const acinqPubkey = '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f';

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              <span>Lightning Network & NWC Wallet</span>
            </h1>
            <Badge variant="btc">NIP-47 Live</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Connect your non-custodial Lightning wallet with Nostr Wallet Connect, inspect balances, and receive payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-xs py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
            NWC Protocol Ready
          </Badge>
        </div>
      </div>

      {/* ⚡ Priority: NWC Interactive Wallet */}
      <NWCWalletManager />

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="accent">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Network Capacity</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-neutral-100 font-mono">
                2,530.94 <span className="text-sm font-sans text-amber-400">BTC</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-mono">
                ~253 Billion satoshis locked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Active Channels</span>
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-sky-400 font-mono">
                22,680
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Payment routing conduits
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Active Nodes</span>
              <Network className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-purple-400 font-mono">
                13,777
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                6,816 Tor • 3,283 Clearnet
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Median Base Fee</span>
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                500 <span className="text-xs font-sans text-neutral-400">mSat</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-mono">
                Median fee rate: 100 ppm
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Demo Node: ACINQ */}
      <Card variant="glow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Demo Node: ACINQ (Phoenix Wallet)</CardTitle>
                <Badge variant="btc">Top 3 Liquidity Hub</Badge>
              </div>
              <CardDescription className="font-mono text-xs">
                {acinqPubkey}
              </CardDescription>
            </div>
          </div>

          <a
            href={`https://mempool.space/lightning/node/${acinqPubkey}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 hover:text-amber-400 flex items-center gap-1"
          >
            <span>View on Mempool</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#090a0f] border border-[#1e2230]">
            <div>
              <span className="text-xs text-neutral-500 uppercase font-semibold">Node Capacity</span>
              <div className="text-xl font-bold text-neutral-100 font-mono mt-1">
                258.29 <span className="text-sm font-sans text-amber-400">BTC</span>
              </div>
              <p className="text-xs text-neutral-400">25,829,042,767 sats</p>
            </div>

            <div>
              <span className="text-xs text-neutral-500 uppercase font-semibold">Open Channels</span>
              <div className="text-xl font-bold text-sky-400 font-mono mt-1">
                1,518 Channels
              </div>
              <p className="text-xs text-neutral-400">Highly connected hub</p>
            </div>

            <div>
              <span className="text-xs text-neutral-500 uppercase font-semibold">Operator / Origin</span>
              <div className="text-xl font-bold text-neutral-200 mt-1">
                ACINQ (US / France)
              </div>
              <p className="text-xs text-neutral-400">Creators of Eclair & Phoenix</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
