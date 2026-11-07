import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Bot, Sparkles, Send, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AssistantPage() {
  const suggestedQuestions = [
    'Why is my transaction still unconfirmed?',
    'What is an UTXO and why does it matter?',
    'Why are transaction fees high right now?',
    'Explain the difference between SegWit and Taproot.',
    'What does this transaction input mean?',
    'What is the Lightning Network and when should I use it?',
  ];

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">AI Wallet Assistant</h1>
            <Badge variant="btc">Mistral + Gemini Fallback</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Ask natural language questions about your transactions, script types, fees, and Bitcoin mechanics.
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 bg-[#12141c] p-1 rounded-lg border border-[#1e2230]">
          <span className="text-xs text-neutral-400 px-2 font-medium">Explanation Level:</span>
          <button className="px-3 py-1 rounded-md text-xs font-semibold bg-[#f7931a] text-neutral-950 shadow-sm">
            Beginner
          </button>
          <button className="px-3 py-1 rounded-md text-xs font-medium text-neutral-400 hover:text-neutral-200">
            Professional
          </button>
        </div>
      </div>

      {/* Main Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area (3 cols) */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="py-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#f7931a]/15 text-[#f7931a] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">BTC Copilot Intelligence</CardTitle>
                  <CardDescription className="text-[11px] mt-0">Privacy Gateway Active • Zero credentials transmitted</CardDescription>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">
                <ShieldCheck className="w-3 h-3" />
                <span>Sanitized Context</span>
              </Badge>
            </CardHeader>

            {/* Messages Scroll Area */}
            <CardContent className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Copilot intro message */}
              <div className="flex items-start gap-3 max-w-2xl">
                <div className="w-8 h-8 rounded-lg bg-[#f7931a] text-neutral-950 font-bold flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-[#161a26] border border-[#232736] text-sm text-neutral-200 space-y-2 leading-relaxed">
                  <p className="font-semibold text-neutral-100">
                    Hello! I&apos;m your BTC Copilot.
                  </p>
                  <p>
                    I can explain any Bitcoin transaction, decode script types (Legacy, SegWit, Taproot), explain why a transaction is stuck in the mempool, or walk you through UTXO concepts in clear language.
                  </p>
                  <p className="text-xs text-neutral-400">
                    Target loaded: <span className="font-mono text-[#f7931a]">Satoshi Genesis (1A1zP1...Divfna)</span>
                  </p>
                </div>
              </div>
            </CardContent>

            {/* Chat Input Bar */}
            <div className="p-4 border-t border-[#1e2230] bg-[#0f1118]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about this wallet or any Bitcoin transaction..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#090a0f] border border-[#232736] text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-[#f7931a] focus:ring-1 focus:ring-[#f7931a]/40 transition-colors"
                />
                <Button variant="primary" size="md" className="gap-2 shrink-0">
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: Suggested Questions & Context */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#f7931a]" />
                <span>Suggested Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-2.5 rounded-lg bg-[#0d0f15] hover:bg-[#161a26] border border-[#1e2230] hover:border-[#f7931a]/40 text-xs text-neutral-300 hover:text-neutral-100 transition-all cursor-pointer leading-snug"
                >
                  {q}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card variant="accent">
            <CardHeader>
              <CardTitle className="text-xs font-semibold text-neutral-300">Privacy Gateway</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-neutral-400 space-y-2">
              <p>
                All inputs are automatically sanitized. Addresses are truncated, and private keys or seed phrases are strictly blocked.
              </p>
              <div className="pt-2 border-t border-[#1e2230] text-[11px] text-emerald-400 font-medium">
                ✓ Server-side AI orchestration
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
