/**
 * Mistral AI provider for BTC Copilot
 * Uses native fetch directly against Mistral REST API
 * Zero heavy SDK overhead, instant compilation, 100% reliable.
 */

export interface MistralMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function callMistral(
  messages: MistralMessage[],
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('MISTRAL_API_KEY not set');

  const payload = {
    model: 'mistral-large-latest',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    max_tokens: 1024,
    temperature: 0.3,
  };

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let message = `Mistral API error (${response.status})`;
    try {
      const parsed = JSON.parse(errorBody) as { message?: string; detail?: string };
      message = parsed.message ?? parsed.detail ?? message;
    } catch {}
    const err = new Error(message) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from Mistral');
  return content;
}
