'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Zap, ChevronRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { truncateAddress } from '@/lib/utils/format-btc';

interface TopBarProps {
  currentAddress?: string;
  isDemo?: boolean;
}

export function TopBar({
  currentAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  isDemo = true,
}: TopBarProps) {
  return (
    <header className="h-16 border-b border-[#1a1e2b] bg-[#0d0f15]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Active Wallet Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12141c] border border-[#1e2230]">
          <span className="text-xs text-neutral-400 font-medium">Active Target:</span>
          <span className="text-xs font-mono font-semibold text-neutral-200">
            {truncateAddress(currentAddress, 8, 6)}
          </span>
          {isDemo && (
            <Badge variant="btc" className="text-[10px] py-0 px-1.5">
              Demo Wallet
            </Badge>
          )}
        </div>

        <a
          href={`https://mempool.space/address/${currentAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-400 hover:text-[#f7931a] flex items-center gap-1 transition-colors"
          title="View on Mempool.space"
        >
          <span>Mempool.space</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Right: System Status & Quick Links */}
      <div className="flex items-center gap-3">
        {/* Lightning Pill */}
        <Link
          href="/lightning"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161a26] border border-[#222838] text-xs text-neutral-300 hover:border-amber-400/40 transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span>Lightning: <strong className="text-neutral-100">ACINQ</strong></span>
        </Link>

        {/* AI Provider Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141a24] border border-[#1e2638] text-xs text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-neutral-400">AI Gateway:</span>
          <span className="font-medium text-neutral-200">Mistral</span>
          <span className="text-neutral-500">/</span>
          <span className="text-neutral-400">Gemini</span>
        </div>

        {/* Security Pill */}
        <Link
          href="/security"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="font-semibold">Privacy Safe</span>
          <ChevronRight className="w-3 h-3 text-emerald-400/70" />
        </Link>
      </div>
    </header>
  );
}
