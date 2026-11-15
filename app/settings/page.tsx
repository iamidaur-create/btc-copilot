'use client';

import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Settings, Sliders, Database, Cpu, RotateCcw, Globe, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <Settings className="w-6 h-6 text-neutral-400" />
              <span>{t.settings.title}</span>
            </h1>
            <Badge variant="outline">Config</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            {t.settings.subtitle}
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2 text-neutral-400">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.settings.resetDefaults}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Selection Card */}
        <Card className="border-amber-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{t.settings.languageTitle}</span>
            </CardTitle>
            <CardDescription>{t.settings.languageDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${
                  language === 'fr'
                    ? 'bg-amber-500/10 border-amber-500/40 text-neutral-100'
                    : 'bg-[#090a0f] border-[#1e2230] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs flex items-center gap-1.5">
                    <span>🇫🇷 Français</span>
                  </div>
                  <span className="text-[11px] text-neutral-500">Par défaut</span>
                </div>
                {language === 'fr' && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${
                  language === 'en'
                    ? 'bg-amber-500/10 border-amber-500/40 text-neutral-100'
                    : 'bg-[#090a0f] border-[#1e2230] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs flex items-center gap-1.5">
                    <span>🇬🇧 English</span>
                  </div>
                  <span className="text-[11px] text-neutral-500">International</span>
                </div>
                {language === 'en' && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet & Demo Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#f7931a]" />
              <span>{t.settings.walletConfigTitle}</span>
            </CardTitle>
            <CardDescription>{t.settings.walletConfigDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#090a0f] border border-[#1e2230]">
              <div>
                <span className="font-semibold text-neutral-200">{t.settings.demoModeLabel}</span>
                <p className="text-neutral-400 mt-0.5">{t.settings.demoModeDesc}</p>
              </div>
              <Badge variant="btc">{t.settings.badgeActive}</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#090a0f] border border-[#1e2230]">
              <div>
                <span className="font-semibold text-neutral-200">{t.settings.storageBackendLabel}</span>
                <p className="text-neutral-400 mt-0.5">{t.settings.storageBackendDesc}</p>
              </div>
              <Badge variant="outline">localStorage</Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Provider Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>{t.settings.aiOrchestrationTitle}</span>
            </CardTitle>
            <CardDescription>{t.settings.aiOrchestrationDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#090a0f] border border-[#1e2230]">
                <div>
                  <span className="font-semibold text-neutral-200">{t.settings.primaryProviderLabel}</span>
                  <p className="text-neutral-400 mt-0.5">{t.settings.primaryProviderDesc}</p>
                </div>
                <Badge variant="btc">{t.settings.badgeDefault}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#090a0f] border border-[#1e2230]">
                <div>
                  <span className="font-semibold text-neutral-200">{t.settings.fallbackProviderLabel}</span>
                  <p className="text-neutral-400 mt-0.5">{t.settings.fallbackProviderDesc}</p>
                </div>
                <Badge variant="info">{t.settings.badgeStandby}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
