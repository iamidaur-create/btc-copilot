'use client';

/**
 * NWCWalletManager Component
 *
 * Implements real Lightning Network Wallet Connect (NIP-47) interface.
 * Features:
 * - Enter pairing secret (in memory only, never stored in localStorage)
 * - Display connected node alias, supported NWC methods, pubkey
 * - Live balance in satoshis & BTC
 * - Generate BOLT-11 invoices to receive real sats
 * - Live invoice payment polling & verification
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, 
  Link2, 
  Unlink, 
  ShieldCheck, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle, 
  ArrowDownLeft, 
  QrCode,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { satsToBtc, formatBtc, formatSats } from '@/lib/utils/format-btc';
import type { NWCConnectionInfo, NWCInvoice, NWCLookupResult } from '@/lib/lightning/nwc';

export function NWCWalletManager() {
  const [connectionUri, setConnectionUri] = useState('');
  const [walletInfo, setWalletInfo] = useState<NWCConnectionInfo | null>(null);
  const [balanceSats, setBalanceSats] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Invoice creation state
  const [invoiceAmount, setInvoiceAmount] = useState('1000');
  const [invoiceMemo, setInvoiceMemo] = useState('Payment to BTC Copilot');
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<NWCInvoice | null>(null);
  const [invoiceStatus, setInvoiceStatus] = useState<NWCLookupResult | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Connect to NWC
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionUri.trim()) return;

    setIsConnecting(true);
    setError(null);

    try {
      // 1. Fetch wallet info (get_info)
      const infoRes = await fetch('/api/lightning/nwc/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionUri: connectionUri.trim() }),
      });
      const infoData = await infoRes.json();
      if (!infoRes.ok) throw new Error(infoData.error || 'Connection failed');

      setWalletInfo(infoData);

      // 2. Fetch initial balance (get_balance)
      if (infoData.methods.includes('get_balance')) {
        const balRes = await fetch('/api/lightning/nwc/balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ connectionUri: connectionUri.trim() }),
        });
        const balData = await balRes.json();
        if (balRes.ok) {
          setBalanceSats(balData.balanceSats);
        }
      }
    } catch (err) {
      setError((err as Error).message);
      setWalletInfo(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConnectionUri('');
    setWalletInfo(null);
    setBalanceSats(null);
    setCreatedInvoice(null);
    setInvoiceStatus(null);
    setError(null);
  };

  // Generate Invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(invoiceAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount of satoshis');
      return;
    }

    setIsCreatingInvoice(true);
    setError(null);
    setCreatedInvoice(null);
    setInvoiceStatus(null);

    try {
      const res = await fetch('/api/lightning/nwc/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionUri: connectionUri.trim(),
          amountSats: amount,
          memo: invoiceMemo.trim() || 'BTC Copilot Invoice',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create invoice');

      setCreatedInvoice(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  // Poll for invoice settlement
  useEffect(() => {
    if (!createdInvoice || invoiceStatus?.settled) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/lightning/nwc/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            connectionUri: connectionUri.trim(),
            paymentHash: createdInvoice.paymentHash,
          }),
        });
        const data = await res.json();
        if (res.ok && data.settled) {
          setInvoiceStatus(data);
          // Refresh balance after receiving payment
          if (walletInfo?.methods.includes('get_balance')) {
            const balRes = await fetch('/api/lightning/nwc/balance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ connectionUri: connectionUri.trim() }),
            });
            const balData = await balRes.json();
            if (balRes.ok) setBalanceSats(balData.balanceSats);
          }
        }
      } catch {
        // Polling failure, silent retry
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [createdInvoice, invoiceStatus, connectionUri, walletInfo]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* NWC Connection Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-amber-400/20" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span>Nostr Wallet Connect (NWC / NIP-47)</span>
                  <Badge variant="btc">Real Wallet</Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Connect any non-custodial Lightning wallet (Alby Hub, Mutiny, Phoenix, Umbrel)
                </CardDescription>
              </div>
            </div>

            {walletInfo && (
              <Button variant="outline" size="sm" onClick={handleDisconnect} className="text-xs gap-1.5 text-red-400 hover:text-red-300">
                <Unlink className="w-3.5 h-3.5" />
                Disconnect
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {!walletInfo ? (
            <form onSubmit={handleConnect} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>NWC Pairing String (nostr+walletconnect://...)</span>
                </label>
                <input
                  type="password"
                  value={connectionUri}
                  onChange={(e) => setConnectionUri(e.target.value)}
                  placeholder="nostr+walletconnect://pubkey?relay=wss://...&secret=..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-[#1e2230] text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                  disabled={isConnecting}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Held in ephemeral memory only. Never saved in localStorage or sent to AI.
                </p>

                <Button type="submit" disabled={isConnecting || !connectionUri.trim()} size="sm" className="gap-2">
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Connected Wallet Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-[#090a0f] border border-[#1e2230]">
                <div>
                  <span className="text-xs text-neutral-500 uppercase font-semibold">Wallet Alias</span>
                  <div className="text-base font-bold text-neutral-100 mt-0.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{walletInfo.alias || 'NWC Lightning Wallet'}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 font-mono truncate">
                    {walletInfo.pubkey?.slice(0, 16)}...
                  </p>
                </div>

                <div>
                  <span className="text-xs text-neutral-500 uppercase font-semibold">Live Balance</span>
                  <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                    {balanceSats !== null ? `${formatSats(balanceSats)} sats` : 'Unavailable'}
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    {balanceSats !== null ? `≈ ${formatBtc(satsToBtc(balanceSats))} BTC` : ''}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-neutral-500 uppercase font-semibold">Allowed Methods (NIP-47)</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {walletInfo.methods.map((method) => (
                      <span key={method} className="text-[10px] px-2 py-0.5 rounded bg-[#161a26] text-neutral-300 font-mono border border-[#222838]">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Invoice Generation Section */}
              {walletInfo.methods.includes('make_invoice') && (
                <div className="p-4 rounded-xl bg-[#12141c] border border-[#1e2230] space-y-4">
                  <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-amber-400" />
                    <span>Receive via Lightning (Generate Real Invoice)</span>
                  </h4>

                  <form onSubmit={handleCreateInvoice} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-neutral-400">Amount (Satoshis)</label>
                      <input
                        type="number"
                        min="1"
                        value={invoiceAmount}
                        onChange={(e) => setInvoiceAmount(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded-lg bg-[#090a0f] border border-[#1e2230] text-xs font-mono text-neutral-100"
                        placeholder="1000"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-neutral-400">Memo / Description</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          value={invoiceMemo}
                          onChange={(e) => setInvoiceMemo(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-[#090a0f] border border-[#1e2230] text-xs text-neutral-100"
                          placeholder="Payment for goods/service"
                        />
                        <Button type="submit" size="sm" disabled={isCreatingInvoice} className="gap-1.5 shrink-0">
                          {isCreatingInvoice ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
                          Generate Invoice
                        </Button>
                      </div>
                    </div>
                  </form>

                  {/* Render Created Invoice & Polling Status */}
                  {createdInvoice && (
                    <div className="p-3.5 rounded-lg bg-[#090a0f] border border-amber-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-200">
                            Invoice: {formatSats(createdInvoice.amountSats)} sats
                          </span>
                          {invoiceStatus?.settled ? (
                            <Badge variant="success" className="gap-1 text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              PAID & SETTLED
                            </Badge>
                          ) : (
                            <Badge variant="warning" className="gap-1 text-[10px] animate-pulse">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Awaiting Payment...
                            </Badge>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(createdInvoice.invoice)}
                          className="text-xs gap-1 text-neutral-400 hover:text-amber-400"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {isCopied ? 'Copied!' : 'Copy BOLT-11'}
                        </Button>
                      </div>

                      <div className="p-2.5 rounded bg-[#0d0f17] border border-[#1e2230] text-[11px] font-mono text-amber-200/80 break-all select-all">
                        {createdInvoice.invoice}
                      </div>

                      {invoiceStatus?.settled && invoiceStatus.preimage && (
                        <div className="text-[11px] text-emerald-400 font-mono">
                          ✓ Proof of Payment (Preimage): {invoiceStatus.preimage.slice(0, 24)}...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 mt-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
