'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Bot, Sparkles, Send, ShieldCheck, HelpCircle, AlertCircle, Loader2, Cpu } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: 'gemini' | 'local';
  isError?: boolean;
}

type UserLevel = 'beginner' | 'professional';

interface WalletContext {
  walletAddress?: string;
  balance?: number;
  transactions?: {
    txid: string;
    value: number;
    timestamp: number;
    type: 'incoming' | 'outgoing';
    confirmed: boolean;
  }[];
  feeRate?: number;
  lightningBalance?: number;
}

// ─── Suggested questions per level (French by default) ────────────────────────
const SUGGESTED_QUESTIONS: Record<UserLevel, string[]> = {
  beginner: [
    'Quel est mon solde actuel ?',
    'Pourquoi ma transaction est-elle en attente ?',
    "C'est quoi le Lightning Network et quand l'utiliser ?",
    'Que signifie "sat" (satoshi) ?',
    'Est-ce risqué de partager mon adresse Bitcoin ?',
    'Comment fonctionnent les frais de transaction ?',
  ],
  professional: [
    "Analyse mon set d'UTXOs pour consolidation",
    'Explique la dynamique des frais mempool actuelle',
    'Quelle est la différence entre SegWit v0 et Taproot ?',
    'Comment fonctionne le mécanisme des HTLC sur Lightning ?',
    "Quels sont les impacts de la réutilisation d'adresses ?",
    "Décortique le format d'une facture BOLT 11",
  ],
};

// ─── Markdown-lite renderer (no external lib needed) ─────────────────────────
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let keyIndex = 0;

  for (const line of lines) {
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      result.push(
        <p key={keyIndex++} className="font-semibold text-neutral-100">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      result.push(
        <p key={keyIndex++} className="flex gap-2">
          <span className="text-[#f7931a] shrink-0">•</span>
          <span>{inlineFormatting(line.slice(2))}</span>
        </p>
      );
    } else if (line.startsWith('`') && line.endsWith('`') && !line.startsWith('```')) {
      result.push(
        <code key={keyIndex++} className="font-mono text-[11px] bg-[#0d0f15] border border-[#232736] px-1.5 py-0.5 rounded text-[#f7931a]">
          {line.slice(1, -1)}
        </code>
      );
    } else if (line.trim() === '') {
      result.push(<br key={keyIndex++} />);
    } else {
      result.push(<p key={keyIndex++}>{inlineFormatting(line)}</p>);
    }
  }
  return result;
}

function inlineFormatting(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-neutral-100">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="font-mono text-[11px] bg-[#0d0f15] border border-[#232736] px-1 py-0.5 rounded text-[#f7931a]">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AssistantPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: t.assistant.welcomeMsg,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<UserLevel>('beginner');
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryHandled = useRef(false);

  // Update welcome message if language changes and only welcome is shown
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{ id: 'welcome', role: 'assistant', content: t.assistant.welcomeMsg }];
      }
      return prev;
    });
  }, [t.assistant.welcomeMsg]);

  // Load wallet context from sessionStorage (set by dashboard)
  const getWalletContext = useCallback((): WalletContext => {
    try {
      const stored = sessionStorage.getItem('btc-copilot-context');
      if (stored) return JSON.parse(stored) as WalletContext;
    } catch {}
    return {};
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message handler
  const sendMessage = useCallback(async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setInput('');
    setError(null);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Build messages history for API (last 10 to stay within token limits)
    const historyForApi = [...messages, userMsg]
      .filter((m) => !m.isError)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          context: getWalletContext(),
          level,
          language,
        }),
      });

      const rawText = await response.text();
      let data: {
        response?: string;
        provider?: 'gemini' | 'local';
        error?: string;
        hint?: string;
      } = {};

      try {
        data = JSON.parse(rawText) as typeof data;
      } catch {
        throw new Error(`Server response error (${response.status})`);
      }

      if (!response.ok || !data.response) {
        const errText = data.hint
          ? `${data.error}\n\n💡 ${data.hint}`
          : (data.error ?? 'Unknown error');
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: errText,
            isError: true,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.response!,
          provider: data.provider,
        },
      ]);
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('[Chat] fetch error:', err);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, messages, level, getWalletContext]);

  // Auto-trigger if URL has explainTx or q query parameter
  useEffect(() => {
    if (typeof window !== 'undefined' && !queryHandled.current) {
      const params = new URLSearchParams(window.location.search);
      const explainTx = params.get('explainTx');
      const q = params.get('q');
      if (explainTx) {
        queryHandled.current = true;
        void sendMessage(`Peux-tu m'expliquer la transaction ${explainTx} ? Quel montant, quels frais ont été payés, est-elle confirmée et y a-t-il des points d'attention ?`);
      } else if (q) {
        queryHandled.current = true;
        void sendMessage(q);
      }
    }
  }, [sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1a1e2b]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100">{t.assistant.title}</h1>
            <Badge variant="btc">Gemini Flash</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            {t.assistant.subtitle}
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 bg-[#12141c] p-1 rounded-lg border border-[#1e2230]">
          <span className="text-xs text-neutral-400 px-2 font-medium">{t.assistant.level}</span>
          <button
            onClick={() => setLevel('beginner')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              level === 'beginner'
                ? 'bg-[#f7931a] text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.assistant.beginner}
          </button>
          <button
            onClick={() => setLevel('professional')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              level === 'professional'
                ? 'bg-[#f7931a] text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {t.assistant.expert}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="flex flex-col" style={{ height: '600px' }}>
            <CardHeader className="py-3 flex flex-row items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#f7931a]/15 text-[#f7931a] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">BTC Copilot Intelligence</CardTitle>
                  <CardDescription className="text-[11px] mt-0">
                    Privacy Gateway Active • Zero credentials transmitted
                  </CardDescription>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">
                <ShieldCheck className="w-3 h-3" />
                <span>Sanitized Context</span>
              </Badge>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  {msg.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-lg bg-[#f7931a] text-neutral-950 font-bold flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[#1e2230] text-neutral-300 flex items-center justify-center shrink-0 text-xs font-bold">
                      U
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm space-y-1.5 leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-tr-none bg-[#1a2a1a] border border-[#2a3a2a] text-neutral-200'
                        : msg.isError
                        ? 'rounded-tl-none bg-red-950/30 border border-red-900/50 text-red-300'
                        : 'rounded-tl-none bg-[#161a26] border border-[#232736] text-neutral-200'
                    }`}
                  >
                    {msg.isError && <AlertCircle className="w-4 h-4 text-red-400 mb-1" />}
                    <div className="space-y-1">
                      {msg.role === 'assistant'
                        ? renderMarkdown(msg.content)
                        : <p>{msg.content}</p>
                      }
                    </div>
                    {msg.provider && (
                      <div className="pt-2 mt-2 border-t border-[#1e2230] flex items-center gap-1 text-[10px] text-neutral-500">
                        <Cpu className="w-3 h-3" />
                        <span>
                          {msg.provider === 'gemini'
                            ? 'Gemini Flash'
                            : 'Réponse déterministe'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f7931a] text-neutral-950 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-4 rounded-2xl rounded-tl-none bg-[#161a26] border border-[#232736]">
                    <Loader2 className="w-4 h-4 text-[#f7931a] animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Error bar */}
            {error && (
              <div className="px-4 py-2 bg-red-950/30 border-t border-red-900/50 flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-[#1e2230] bg-[#0f1118] shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.assistant.inputPlaceholder}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#090a0f] border border-[#232736] text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-[#f7931a] focus:ring-1 focus:ring-[#f7931a]/40 transition-colors disabled:opacity-50"
                />
                <Button
                  variant="primary"
                  size="md"
                  className="gap-2 shrink-0"
                  onClick={() => void sendMessage()}
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>{t.assistant.sendBtn}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Suggested Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#f7931a]" />
                <span>{t.assistant.suggestedTitle}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {t.assistant.suggested.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => void sendMessage(q)}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-lg bg-[#0d0f15] hover:bg-[#161a26] border border-[#1e2230] hover:border-[#f7931a]/40 text-xs text-neutral-300 hover:text-neutral-100 transition-all cursor-pointer leading-snug disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Privacy Card */}
          <Card variant="accent">
            <CardHeader>
              <CardTitle className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t.assistant.privacyTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-neutral-400 space-y-2">
              <p>{t.assistant.privacyDesc}</p>
              <div className="pt-2 border-t border-[#1e2230] text-[11px] text-emerald-400 font-medium space-y-1">
                {t.assistant.privacyBullets.map((bullet, i) => (
                  <div key={i}>{bullet}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
