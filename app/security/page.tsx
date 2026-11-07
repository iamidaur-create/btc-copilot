import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock, Eye, KeyRound, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function SecurityPage() {
  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>Security Center & Privacy Gateway</span>
            </h1>
            <Badge variant="success">Read-Only Guard</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Zero private key handling, strict server-side credentials, and an active privacy boundary.
          </p>
        </div>
      </div>

      {/* Security Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="accent">
          <CardContent className="p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-100 text-sm">100% Read-Only Guarantee</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              BTC Copilot never requests, stores, or processes private keys, seed phrases, or wallet passwords. Transactions cannot be broadcast or signed.
            </p>
          </CardContent>
        </Card>

        <Card variant="accent">
          <CardContent className="p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-100 text-sm">Privacy Gateway Boundary</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Public addresses and transaction IDs are truncated before AI calls. Financial metrics are aggregated to minimize linkability.
            </p>
          </CardContent>
        </Card>

        <Card variant="accent">
          <CardContent className="p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-neutral-100 text-sm">Isolated Server Credentials</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Mistral and Gemini API keys reside exclusively in server-side environment variables. Zero secrets are ever delivered to the browser bundle.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Gateway Data Flow Table */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Gateway Data Sanitization Matrix</CardTitle>
          <CardDescription>
            Audit log of what information is shared with external AI providers versus what is blocked
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0f1118] text-xs font-semibold text-neutral-400 border-b border-[#1e2230]">
                <tr>
                  <th className="py-3 px-4">Data Element</th>
                  <th className="py-3 px-4">Gateway Treatment</th>
                  <th className="py-3 px-4">Transmitted to AI?</th>
                  <th className="py-3 px-4">Security Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2230]/60 text-xs">
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">Private Keys / Seed Words</td>
                  <td className="py-3 px-4 text-rose-400 font-semibold">Strict Block & Immediate Abort</td>
                  <td className="py-3 px-4"><Badge variant="danger">NEVER</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">Zero tolerance for cryptographic credentials</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">Full Bitcoin Public Address</td>
                  <td className="py-3 px-4 text-amber-400">Truncated (e.g. 1A1zP...Divfna)</td>
                  <td className="py-3 px-4"><Badge variant="warning">Shortened Only</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">Prevents external provider from linking user history</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">Full Transaction IDs (txid)</td>
                  <td className="py-3 px-4 text-amber-400">Internal Reference ID (e.g. Tx #1)</td>
                  <td className="py-3 px-4"><Badge variant="warning">Sanitized Ref</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">LLM only needs amount and structure to explain</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">Transaction Amounts & Fees</td>
                  <td className="py-3 px-4 text-emerald-400">Structured numerical summary</td>
                  <td className="py-3 px-4"><Badge variant="success">Yes (Sanitized)</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">Required to provide fee and UTXO analysis</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-neutral-200">User Questions / Prompts</td>
                  <td className="py-3 px-4 text-emerald-400">Length capped, injection scrubbed</td>
                  <td className="py-3 px-4"><Badge variant="success">Yes (Scrubbed)</Badge></td>
                  <td className="py-3 px-4 text-neutral-400">Protected against prompt injection and jailbreaks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
