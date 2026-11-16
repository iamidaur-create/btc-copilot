/**
 * AI Provider Factory — Dual-provider orchestration layer with offline local fallback
 *
 * Strategy:
 * 1. Try Mistral Large (best quality) if MISTRAL_API_KEY is present
 * 2. If Mistral fails (429, 503, timeout) or key missing → try Gemini Flash if GEMINI_API_KEY is present
 * 3. If neither key is present → use intelligent local deterministic Bitcoin Copilot responder
 *
 * This ensures the assistant ALWAYS functions 100% of the time, even without external API keys!
 */

import { callMistral } from './providers/mistral';
import { callGemini } from './providers/gemini';

export type UserLevel = 'beginner' | 'professional';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatContext {
  walletAddress?: string;
  balance?: number; // in satoshis
  transactions?: {
    txid: string;
    value: number; // satoshis
    timestamp: number;
    type: 'incoming' | 'outgoing';
    confirmed: boolean;
  }[];
  feeRate?: number; // sat/vB
  lightningBalance?: number; // in satoshis
}

export type Language = 'fr' | 'en';

/** Build the BTC Copilot system prompt */
function buildSystemPrompt(level: UserLevel, context: ChatContext | null, language: Language = 'fr'): string {
  const isFr = language === 'fr';

  const levelInstruction = isFr
    ? level === 'beginner'
      ? `NIVEAU DÉBUTANT :
- Réponds en français clair, précis et direct.
- RÈGLE ESSENTIELLE : N'utilise AUCUNE métaphore enfantine ou paternaliste (pas de comparaison avec des billets de banque ou des tirelires). Explique les concepts factuellement avec des termes simples mais rigoureux.
- Définis brièvement les sigles techniques utilisés.
- Sois concis (3 à 5 phrases par réponse).`
      : `NIVEAU EXPERT :
- Réponds en français technique et précis.
- Détaille les aspects protocolaires : types scriptPubKey (P2WPKH, Taproot), poids vBytes, état du mempool, arbre Tapscript, canaux LN et HTLCs.`
    : level === 'beginner'
      ? `BEGINNER LEVEL:
- Respond in clear, precise, and direct English.
- ESSENTIAL RULE: Do NOT use childish or condescending metaphors. Explain concepts factually with simple yet rigorous terms.
- Briefly define technical acronyms.
- Keep answers concise (3-5 sentences max).`
      : `PROFESSIONAL LEVEL:
- Respond in precise technical English.
- Detail protocol aspects: scriptPubKey types (P2WPKH, Taproot), vByte weight, mempool congestion, Tapscript trees, Lightning channels, and HTLCs.`;

  const contextSection = context
    ? isFr
      ? `
## Contexte du Wallet Actif (données réelles et assainies)
${context.walletAddress ? `- Adresse : \`${context.walletAddress}\`` : ''}
${context.balance !== undefined ? `- Solde on-chain : ${context.balance.toLocaleString()} satoshis (${(context.balance / 100_000_000).toFixed(8)} BTC)` : ''}
${context.lightningBalance !== undefined ? `- Solde Lightning : ${context.lightningBalance.toLocaleString()} satoshis` : ''}
${context.feeRate !== undefined ? `- Frais mempool actuels : ${context.feeRate} sat/vB` : ''}
${context.transactions && context.transactions.length > 0
      ? `- Dernières transactions (${context.transactions.length} disponibles) :\n` +
        context.transactions.slice(0, 5).map((tx, i) =>
          `  ${i + 1}. [${tx.txid.slice(0, 8)}...] ${tx.type === 'incoming' ? '↓ Reçu' : '↑ Envoyé'} ${tx.value.toLocaleString()} sats — ${tx.confirmed ? 'Confirmé' : 'EN ATTENTE (mempool)'} — ${new Date(tx.timestamp * 1000).toLocaleDateString('fr-FR')}`
        ).join('\n')
      : ''
    }
`
      : `
## Current Wallet Context (sanitized — real data)
${context.walletAddress ? `- Wallet: \`${context.walletAddress}\`` : ''}
${context.balance !== undefined ? `- On-chain balance: ${context.balance.toLocaleString()} satoshis (${(context.balance / 100_000_000).toFixed(8)} BTC)` : ''}
${context.lightningBalance !== undefined ? `- Lightning balance: ${context.lightningBalance.toLocaleString()} satoshis` : ''}
${context.feeRate !== undefined ? `- Current mempool fee rate: ${context.feeRate} sat/vB` : ''}
${context.transactions && context.transactions.length > 0
      ? `- Recent transactions (${context.transactions.length} shown):\n` +
        context.transactions.slice(0, 5).map((tx, i) =>
          `  ${i + 1}. [${tx.txid.slice(0, 8)}...] ${tx.type === 'incoming' ? '↓ Received' : '↑ Sent'} ${tx.value.toLocaleString()} sats — ${tx.confirmed ? 'Confirmed' : 'UNCONFIRMED'} — ${new Date(tx.timestamp * 1000).toLocaleDateString('en-US')}`
        ).join('\n')
      : ''
    }
`
    : '';

  const domainGuardrail = isFr
    ? `## CADRAGE DE DOMAINE & ESPRIT COPILOTE
Tu es un copilote dédié à Bitcoin, au Lightning Network, à la cryptographie et à la sécurité financière.
Si l'utilisateur pose une question de culture générale, historique ou économique liée de près ou de loin à la monnaie ou à la technologie (ex: Satoshi Nakamoto, crise de 2008, inflation, énergie, comparaison crypto) :
- Réponds brièvement et avec justesse en 1 ou 2 phrases concises.
- Puis invite courtoisement à analyser une transaction, à vérifier une adresse ou à explorer le portefeuille.
Si la question est totalement éloignée de toute logique technique ou financière (ex: météo, cuisine) : réponds avec esprit et bienveillance en une phrase, puis ramène gentiment le sujet vers son portefeuille Bitcoin.`
    : `## DOMAIN SCOPE & COPILOT PHILOSOPHY
You are an intelligent copilot specialized in Bitcoin, Lightning Network, cryptography, and wallet security.
If the user asks general economic, historical, or technological questions (e.g. Satoshi Nakamoto, 2008 crisis, inflation, mining energy, or crypto comparisons):
- Answer concisely and accurately in 1-2 sentences.
- Then smoothly invite the user to analyze a transaction, inspect an address, or monitor their wallet.
If a question is completely unrelated (e.g. weather, cooking): give a brief courteous response in one sentence and guide them back to their Bitcoin wallet.`;

  return isFr
    ? `Tu es BTC Copilot, un copilote intelligent spécialisé dans Bitcoin et le Lightning Network.

## Rôle principal
- Aider l'utilisateur à comprendre son solde, ses transactions et son historique blockchain.
- Expliquer précisément ce qui s'est passé dans une transaction (d'où viennent les fonds, montant, frais payés, confirmations).
- Expliquer pourquoi un paiement tarde dans la mempool et quelles sont les options (RBF, CPFP, attente).
- Répondre en français de manière claire, concise, factuelle et respectueuse.

${domainGuardrail}

## Consignes de style et de niveau
${levelInstruction}

## Règles de Sécurité Absolues :
- Ne JAMAIS demander ni accepter de clé privée, seed phrase (12/24 mots) ou mot de passe.
- Ne JAMAIS demander de chaîne secrète de connexion NWC.
- Ne JAMAIS certifier qu'une adresse est "100% sans risque".
- Ne jamais inventer de fausses transactions ou de faux soldes.
${contextSection}
## Structure des explications de transaction :
1. Action résumée factuellement (montant net, direction)
2. Frais & statut de confirmation
3. Recommandation ou vérification utile`
    : `You are BTC Copilot, an intelligent assistant specialized in Bitcoin and the Lightning Network.

## Main Role
- Help users understand their wallet activity, transactions, and blockchain data.
- Explain precisely what happened in a transaction (amount, fees, confirmations).
- Explain why a payment is pending in the mempool and potential options (RBF, CPFP, waiting).
- Respond in clear, concise, factual English without patronizing language.

${domainGuardrail}

## Style and Level Guidelines
${levelInstruction}

## Absolute Security Rules:
- NEVER ask for or accept private keys, seed phrases, or passwords.
- NEVER request NWC secret connection strings.
- NEVER claim an address is 100% safe.
- Base answers on real provided data; never invent balances or transactions.
${contextSection}
## Response Format:
1. Direct summary of what happened
2. Fee rate and confirmation status
3. Factual advice or verification note`;
}

/** Local rule-based responder for offline/demo use when no API keys are configured */
function generateLocalResponse(
  message: string,
  level: UserLevel,
  context: ChatContext | null,
  language: Language = 'fr'
): string {
  const query = message.toLowerCase();
  const isFr = language === 'fr';

  // 0. Out-of-scope guardrail check (e.g. Eiffel Tower, weather, recipes...)
  // Out-of-scope gentle redirection
  const outOfScopeKeywords = [
    'tour eiffel',
    'meteo',
    'weather',
    'recette',
    'recipe',
    'cinema',
    'football',
  ];
  if (outOfScopeKeywords.some((w) => query.includes(w))) {
    return isFr
      ? "En tant que copilote financier, mon rôle est de veiller sur votre portefeuille et de décrypter la blockchain Bitcoin. Je me concentre sur vos transactions, vos frais et la sécurité de vos adresses. Que souhaitez-vous vérifier aujourd'hui ?"
      : "As a financial copilot, my focus is Bitcoin blockchain security and wallet intelligence. I analyze your transactions, fee rates, and address risks. What would you like to verify today?";
  }

  // 1. Balance inquiries
  if (query.includes('balance') || query.includes('solde') || query.includes('combien') || query.includes('argent') || query.includes('how much')) {
    if (!context || context.balance === undefined) {
      return isFr
        ? "Aucun wallet n'est actuellement chargé. Entrez une adresse Bitcoin sur le **Tableau de bord** ou cliquez sur **Charger le Wallet Démo** pour consulter votre solde."
        : "No wallet is currently loaded. Enter a Bitcoin address on the **Dashboard** or click **Load Demo Wallet** to view your balance.";
    }
    const btc = (context.balance / 100_000_000).toFixed(8);
    const lnInfo = context.lightningBalance !== undefined
      ? isFr ? `\n\nSolde Lightning : **${context.lightningBalance.toLocaleString()} sats**.` : `\n\nLightning balance: **${context.lightningBalance.toLocaleString()} sats**.`
      : '';
    return isFr
      ? `Votre wallet contient actuellement **${context.balance.toLocaleString()} satoshis** (~${btc} BTC) on-chain.${lnInfo}\n\nDonnées issues en temps réel de la blockchain Bitcoin.`
      : `Your wallet currently holds **${context.balance.toLocaleString()} satoshis** (~${btc} BTC) on-chain.${lnInfo}\n\nData sourced in real-time from the Bitcoin blockchain.`;
  }

  // 2. Fee inquiries
  if (query.includes('fee') || query.includes('frais') || query.includes('mempool') || query.includes('sat/vb') || query.includes('coût')) {
    const rate = context?.feeRate ?? 14;
    return isFr
      ? `Les frais actuels sur le réseau Bitcoin sont d'environ **${rate} sat/vB** pour une confirmation standard.\n\nSur Bitcoin, les frais dépendent du poids en octets virtuels (vBytes) de la transaction et de la saturation du mempool, et non du montant envoyé.`
      : `Current Bitcoin network fee rates are approximately **${rate} sat/vB** for standard confirmation priority.\n\nBitcoin transaction fees depend on transaction weight in vBytes and mempool demand, not on the monetary amount transferred.`;
  }

  // 3. Unconfirmed transactions / pending
  if (query.includes('unconfirmed') || query.includes('confirm') || query.includes('pending') || query.includes('attente') || query.includes('bloqu') || query.includes('pourquoi')) {
    return isFr
      ? `Une transaction reste **en attente** tant qu'elle réside dans la mempool des nœuds. Les mineurs sélectionnent en priorité les transactions proposant le taux de frais (**sat/vB**) le plus élevé.\n\nUn bloc est miné en moyenne toutes les 10 minutes. Si vos frais sont inférieurs à l'état actuel de la mempool, la transaction sera validée dès que l'encombrement diminuera.`
      : `A transaction remains **pending** while waiting in node mempools. Miners prioritize transactions offering higher fee rates (**sat/vB**).\n\nBlocks are mined approximately every 10 minutes. If your fee rate is below current mempool demand, it will confirm once traffic eases.`;
  }

  // 4. UTXO explanation (Direct, precise, NO condescending metaphors)
  if (query.includes('utxo')) {
    return isFr
      ? `Un **UTXO (Unspent Transaction Output)** est une sortie de transaction non encore dépensée. Bitcoin n'utilise pas de système de comptes avec solde unique : votre solde global correspond à la somme des UTXOs distincts verrouillés par vos clés publiques. Lorsqu'une transaction est émise, elle consomme un ou plusieurs UTXOs en entrée et en produit de nouveaux en sortie.`
      : `A **UTXO (Unspent Transaction Output)** is an unspent output from a previous Bitcoin transaction. Bitcoin does not use account balances; instead, your total balance is the sum of discrete UTXOs locked to your public keys. Every transaction consumes existing UTXOs as inputs and generates new UTXOs as outputs.`;
  }

  // 5. Lightning Network
  if (query.includes('lightning') || query.includes('ln') || query.includes('éclair') || query.includes('nwc')) {
    return isFr
      ? `Le **Lightning Network** est un protocole de seconde couche (Layer 2) pour Bitcoin. Il repose sur des canaux de paiement bidirectionnels hors-chaîne sécurisés par des contrats à verrouillage temporel (HTLCs), permettant un règlement instantané et des frais minimes (souvent 1 satoshi).`
      : `The **Lightning Network** is a Layer 2 payment protocol built on top of Bitcoin. It utilizes off-chain bidirectional payment channels secured by Hashed Time-Locked Contracts (HTLCs) for sub-second settlement and sub-satoshi fees.`;
  }

  // 6. Address formats
  if (query.includes('segwit') || query.includes('taproot') || query.includes('script') || query.includes('format') || query.includes('adresse') || query.includes('address')) {
    return isFr
      ? `Bitcoin utilise 4 formats d'adresses principaux :\n- **Legacy (1...)** : Script P2PKH historique (2009).\n- **P2SH (3...)** : Adresses de scripts (souvent multi-signatures).\n- **Native SegWit (bc1q...)** : Format Bech32 v0, réduisant les frais d'environ 30%.\n- **Taproot (bc1p...)** : Format Bech32m v1 (BIP 341), offrant une confidentialité et une efficacité accrues via les signatures de Schnorr.`
      : `Bitcoin supports 4 primary address formats:\n- **Legacy (1...)**: Original P2PKH script.\n- **P2SH (3...)**: Script hash, typically multisig.\n- **Native SegWit (bc1q...)**: Bech32 v0, lowers fees by ~30%.\n- **Taproot (bc1p...)**: Bech32m v1, utilizing Schnorr signatures and Tapscript.`;
  }

  // 7. General fallback
  const addr = context?.walletAddress ? `\`${context.walletAddress}\`` : (isFr ? 'Wallet Démo' : 'Demo Wallet');
  const bal = context?.balance !== undefined ? `${context.balance.toLocaleString()} sats` : (isFr ? 'Non chargé' : 'Not loaded');

  return isFr
    ? `Bonjour, je suis **BTC Copilot**.\n\nWallet actif : ${addr} (Solde : **${bal}**).\n\nVous pouvez m'interroger sur une transaction spécifique, l'état des frais mempool, les confirmations ou les mécanismes protocolaires de Bitcoin et Lightning.`
    : `Hello, I am **BTC Copilot**.\n\nActive wallet: ${addr} (Balance: **${bal}**).\n\nYou can ask me about specific transactions, current mempool fees, confirmations, or Bitcoin and Lightning mechanics.`;
}

/** Main entry point — tries Mistral, then Gemini, then local intelligent fallback */
export async function generateAIResponse(
  messages: ChatMessage[],
  level: UserLevel,
  context: ChatContext | null,
  language: Language = 'fr'
): Promise<{ response: string; provider: 'mistral' | 'gemini' | 'local' }> {
  const systemPrompt = buildSystemPrompt(level, context, language);
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

  // 1. Try Mistral first (if key configured)
  if (process.env.MISTRAL_API_KEY && process.env.MISTRAL_API_KEY.trim() !== '') {
    try {
      const response = await callMistral(
        messages.map((m) => ({ role: m.role, content: m.content })),
        systemPrompt
      );
      return { response, provider: 'mistral' };
    } catch (err) {
      const error = err as { status?: number; message?: string };
      if (error.status === 401) {
        console.warn('[AI] Mistral key invalid, attempting fallback.');
      } else {
        console.warn('[AI] Mistral error, falling back to Gemini:', error.message);
      }
    }
  }

  // 2. Try Gemini fallback (if key configured)
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    try {
      const response = await callGemini(messages, systemPrompt);
      return { response, provider: 'gemini' };
    } catch (err) {
      const error = err as { message?: string };
      console.warn('[AI] Gemini error, falling back to local engine:', error.message);
    }
  }

  // 3. Autonomous Local Engine (always succeeds, zero keys required)
  const localResponse = generateLocalResponse(lastUserMessage, level, context, language);
  return { response: localResponse, provider: 'local' };
}
