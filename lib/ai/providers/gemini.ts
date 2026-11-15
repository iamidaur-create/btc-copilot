/**
 * Google Gemini provider for BTC Copilot
 * Uses native fetch directly against Gemini REST API
 * Used as automatic fallback when Mistral is unavailable or rate-limited.
 */

export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function callGemini(
  userMessages: GeminiMessage[],
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const contents = userMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.3,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let message = `Gemini API error (${response.status})`;
    try {
      const parsed = JSON.parse(errorBody) as { error?: { message?: string } };
      message = parsed.error?.message ?? message;
    } catch {}
    const err = new Error(message) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }

  const data = await response.json() as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}
