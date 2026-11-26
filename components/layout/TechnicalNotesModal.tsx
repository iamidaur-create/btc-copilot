'use client';

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export function TechnicalNotesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gemini' | 'cheikh'>('gemini');

  return (
    <div className="fixed bottom-5 left-5 z-40 font-sans">
      {/* Trigger Button - Minimalist and Clean */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0f1117] border border-[#1e2230] text-xs text-neutral-400 hover:text-neutral-200 hover:border-[#2d3448] transition-colors shadow-sm"
          title="Consulter les notes techniques"
        >
          <Info className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-medium tracking-tight">Notes techniques de démo</span>
        </button>
      )}

      {/* Detail Popover / Modal */}
      {isOpen && (
        <div className="w-80 sm:w-96 rounded-xl bg-[#0f1117] border border-[#1e2230] shadow-xl p-4 text-xs space-y-3.5">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#1a1e2b]">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-200">Notes techniques de démo</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-neutral-300 transition-colors p-1"
              aria-label="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 p-1 rounded-lg bg-[#090a0f] border border-[#1a1e2b]">
            <button
              type="button"
              onClick={() => setActiveTab('gemini')}
              className={`flex-1 py-1.5 text-center rounded-md font-medium transition-colors ${
                activeTab === 'gemini'
                  ? 'bg-[#181b24] text-neutral-100 border border-[#262c3d]'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Serveurs Gemini
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cheikh')}
              className={`flex-1 py-1.5 text-center rounded-md font-medium transition-colors ${
                activeTab === 'cheikh'
                  ? 'bg-[#181b24] text-neutral-100 border border-[#262c3d]'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Nœud de Cheikh
            </button>
          </div>

          {/* Tab 1 Content: Google Gemini */}
          {activeTab === 'gemini' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-100">
                  Serveurs Google Gemini & Mode Secours
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                  Bascule automatique active
                </span>
              </div>
              <p className="text-neutral-300 leading-relaxed text-[11px]">
                Si l&apos;IA marque un temps de latence ou utilise des réponses concises, cela est dû à une surcharge temporaire des serveurs Google Gemini (Code 503). Dans ce cas, BTC Copilot engage automatiquement son moteur de secours local autonome pour garantir une réponse sans interruption.
              </p>
            </div>
          )}

          {/* Tab 2 Content: Cheikh Node */}
          {activeTab === 'cheikh' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-100">
                  Pourquoi le nœud démo de Cheikh ne génère-t-il pas de facture réelle ?
                </span>
              </div>
              <p className="text-neutral-300 leading-relaxed text-[11px]">
                Le profil démo de Cheikh est un nœud de simulation public sécurisé. Par principe absolu de non-custodialité et de sécurité, aucune clé de signature privée n&apos;est exposée sur un serveur public. Pour créer et payer de véritables factures sur le Mainnet, l&apos;utilisateur doit connecter son propre wallet via son secret Nostr Wallet Connect (NIP-47).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
