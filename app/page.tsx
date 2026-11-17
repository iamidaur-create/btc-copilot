'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  ShieldCheck, 
  Bot, 
  ArrowRight, 
  Lock, 
  Search, 
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  Layers,
  ChevronRight,
  Database,
  CheckCircle2
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
                <Badge variant="btc" className="text-[10px] py-0 px-1.5">Hackathon MVP</Badge>
              </span>
              <p className="text-[10px] text-neutral-400 -mt-0.5">
                {isFr ? 'Sécurité & Intelligence Bitcoin' : 'Bitcoin Security & Intelligence'}
              </p>
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
                <span>{isFr ? 'Lancer l’Analyse' : 'Launch App'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-[#1a1e2b]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f7931a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181b26] border border-[#2a2f42] text-xs text-amber-300/90 mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f7931a]" />
            <span>{isFr ? 'Plateforme d’Observation & Protection Bitcoin' : 'Bitcoin Observation & Protection Platform'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            {isFr ? (
              <>
                Comprenez chaque transaction. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7931a] via-[#ffaa40] to-[#ffa029]">
                  Sécurisez chaque transfert Bitcoin.
                </span>
              </>
            ) : (
              <>
                Understand every transaction. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7931a] via-[#ffaa40] to-[#ffa029]">
                  Secure every Bitcoin transfer.
                </span>
              </>
            )}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {isFr
              ? 'Une plateforme d’intelligence qui analyse vos adresses publiques, détecte les anomalies de sécurité et vous explique la blockchain en langage clair — sans jamais demander vos clés privées.'
              : 'An intelligence platform analyzing public addresses, detecting security anomalies, and translating blockchain metrics into plain human language — without ever asking for your private keys.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 px-6 shadow-xl shadow-[#f7931a]/20">
                <span>{isFr ? 'Analyser un Portefeuille' : 'Analyze a Wallet'}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#scenarios" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-neutral-300">
                <span>{isFr ? 'Tester les Profils Démo' : 'Explore Demo Profiles'}</span>
              </Button>
            </a>
          </div>

          {/* Core Trust Guarantees */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 border-t border-[#1a1e2b]/80 pt-6">
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-400" /> 100% Observation (Zéro Clé Privée)</span>
            <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-sky-400" /> Bases de Risques & Sanctions Actives</span>
            <span className="flex items-center gap-1.5"><Bot className="w-4 h-4 text-purple-400" /> IA Factuelle Connectée à la Blockchain</span>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 bg-[#0c0e15] border-b border-[#1a1e2b]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="text-xs mb-2">
              {isFr ? 'Le Constat' : 'The Challenge'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isFr ? 'Pourquoi l’utilisation de Bitcoin reste complexe et anxiogène' : 'Why using Bitcoin remains complex and intimidating'}
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              {isFr
                ? 'L’adoption progresse rapidement, notamment sur les marchés émergents et en Afrique, mais le manque d’outils clairs expose les utilisateurs à des erreurs coûteuses.'
                : 'Adoption is accelerating worldwide, especially in emerging markets, yet users face technical opacity and costly mistakes.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-neutral-100 text-sm">
                {isFr ? 'Frais inattendus & transactions bloquées' : 'Unpredictable fees & stuck transactions'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? 'Des utilisateurs paient parfois 20% à 30% du montant envoyé en frais de minage sans comprendre le mécanisme du mempool et des vBytes.'
                  : 'Users often overpay fees significantly or get transactions stuck for days due to opaque mempool mechanics and vByte pricing.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-neutral-100 text-sm">
                {isFr ? 'Attaques de traçage & adresses suspectes' : 'Dust attacks & address risks'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? 'Réception de micro-satoshis (Dust Attacks) pour lier des identités, formats d’adresses obsolètes et faux destinataires : vérifier avant d’envoyer est devenu essentiel.'
                  : 'Unsolicited dust transactions used for address clustering, legacy formats, and scam addresses require real-time verification before sending.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-neutral-100 text-sm">
                {isFr ? 'Jargon technique inaccessible' : 'Intimidating technical jargon'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? 'UTXO, ScriptPubKey, SegWit, confirmations... Les explorateurs de blocs actuels sont pensés pour des développeurs, pas pour des utilisateurs quotidiens.'
                  : 'UTXOs, ScriptPubKeys, fee rates, and block confirmations leave everyday users stranded without accessible, plain-language guidance.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (3 steps) */}
      <section className="py-16 border-b border-[#1a1e2b]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isFr ? 'Comment fonctionne BTC Copilot' : 'How BTC Copilot Works'}
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              {isFr ? 'Une architecture pensée pour la transparence et la simplicité.' : 'Built for transparency, simplicity, and non-custodial safety.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400">01. OBSERVATION</span>
              <h3 className="font-bold text-neutral-100 text-sm">
                {isFr ? 'Saisissez une adresse publique' : 'Enter a public address'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? 'Analysez votre propre portefeuille pour suivre son solde ou vérifiez l’adresse d’un tiers avant d’effectuer un transfert.'
                  : 'Analyze your own wallet telemetry or inspect a recipient address prior to sending funds.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400">02. AUDIT DE SÉCURITÉ</span>
              <h3 className="font-bold text-neutral-100 text-sm">
                {isFr ? 'Détection instantanée des risques' : 'Instant threat analysis'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? 'Le moteur compare l’adresse aux registres connus (CryptoScamDB, OFAC) et audite les anomalies statistiques (dust attacks, vidages rapides).'
                  : 'Deterministic engine scans verified risk databases and highlights volume anomalies, dust clustering, or rapid outflows.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2">
              <span className="text-xs font-mono font-bold text-purple-400">03. ASSISTANCE IA</span>
              <h3 className="font-bold text-neutral-100 text-sm">
                {isFr ? 'Explications en langage naturel' : 'AI-powered explanations'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? 'Posez vos questions à l’assistant : il explique la confirmation de vos fonds, les frais payés et les précautions à prendre.'
                  : 'Ask anything about your funds: the assistant explains transaction confirmations, fees paid, and best safety practices.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Personas Section (Fatou, Moussa, Cheikh) */}
      <section id="scenarios" className="py-16 bg-[#0c0e15] border-b border-[#1a1e2b]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="btc" className="mb-2">
              {isFr ? 'Démonstration Immédiate' : 'Instant Demo'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isFr ? '3 Profils Types à Tester en 1 Clic' : '3 Real Scenarios in 1 Click'}
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              {isFr
                ? 'Lancez directement une simulation guidée sans avoir à chercher manuellement une adresse Bitcoin.'
                : 'Launch a pre-configured guided scenario without having to manually lookup Bitcoin addresses.'}
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
                    <Badge variant="success" className="text-[10px]">{isFr ? 'Découverte & Épargne' : 'Savings & Onboarding'}</Badge>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isFr 
                      ? 'Fatou épargne en satoshis sur une adresse SegWit moderne. L’IA lui explique son premier paiement de 60 000 sats en toute clarté.'
                      : 'Fatou saves in satoshis on a modern SegWit address. The AI explains her first 60,000 sats transfer clearly.'}
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
                  <span>{isFr ? 'Lancer le Profil de Fatou' : 'Launch Fatou’s Profile'}</span>
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
                    <Badge variant="warning" className="text-[10px]">{isFr ? 'Alerte Risque & Dust' : 'Dust Risk Alert'}</Badge>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isFr 
                      ? 'Destinataire d’un transfert de fonds, son adresse reçoit une attaque dust (< 546 sats) que le copilote intercepte pour protéger son identité.'
                      : 'Receiving transfers, Moussa’s legacy address gets flagged for incoming dust tracing (< 546 sats) to protect his privacy.'}
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
                  <span>{isFr ? 'Voir l’Alerte de Moussa' : 'Inspect Moussa’s Alert'}</span>
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
                    <Badge variant="btc" className="text-[10px]">{isFr ? 'Comprendre Lightning' : 'Lightning Intelligence'}</Badge>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {isFr 
                      ? 'Cheikh compare les frais on-chain avec le Lightning Network pour réaliser des règlements instantanés à 1 satoshi.'
                      : 'Cheikh compares mainnet fee congestion with the Lightning Network for sub-second, 1-sat settlement.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#090a0f] border border-[#1e2230] text-xs font-mono space-y-1">
                  <div className="text-neutral-500 text-[10px]">LAYER 2 & RAPIDITÉ</div>
                  <div className="text-neutral-200">Règlement en 1 seconde</div>
                  <div className="text-sky-400 font-semibold">Frais fixes : 1 satoshi (&lt; 0.001 €)</div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/lightning')}
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{isFr ? 'Explorer Lightning' : 'Explore Lightning'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="py-16 border-b border-[#1a1e2b]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isFr ? 'Les 3 Piliers de BTC Copilot' : 'The 3 Pillars of BTC Copilot'}
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              {isFr
                ? 'Une approche intégrée combinant sécurité, pédagogie et intelligence artificielle.'
                : 'An integrated framework uniting security, education, and artificial intelligence.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-100 text-base">1. Sécurité & Risques</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? 'Audit des adresses selon 4 statuts explicites (identifié, avertissement, aucun signalement, insuffisant). Détection des comportements de vidage et des poussières de traçage.'
                  : 'Address risk auditing across 4 explicit statuses (flagged, warning, clean, insufficient). Real-time detection of wallet drain patterns and dust tracking.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-100 text-base">2. Compréhension Intuitive</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? 'Rendre Bitcoin accessible aux débutants sans infantiliser. Explication immédiate des frais sat/vB, de l’état de la mempool et de la confirmation des paiements.'
                  : 'Making Bitcoin accessible to newcomers with dignified clarity. Instant explanation of fee rates, mempool congestion, and confirmations.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141c] border border-[#1e2230] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-100 text-base">3. Intelligence IA Contrôlée</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isFr
                  ? 'Un assistant branché aux données réelles de votre portefeuille, protégé par une passerelle de confidentialité stricte. L’IA n’invente rien et ne manipule aucun secret.'
                  : 'An AI assistant anchored directly into verified on-chain telemetry, guarded by a strict privacy boundary that blocks private credentials.'}
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
            <span>• Hackathon MVP • Sécurité & Intelligence Bitcoin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-amber-400 transition-colors">
              {isFr ? 'Tableau de Bord' : 'Dashboard'}
            </Link>
            <Link href="/monitoring" className="hover:text-amber-400 transition-colors">
              {isFr ? 'Surveillance' : 'Monitoring'}
            </Link>
            <Link href="/security" className="hover:text-amber-400 transition-colors">
              {isFr ? 'Sécurité' : 'Security'}
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
