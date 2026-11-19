/**
 * POST /api/ai/chat
 *
 * Secure server-side AI endpoint for BTC Copilot.
 *
 * Security model:
 * - All LLM calls happen server-side only
 * - User messages are sanitized before being sent to any LLM
 * - Context (wallet data) is sanitized via privacy gateway
 * - No API keys are ever exposed to the client
 * - Rate limit: 20 requests per minute per IP (enforced via simple in-memory counter)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, type ChatMessage, type ChatContext, type UserLevel, type Language } from '@/lib/ai/provider-factory';
import { sanitizeUserMessage, sanitizeContext } from '@/lib/ai/privacy/sanitize-context';

// ─── Simple in-memory rate limiter ───────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

// ─── Request validation ───────────────────────────────────────────────────────
interface ChatRequest {
  messages: ChatMessage[];
  context?: Record<string, unknown>;
  level?: UserLevel;
  language?: Language;
}

function validateRequest(body: unknown): ChatRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be a JSON object');
  }

  const req = body as Record<string, unknown>;

  if (!Array.isArray(req.messages)) {
    throw new Error('messages must be an array');
  }

  if (req.messages.length === 0) {
    throw new Error('messages array cannot be empty');
  }

  if (req.messages.length > 20) {
    throw new Error('Too many messages in context (max 20)');
  }

  for (const msg of req.messages) {
    if (!msg || typeof msg !== 'object') throw new Error('Invalid message format');
    const m = msg as Record<string, unknown>;
    if (m.role !== 'user' && m.role !== 'assistant') {
      throw new Error('Message role must be "user" or "assistant"');
    }
    if (typeof m.content !== 'string' || m.content.trim().length === 0) {
      throw new Error('Message content must be a non-empty string');
    }
    if (m.content.length > 2000) {
      throw new Error('Message too long (max 2000 characters)');
    }
  }

  const level = (req.level as UserLevel) ?? 'beginner';
  if (level !== 'beginner' && level !== 'professional') {
    throw new Error('level must be "beginner" or "professional"');
  }

  const language = req.language === 'en' ? 'en' : 'fr';

  return {
    messages: req.messages as ChatMessage[],
    context: req.context as Record<string, unknown> | undefined,
    level,
    language,
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment before sending another message.' },
      { status: 429 }
    );
  }

  // Parse and validate body
  let reqData: ChatRequest;
  try {
    const rawBody = await request.json() as unknown;
    reqData = validateRequest(rawBody);
  } catch (err) {
    const error = err as { message: string };
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Sanitize user messages (privacy gateway)
  const sanitizedMessages: ChatMessage[] = reqData.messages.map((msg) => ({
    role: msg.role,
    content: msg.role === 'user' ? sanitizeUserMessage(msg.content) : msg.content,
  }));

  // Sanitize wallet context
  let sanitizedContext: ChatContext | null = null;
  if (reqData.context && Object.keys(reqData.context).length > 0) {
    sanitizedContext = sanitizeContext(reqData.context) as ChatContext;
  }

  // Generate response
  try {
    const { response, provider } = await generateAIResponse(
      sanitizedMessages,
      reqData.level ?? 'beginner',
      sanitizedContext,
      reqData.language ?? 'fr'
    );

    return NextResponse.json({
      response,
      provider,
      model: provider === 'gemini' ? 'gemini-3.5-flash-lite' : 'deterministic-local',
    });
  } catch (err) {
    const error = err as { message: string };
    console.error('[AI Chat] Error:', error.message);

    // Check for missing API keys
    if (error.message.includes('not set') || error.message.includes('No AI provider')) {
      return NextResponse.json(
        {
          error: 'AI provider not configured',
          hint: 'Add GEMINI_API_KEY to your .env.local file',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'AI service temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}

// Block GET requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
