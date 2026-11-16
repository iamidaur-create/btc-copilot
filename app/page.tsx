'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  ShieldCheck, 
  Bot, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Eye, 
  Lock, 
  Layers, 
  Globe, 
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LandingPage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const isFr = language === 'fr';

  const selectPersona = (address: string, path = '/dashboard') => {
    try {
      sessionStorage.setItem('btc-copilot-context', JSON.stringify({ walletAddress: address }));
    } catch {}
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-neutral-100 flex flex-col font-sans selection:bg-[#f7931a]/30">
      {/* Top Navbar */}
      <header className="border-b border-[#1a1e2b] bg-[#0c0e15]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f7931a] to-[#d67b0c] flex items-center justify-center shadow-lg shadow-[#f7931a]/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                BTC Copilot
                <Badge variant="btc" className="text-[10px] py-0 px-1.5">Hackathon Edition</Badge>
              </span>
              <p className="text-[10px] text-neutral-400 -mt-0.5">Zafy × CryptPilot Alliance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language switch */}
            <button
              onClick={() => setLanguage(isFr ? 'en' : 'fr')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#232736] bg-[#12141c] hover:border-amber-400/50 text-neutral-300 transition-colors"
            >
              {isFr ? '🇬🇧 English' : '🇫🇷 Français'}
            </button>

            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5 shadow-md shadow-[#f7931a]/15">
                <span>{isFr ? "Lancer l'App" : "Launch App"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#1a1e2b]">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f7931a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181b26] border border-[#2a2f42] text-xs text-amber-300/90 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#f7931a]" />
            <span>{isFr ? "Copilote Intelligent Bitcoin, Lightning & Sécurité" : "Intelligent Bitcoin, Lightning & Security Copilot"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            {isFr ? (
              <>
                Comprenez et protégez vos <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7931a] via-[#ffaa40] to-[#ffa029]">
                  fonds Bitcoin en toute sérénité
                </span>
              </>
            ) : (
              <>
                Understand and safeguard your <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7931a] via-[#ffaa40] to-[#ffa029]">
                  Bitcoin wealth with confidence
                </span>
              </>
            )}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {isFr
              ? "La fusion entre la simplicité de Zafy (wallet accessible, protection anti-arnaque, Lightning NWC) et la puissance analytique de CryptPilot (explications IA factuelles, détection d'anomalies adaptative et respect total de la vie privée)."
              : "Combining the simplicity of Zafy (accessible wallet, anti-scam guardian, Lightning NWC) with the analytic depth of CryptPilot (factual AI explanations, adaptive anomaly detection, and strict zero-knowledge privacy)."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 px-6 shadow-xl shadow-[#f7931a]/20">
                <span>{isFr ? "Ouvrir le Tableau de Bord" : "Open Dashboard"}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#scenarios" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-neutral-300">
                <span>{isFr ? "Essayer les Profils Démo" : "Try Demo Profiles"}</span>
              </Button>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 border-t border-[#1a1e2b]/80 pt-6">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Read-Only (Zéro Seed Phrase)</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-sky-400" /> No-KYC & Confidentialité Absolue</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Lightning NWC (NIP-47) Réel</span>
          </div>
        </div>
      </section>

      {/* Demo Personas Section (Fatou, Moussa, Cheikh) */}
      <section id="scenarios" className="py-16 bg-[#0c0e15] border-b border-[#1a1e2b]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="btc" className="mb-2">
              {isFr ? "Démonstration Immédiate" : "Instant Demo"}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isFr ? "3 Scénarios Réels à Tester en 1 Clic" : "3 Real-World Scenarios in 1 Click"}
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              {isFr
                ? "Choisissez l'un des trois profils pour lancer instantanément une simulation guidée sans avoir à chercher d'adresse."
                : "Select one of the three personas to launch an instant guided simulation without needing to search for addresses."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Persona 1: Fatou */}
            <div className="rounded-2xl bg-[#12141c] border border-[#1e2230] hover:border-emerald-500/40 transition-all p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  🟢
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <span>Fatou</span>
                    <Badge variant="success" className="text-[10px]">Découverte & Épargne</Badge>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isFr 
                      ? "Commerçante à Dakar, Fatou accumule de petites économies en satoshis et découvre le fonctionnement du réseau."
                      : "Dakar merchant accumulating savings in sats and exploring Bitcoin with beginner-friendly guidance."}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#090a0f] border border-[#1e2230] text-xs font-mono space-y-1">
                  <div className="text-neutral-500 text-[10px]">FORMAT & SOLDE</div>
                  <div className="text-neutral-200">Native SegWit (bc1q...)</div>
                  <div className="text-amber-400 font-semibold">60 000 sats (~0.00060 BTC)</div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => selectPersona('bc1qzg00x6y3s6j3w798lese4aklk5xe3xed5hzk9n')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{isFr ? "Lancer le Profil de Fatou" : "Launch Fatou's Profile"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Persona 2: Moussa */}
            <div className="rounded-2xl bg-[#12141c] border border-[#1e2230] hover:border-amber-500/40 transition-all p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
                  🟠
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <span>Moussa</span>
                    <Badge variant="warning" className="text-[10px]">Alerte Sécurité & Dust</Badge>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isFr 
                      ? "Moussa reçoit des transferts de l'étranger. Son adresse subit une tentative de Dust Attack que le copilote intercepte."
                      : "Receiving remittances, Moussa's wallet experiences an incoming dust attack flagged by the copilot."}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#090a0f] border border-[#1e2230] text-xs font-mono space-y-1">
                  <div className="text-neutral-500 text-[10px]">FORMAT & ALERTE</div>
                  <div className="text-neutral-200">Format Legacy (13AM4...)</div>
                  <div className="text-red-400 font-semibold">Attaque Dust (&lt; 546 sats détectée)</div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => selectPersona('13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94', '/monitoring')}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{isFr ? "Lancer l'Alerte de Moussa" : "Inspect Moussa's Alert"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Persona 3: Cheikh */}
            <div className="rounded-2xl bg-[#12141c] border border-[#1e2230] hover:border-sky-500/40 transition-all p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-lg">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <span>Cheikh</span>
                    <Badge variant="btc" className="text-[10px]">Micropaiements NWC</Badge>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isFr 
                      ? "Cheikh utilise Lightning pour des encaissements instantanés et génère des factures BOLT-11 sans frais intermédiaires."
                      : "Cheikh runs micro-transactions on Lightning via Nostr Wallet Connect, settling invoices in milliseconds."}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#090a0f] border border-[#1e2230] text-xs font-mono space-y-1">
                  <div className="text-neutral-500 text-[10px]">PROTOCOLE & CAPACITÉ</div>
                  <div className="text-neutral-200">NIP-47 (Nostr Wallet Connect)</div>
                  <div className="text-sky-400 font-semibold">Nœud Phoenix / ACINQ Hub</div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/lightning')}
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{isFr ? "Explorer le Hub de Cheikh" : "Explore Cheikh's Hub"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-16 border-b border-[#1a1e2b]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isFr ? "Les 4 Piliers Fondateurs" : "The 4 Core Pillars"}
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              {isFr
                ? "L'architecture technique pensée pour allier la rigueur cryptographique et la simplicité grand public."
                : "Technical architecture designed to combine cryptographic rigor with mainstream accessibility."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-neutral-100 text-sm">A. Smart Wallet</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? "Lecture seule on-chain et intégration NWC réelle. Zéro stockage de secret, No-KYC et respect strict de l'autonomie financière."
                  : "Read-only on-chain telemetry and real NWC integration. Zero stored secrets, No-KYC, and true financial sovereignty."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-neutral-100 text-sm">B. AI Intelligence</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? "Explications factuelles sans métaphores enfantines. Orchestration duale Mistral & Gemini pour décoder la mempool et les UTXO."
                  : "Factual explanations without childish metaphors. Dual Mistral & Gemini orchestration to decode mempool and UTXOs."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-neutral-100 text-sm">C. Security Guardian</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? "Vérification d'adresses avec 4 statuts explicites (CryptoScamDB, OFAC), et détection d'anomalies adaptative au solde."
                  : "Address risk validation across 4 explicit statuses, coupled with balance-adaptive anomaly detection."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-neutral-100 text-sm">D. Lightning Speed</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? "Canaux de paiement Layer 2, génération de factures BOLT-11 réelles et surveillance des capacités du réseau en direct."
                  : "Layer 2 payment channels, live BOLT-11 invoice generation, and real-time network telemetry."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[#090a0f] border-t border-[#1a1e2b] text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-300">BTC Copilot</span>
            <span>• Hackathon MVP • Dakar & International</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
              {isFr ? "Tableau de Bord" : "Dashboard"}
            </Link>
            <Link href="/security" className="hover:text-amber-400 transition-colors">
              {isFr ? "Sécurité" : "Security"}
            </Link>
            <Link href="/lightning" className="hover:text-amber-400 transition-colors">
              Lightning
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
