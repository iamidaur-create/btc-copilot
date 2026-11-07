'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bot, 
  ArrowLeftRight, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Settings,
  Bitcoin,
  Lock
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Assistant', href: '/assistant', icon: Bot, badge: 'AI' },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Lightning', href: '/lightning', icon: Zap, highlight: true },
  { name: 'Monitoring', href: '/monitoring', icon: Activity },
  { name: 'Security Center', href: '/security', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0d0f15] border-r border-[#1a1e2b] flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1a1e2b] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f7931a] to-[#ffaa3b] flex items-center justify-center text-neutral-950 font-black shadow-[0_0_15px_rgba(247,147,26,0.35)] group-hover:scale-105 transition-transform">
            <Bitcoin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-neutral-100 tracking-tight text-base">BTC Copilot</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#f7931a]/15 text-[#f7931a] border border-[#f7931a]/30">MVP</span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">Wallet Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
          Intelligence Platform
        </div>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#191d28] text-[#f7931a] shadow-inner border border-[#2a3044]'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#131620]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#f7931a]' : item.highlight ? 'text-amber-400' : 'text-neutral-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f7931a]/20 text-[#f7931a]">
                  {item.badge}
                </span>
              )}
              {item.highlight && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Security & Read-Only Badge */}
      <div className="p-4 border-t border-[#1a1e2b] bg-[#0a0b10]">
        <div className="p-3 rounded-xl bg-[#12141c] border border-[#1e2230] space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Read-Only Mode
            </span>
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Zero private key storage. Zero signing. Safe blockchain observation only.
          </p>
        </div>
      </div>
    </aside>
  );
}
