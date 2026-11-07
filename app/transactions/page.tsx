import React from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowDownLeft, ArrowUpRight, Filter, Download, ExternalLink, Bot } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Transaction History</h1>
            <Badge variant="btc">On-Chain</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Confirmed and pending blockchain transactions with AI explainer shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </Button>
          <Button variant="secondary" size="sm" className="gap-2">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Transaction Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Target: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa (Satoshi Genesis)</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Confirmed (4,900+)</Badge>
            <Badge variant="outline">Unconfirmed (0)</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0f1118] text-xs font-semibold text-neutral-400 border-b border-[#1e2230]">
                <tr>
                  <th className="py-3 px-4">Direction</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2230]/60">
                <tr className="hover:bg-[#151822] transition-colors">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <ArrowDownLeft className="w-4 h-4" />
                      <span>Incoming</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-neutral-300">
                    4a5e1e4baab89f3a...b411
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-emerald-400">
                    +0.00010000 BTC
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success" className="text-[10px]">Confirmed (Block 878,214)</Badge>
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-400">
                    Nov 4, 2026, 14:22
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs text-[#f7931a]">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Explain</span>
                    </Button>
                  </td>
                </tr>

                <tr className="hover:bg-[#151822] transition-colors">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <ArrowDownLeft className="w-4 h-4" />
                      <span>Incoming</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-neutral-300">
                    e3b0c44298fc1c14...9afb
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-emerald-400">
                    +0.00054600 BTC
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="success" className="text-[10px]">Confirmed (Block 877,912)</Badge>
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-400">
                    Nov 3, 2026, 09:14
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs text-[#f7931a]">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Explain</span>
                    </Button>
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
