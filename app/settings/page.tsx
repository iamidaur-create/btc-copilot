import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Settings, Sliders, Database, Cpu, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <Settings className="w-6 h-6 text-neutral-400" />
              <span>Platform Settings</span>
            </h1>
            <Badge variant="outline">Config</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Configure monitoring thresholds, AI fallback priorities, and target wallet defaults.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-2 text-neutral-400">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet & Demo Mode */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#f7931a]" />
              <span>Wallet Configuration</span>
            </CardTitle>
            <CardDescription>Manage active wallet address and demonstration mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#090a0f] border border-[#1e2230]">
              <div>
                <span className="font-semibold text-neutral-200">Demonstration Mode</span>
                <p className="text-neutral-400 mt-0.5">Pre-load Satoshi Genesis address for hackathon judging</p>
              </div>
              <Badge variant="btc">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#090a0f] border border-[#1e2230]">
              <div>
                <span className="font-semibold text-neutral-200">Storage Backend</span>
                <p className="text-neutral-400 mt-0.5">Client-side localStorage (Supabase deferred)</p>
              </div>
              <Badge variant="outline">localStorage</Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Provider Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>AI Provider Orchestration</span>
            </CardTitle>
            <CardDescription>Dual-provider failover and temperature controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#090a0f] border border-[#1e2230]">
              <div>
                <span className="font-semibold text-neutral-200">Primary Provider</span>
                <p className="text-neutral-400 mt-0.5">Mistral AI (codestral / mistral-large)</p>
              </div>
              <Badge variant="btc">Default</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#090a0f] border border-[#1e2230]">
              <div>
                <span className="font-semibold text-neutral-200">Automatic Fallback</span>
                <p className="text-neutral-400 mt-0.5">Google Gemini (gemini-2.5-flash / gemini-1.5-pro)</p>
              </div>
              <Badge variant="info">Standby</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
