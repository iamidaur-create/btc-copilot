/**
 * POST /api/ai/alert
 *
 * Ask the AI to explain a specific anomaly alert in human language.
 * The alert is detected by the deterministic engine (lib/anomaly/detector.ts)
 * and this route is called when the user clicks "Explain this alert".
 *
 * Security: the LLM never makes security decisions — it only explains.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/provider-factory';
import type { AnomalyAlert } from '@/lib/anomaly/detector';

interface AlertExplainRequest {
  alert: AnomalyAlert;
  level?: 'beginner' | 'professional';
  language?: 'fr' | 'en';
}

export async function POST(request: NextRequest) {
  let body: AlertExplainRequest;
  try {
    body = await request.json() as AlertExplainRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.alert || !body.alert.type) {
    return NextResponse.json({ error: 'alert is required' }, { status: 400 });
  }

  const { alert, level = 'beginner', language = 'fr' } = body;
  const isFr = language === 'fr';

  // Build a structured message for the LLM
  const message = isFr
    ? `Explique l'alerte suivante de portefeuille Bitcoin en langage clair, précis et factuel (sans métaphore enfantine) :

Type d'alerte : ${alert.type}
Sévérité : ${alert.severity}
Description : ${alert.description}
Contexte technique : ${alert.ruleDetails}
Montant de la transaction : ${alert.value.toLocaleString()} satoshis

Merci d'expliquer :
1. Ce que cela signifie concrètement
2. Si l'utilisateur doit s'inquiéter et pourquoi
3. Ce qu'il peut vérifier ou faire

Important : Ne dis pas que le portefeuille est piraté s'il n'y a pas de preuve. Reste factuel, rassurant et rigoureux.`
    : `Please explain the following Bitcoin wallet alert in clear, non-alarmist, factual language (no childish metaphors):

Alert Type: ${alert.type}
Severity: ${alert.severity}
Description: ${alert.description}
Technical Context: ${alert.ruleDetails}
Transaction value: ${alert.value.toLocaleString()} satoshis

Please explain:
1. What this means in plain language
2. Whether the user should be concerned and why
3. What they can verify or do (if anything)

Important: Do not say the wallet is compromised or hacked without proof. Be reassuring, factual, and rigorous.`;

  try {
    const { response, provider } = await generateAIResponse(
      [{ role: 'user', content: message }],
      level,
      null,
      language
    );

    return NextResponse.json({ explanation: response, provider });
  } catch (err) {
    const error = err as { message: string };
    return NextResponse.json(
      { error: 'AI explanation unavailable', details: error.message },
      { status: 503 }
    );
  }
}
