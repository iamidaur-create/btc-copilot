'use client';

import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Zap, Network, Globe, Layers, ExternalLink } from 'lucide-react';
import { NWCWalletManager } from '@/components/lightning/NWCWalletManager';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LightningPage() {
  const { t } = useLanguage();
  const acinqPubkey = '03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f';

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" />
              <span>{t.lightning.title}</span>
            </h1>
            <Badge variant="btc">NIP-47 Live</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            {t.lightning.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-xs py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
            {t.lightning.protocolReady}
          </Badge>
        </div>
      </div>

      {/* ⚡ Priority: NWC Interactive Wallet & Simulator */}
      <NWCWalletManager />
    </PageShell>
  );
}
