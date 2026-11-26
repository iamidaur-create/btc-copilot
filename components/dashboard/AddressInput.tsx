'use client';

/**
 * AddressInput Component
 *
 * This is the main wallet address input box shown on the Dashboard.
 *
 * What it does:
 * - Lets the user type or paste a Bitcoin address
 * - Validates the address in real-time (without hitting any API)
 * - Shows a green ✓ for valid addresses, red ✗ for invalid ones
 * - Has a "Load Demo Wallet" button (pre-fills the Satoshi Genesis address)
 * - Calls onAddressSubmit() when the user submits a valid address
 *
 * 'use client' means this component runs in the browser (it has state and input handling).
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Search, Zap, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { validateBitcoinAddress } from '@/lib/bitcoin/validate-address';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// The Satoshi Genesis Block address — used for demonstration
const DEMO_ADDRESS = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

interface AddressInputProps {
  /** Called when the user submits a valid address */
  onAddressSubmit: (address: string) => void;
  /** True while the parent is loading wallet data */
  isLoading?: boolean;
  /** The currently active address (to show in input on mount) */
  currentAddress?: string;
}

export function AddressInput({ onAddressSubmit, isLoading = false, currentAddress = '' }: AddressInputProps) {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState(currentAddress);

  // Synchronize input value whenever currentAddress changes (e.g. demo wallet loaded)
  useEffect(() => {
    if (currentAddress) {
      setInputValue(currentAddress);
    }
  }, [currentAddress]);

  // Validate the current input value (runs every keystroke — fast, no API)
  const validation = inputValue.trim() ? validateBitcoinAddress(inputValue.trim()) : null;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      const result = validateBitcoinAddress(trimmed);
      if (result.isValid) {
        onAddressSubmit(result.address);
      }
    },
    [inputValue, onAddressSubmit]
  );

  const loadDemo = useCallback(() => {
    setInputValue(DEMO_ADDRESS);
    onAddressSubmit(DEMO_ADDRESS);
  }, [onAddressSubmit]);

  // Choose border color based on validation state
  const borderColor =
    !validation
      ? 'border-[#1e2230]'
      : validation.isValid
      ? 'border-green-500/50'
      : 'border-red-500/40';

  return (
    <div className="space-y-3">
      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className={`flex-1 flex items-center gap-2 bg-[#12141c] border ${borderColor} rounded-xl px-4 py-3 transition-colors`}>
          {/* Icon — changes based on validation */}
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-[#f7931a] animate-spin shrink-0" />
          ) : validation?.isValid ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
          ) : validation && !validation.isValid ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          )}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.dashboard.inputPlaceholder}
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-600 outline-none font-mono"
            spellCheck={false}
            autoComplete="off"
            disabled={isLoading}
          />

          {/* Address type badge — shows when valid */}
          {validation?.isValid && (
            <span className="text-xs text-[#f7931a] font-semibold uppercase tracking-wide shrink-0">
              {validation.type}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || !validation?.isValid}
          className="shrink-0"
        >
          {isLoading ? t.dashboard.loadingBtn : t.dashboard.analyzeBtn}
        </Button>
      </form>

      {/* Validation message */}
      {validation && !validation.isValid && (
        <p className="text-xs text-red-400 pl-1 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />
          {validation.error}
        </p>
      )}

      {/* Demo personas shortcut (Fatou, Moussa, Cheikh) */}
      <div className="pt-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 bg-[#1e2230]" />
          <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
            {t.dashboard.loadDemo} / Profils Démo
          </span>
          <div className="h-px flex-1 bg-[#1e2230]" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              const addr = 'bc1qzg00x6y3s6j3w798lese4aklk5xe3xed5hzk9n';
              setInputValue(addr);
              onAddressSubmit(addr);
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12141c] hover:bg-[#181b24] text-neutral-200 border border-[#1e2230] hover:border-emerald-500/40 text-xs transition-colors disabled:opacity-50"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-semibold text-neutral-100">Fatou</span>
            <span className="text-[10px] text-neutral-400">Épargne & Découverte</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const addr = '13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94';
              setInputValue(addr);
              onAddressSubmit(addr);
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12141c] hover:bg-[#181b24] text-neutral-200 border border-[#1e2230] hover:border-amber-500/40 text-xs transition-colors disabled:opacity-50"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="font-semibold text-neutral-100">Moussa</span>
            <span className="text-[10px] text-neutral-400">Alerte Dust & Risque</span>
          </button>

          <a
            href="/lightning"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12141c] hover:bg-[#181b24] text-neutral-200 border border-[#1e2230] hover:border-sky-500/40 text-xs transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="font-semibold text-neutral-100">Cheikh</span>
            <span className="text-[10px] text-neutral-400">Lightning NWC</span>
          </a>
        </div>
      </div>
    </div>
  );
}
