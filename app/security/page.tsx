'use client';

import React, { useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  KeyRound, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Search, 
  Info, 
  Calendar, 
  Database,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { checkAddressRisk, type AddressRiskResult } from '@/lib/security/risk-database';

export default function SecurityPage() {
  const { t, language } = useLanguage();
  const [addressInput, setAddressInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<AddressRiskResult | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      const result = checkAddressRisk(addressInput.trim());
      setVerificationResult(result);
      setIsVerifying(false);
    }, 400);
  };

  const setSample = (addr: string) => {
    setAddressInput(addr);
    const result = checkAddressRisk(addr);
    setVerificationResult(result);
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>{t.security.title}</span>
            </h1>
            <Badge variant="success">{t.security.badge}</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            {t.security.subtitle}
          </p>
        </div>
      </div>

      {/* Interactive Anti-Scam Address Verifier */}
      <Card className="border-amber-500/20 bg-gradient-to-b from-[#12141c] to-[#0a0c12]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base">{t.security.riskVerifierTitle}</CardTitle>
                <CardDescription className="text-xs">
                  {t.security.riskVerifierDesc}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder={t.security.verifyInputPlaceholder}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#090a0f] border border-[#1e2230] text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
            <Button type="submit" disabled={isVerifying || !addressInput.trim()} size="sm" className="gap-2">
              {isVerifying ? t.security.verifyingBtn : t.security.verifyBtn}
            </Button>
          </form>

          {/* Quick preset tests for demonstration */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-500">Exemples de test :</span>
            <button
              type="button"
              onClick={() => setSample('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')}
              className="text-[11px] px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/40"
            >
              Twitter Hack (Risque)
            </button>
            <button
              type="button"
              onClick={() => setSample('13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94')}
              className="text-[11px] px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40"
            >
              WannaCry / Legacy (Alerte)
            </button>
            <button
              type="button"
              onClick={() => setSample('bc1qjl4y06z7p7z5v9n3q2t8x7m6k5j4h3g2f1zuqs')}
              className="text-[11px] px-2 py-0.5 rounded bg-sky-950/40 border border-sky-500/30 text-sky-300 hover:bg-sky-900/40"
            >
              SegWit Wallet (Aucun signalement)
            </button>
          </div>

          {/* Verification Results Panel */}
          {verificationResult && (
            <div className={`p-4 rounded-xl border space-y-3 ${
              verificationResult.status === 'risk_identified'
                ? 'bg-red-950/20 border-red-500/40'
                : verificationResult.status === 'warning'
                ? 'bg-amber-950/20 border-amber-500/40'
                : verificationResult.status === 'no_match'
                ? 'bg-sky-950/20 border-sky-500/40'
                : 'bg-neutral-900 border-neutral-700'
            }`}>
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  {verificationResult.status === 'risk_identified' && (
                    <Badge variant="danger" className="text-xs px-2.5 py-1">
                      {t.security.statusRiskIdentified}
                    </Badge>
                  )}
                  {verificationResult.status === 'warning' && (
                    <Badge variant="warning" className="text-xs px-2.5 py-1">
                      {t.security.statusWarning}
                    </Badge>
                  )}
                  {verificationResult.status === 'no_match' && (
                    <Badge variant="btc" className="text-xs px-2.5 py-1">
                      {t.security.statusNoMatch}
                    </Badge>
                  )}
                  {verificationResult.status === 'insufficient_data' && (
                    <Badge variant="outline" className="text-xs px-2.5 py-1">
                      {t.security.statusInsufficient}
                    </Badge>
                  )}
                  <span className="font-mono text-xs text-neutral-300">
                    {verificationResult.address.length > 32 
                      ? `${verificationResult.address.slice(0, 16)}...${verificationResult.address.slice(-12)}`
                      : verificationResult.address}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{t.security.verifiedAtLabel}: {new Date(verificationResult.verifiedAt).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Title & Details */}
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-neutral-100">
                  {language === 'fr' ? verificationResult.title.fr : verificationResult.title.en}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {language === 'fr' ? verificationResult.details.fr : verificationResult.details.en}
                </p>
              </div>

              {/* Sources */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
                <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                  <Database className="w-3 h-3 text-neutral-500" />
                  {t.security.sourceLabel}:
                </span>
                {verificationResult.sources.map((src) => (
                  <span key={src} className="text-[10px] px-2 py-0.5 rounded bg-[#161a26] text-neutral-300 font-mono border border-[#222838]">
                    {src}
                  </span>
                ))}
              </div>

              {/* Non-negotiable Disclaimer */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2 text-[11px] text-amber-200/90 leading-relaxed">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t.security.disclaimer}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="accent">
          <CardContent className="p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-100 text-sm">{t.security.readOnlyTitle}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {t.security.readOnlyDesc}
            </p>
          </CardContent>
        </Card>

        <Card variant="accent">
          <CardContent className="p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-100 text-sm">{t.security.privacyGatewayTitle}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {t.security.privacyGatewayDesc}
            </p>
          </CardContent>
        </Card>

        <Card variant="accent">
          <CardContent className="p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-100 text-sm">{t.security.serverCredsTitle}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {t.security.serverCredsDesc}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Gateway Data Flow Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t.security.matrixTitle}</CardTitle>
          <CardDescription>
            {t.security.matrixDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0f1118] text-xs font-semibold text-neutral-400 border-b border-[#1e2230]">
                <tr>
                  <th className="py-3 px-4">{t.security.thDataElement}</th>
                  <th className="py-3 px-4">{t.security.thGatewayTreatment}</th>
                  <th className="py-3 px-4">{t.security.thTransmitted}</th>
                  <th className="py-3 px-4">{t.security.thSecurityRationale}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2230]/60 text-xs">
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">
                    {language === 'fr' ? 'Clés privées / Mots de seed' : 'Private Keys / Seed Words'}
                  </td>
                  <td className="py-3 px-4 text-rose-400 font-semibold">
                    {language === 'fr' ? 'Blocage strict & Arrêt immédiat' : 'Strict Block & Immediate Abort'}
                  </td>
                  <td className="py-3 px-4"><Badge variant="danger">{t.security.badgeNever}</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">
                    {language === 'fr' ? 'Tolérance zéro pour les informations cryptographiques' : 'Zero tolerance for cryptographic credentials'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">
                    {language === 'fr' ? 'Adresse publique Bitcoin complète' : 'Full Bitcoin Public Address'}
                  </td>
                  <td className="py-3 px-4 text-amber-400">
                    {language === 'fr' ? 'Tronquée (ex: 1A1zP...Divfna)' : 'Truncated (e.g. 1A1zP...Divfna)'}
                  </td>
                  <td className="py-3 px-4"><Badge variant="warning">{t.security.badgeShortened}</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">
                    {language === 'fr' ? 'Empêche le fournisseur externe de corréler l\'historique utilisateur' : 'Prevents external provider from linking user history'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">
                    {language === 'fr' ? 'Identifiants de transaction (txid)' : 'Full Transaction IDs (txid)'}
                  </td>
                  <td className="py-3 px-4 text-amber-400">
                    {language === 'fr' ? 'Identifiant de référence interne (ex: Tx #1)' : 'Internal Reference ID (e.g. Tx #1)'}
                  </td>
                  <td className="py-3 px-4"><Badge variant="warning">{t.security.badgeSanitized}</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">
                    {language === 'fr' ? 'Le modèle a uniquement besoin des montants et de la structure pour expliquer' : 'LLM only needs amount and structure to explain'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">
                    {language === 'fr' ? 'Montants & Frais de transaction' : 'Transaction Amounts & Fees'}
                  </td>
                  <td className="py-3 px-4 text-emerald-400">
                    {language === 'fr' ? 'Résumé numérique agrégé et structuré' : 'Structured numerical summary'}
                  </td>
                  <td className="py-3 px-4"><Badge variant="success">{t.security.badgeYes}</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">
                    {language === 'fr' ? 'Requis pour fournir l\'analyse des frais et des UTXO' : 'Required to provide fee and UTXO analysis'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">
                    {language === 'fr' ? 'Questions / Requêtes utilisateur' : 'User Questions / Prompts'}
                  </td>
                  <td className="py-3 px-4 text-emerald-400">
                    {language === 'fr' ? 'Longueur plafonnée, nettoyage anti-injection' : 'Length capped, injection scrubbed'}
                  </td>
                  <td className="py-3 px-4"><Badge variant="success">{t.security.badgeYes}</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">
                    {language === 'fr' ? 'Protection contre le jailbreak et le contournement de consignes' : 'Protected against prompt injection and jailbreaks'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
