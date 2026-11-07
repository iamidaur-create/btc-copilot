export type ExplanationLevel = 'beginner' | 'professional';

export type AIProviderName = 'mistral' | 'gemini';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRequest {
  systemPrompt: string;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  provider: AIProviderName;
  tokensUsed?: number;
}

export interface AIProvider {
  name: AIProviderName;
  complete(request: AIRequest): Promise<AIResponse>;
}

export interface SanitizedTransactionContext {
  txIdShort: string;
  amountBtc: number;
  feeSatoshis: number;
  feeRateSatVb?: number;
  isConfirmed: boolean;
  confirmations?: number;
  blockTimeFormatted?: string;
  direction: 'incoming' | 'outgoing' | 'internal';
  inputCount: number;
  outputCount: number;
  addressType: string;
}

export interface SanitizedAlertContext {
  alertType: string;
  severity: string;
  observedValue: number;
  baselineValue: number;
  reason: string;
  timestamp: string;
  txRefShort: string;
}
