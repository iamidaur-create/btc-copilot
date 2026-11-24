/**
 * AI Provider Factory — Gemini orchestration with deterministic Bitcoin glossary.
 *
 * Strategy:
 * 1. Answer glossary, wallet-context and out-of-scope questions locally.
 * 2. Send general Bitcoin analysis questions to Gemini only.
 * 3. If Gemini is unavailable or not configured, report it clearly.
 */

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
## Règle de réponse
- Réponds d'abord directement à la question posée.
- N'utilise le format montant/frais/recommandation que pour une question portant réellement sur une transaction.
- Ne cite un solde ou un txid que si la donnée est présente dans le contexte fourni.
- Si l'information n'est pas disponible, indique qu'elle manque clairement.
`
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
## Response Rule:
- Answer the actual question directly first.
- Use the amount/fee/recommendation format only for transaction-specific questions.
- Quote balances or txids only when present in the supplied context.
- State clearly when required information is unavailable.`;
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

  // 0. Deterministic Bitcoin glossary
  const glossary: Record<string, { fr: string; en: string }> = {
    sat: {
      fr: 'Un **sat (satoshi)** est la plus petite unité divisible du Bitcoin. **1 Bitcoin = 100 000 000 satoshis**. C\'est l\'équivalent des centimes pour l\'euro, mais à une échelle beaucoup plus précise, indispensable pour les micropaiements sur le réseau Lightning.',
      en: 'A **sat (satoshi)** is the smallest divisible unit of Bitcoin. **1 Bitcoin = 100,000,000 satoshis**. It serves as the primary denomination for daily transactions and Lightning micropayments.',
    },
    satoshi: {
      fr: 'Le **satoshi (sat)** est l\'unité atomique de Bitcoin, nommée en hommage à Satoshi Nakamoto. 1 BTC équivaut à 100 millions de satoshis (0,00000001 BTC).',
      en: 'A **satoshi (sat)** is the base unit of Bitcoin, named after Satoshi Nakamoto. 1 BTC equals 100 million satoshis (0.00000001 BTC).',
    },
    dust: {
      fr: 'Le **dust (poussière)** désigne un montant de satoshis si infime (généralement inférieur à 546 sats) que les frais nécessaires pour le dépenser dépassent sa valeur. Une **attaque dust** consiste à envoyer ces micro-montants à des adresses pour tenter de tracer l\'identité et les dépenses de leurs propriétaires.',
      en: '**Dust** refers to an amount of satoshis so small (typically under 546 sats) that network fees to spend it exceed its value. A **dust attack** sends microscopic amounts to track and deanonymize wallet owners.',
    },
    nostr: {
      fr: '**Nostr** est un protocole de communication décentralisé et résistant à la censure. Dans BTC Copilot, nous utilisons la spécification **NWC (Nostr Wallet Connect - NIP-47)** pour dialoguer avec votre nœud Lightning à travers des relais chiffrés, sans jamais exposer ni détenir votre clé privée.',
      en: '**Nostr** is a decentralized, censorship-resistant messaging protocol. BTC Copilot utilizes **NIP-47 (Nostr Wallet Connect)** to communicate with your Lightning node over encrypted relays without ever holding your private keys.',
    },
    nwc: {
      fr: '**NWC (Nostr Wallet Connect - NIP-47)** est un standard ouvert permettant à une application de demander des actions à un portefeuille Lightning (consulter le solde, créer une facture) via des requêtes chiffrées de bout en bout, avec des plafonds de sécurité définis par l\'utilisateur.',
      en: '**NWC (Nostr Wallet Connect - NIP-47)** is an open standard allowing applications to interact with Lightning wallets via end-to-end encrypted Nostr events with fine-grained spend permissions.',
    },
    halving: {
      fr: 'Le **halving** est un événement programmé dans le protocole Bitcoin tous les 210 000 blocs (~4 ans), qui divise par deux la récompense de minage accordée aux mineurs. Il garantit la rareté programmée jusqu\'à la limite absolue de 21 millions de bitcoins.',
      en: 'The **halving** is a programmatic event occurring every 210,000 blocks (~4 years) that cuts block subsidy rewards in half, enforcing Bitcoin\'s strict 21 million supply cap.',
    },
    mempool: {
      fr: 'La **mempool** est l’ensemble des transactions valides reçues par les nœuds mais pas encore incluses dans un bloc. Elle sert aussi à estimer les frais selon la demande actuelle.',
      en: 'The **mempool** is the set of valid transactions received by nodes but not yet included in a block. Its fee distribution also helps estimate demand for block space.',
    },
    rbf: {
      fr: 'Le **RBF (Replace-By-Fee)** permet à l’émetteur d’une transaction non confirmée de la remplacer par une version proposant des frais plus élevés.',
      en: '**RBF (Replace-By-Fee)** lets the sender replace an unconfirmed transaction with a version that pays a higher fee.',
    },
    cpfp: {
      fr: 'Le **CPFP (Child-Pays-for-Parent)** consiste à dépenser une sortie d’une transaction parente en attente avec des frais élevés, afin d’inciter les mineurs à confirmer les deux transactions.',
      en: '**CPFP (Child-Pays-for-Parent)** spends an output from a pending parent transaction in a child transaction with a high fee, encouraging miners to confirm both.',
    },
    segwit: {
      fr: 'Le **SegWit** est une amélioration du format des transactions Bitcoin qui sépare certaines données de signature, réduit le poids compté et prend en charge les formats P2WPKH/P2WSH.',
      en: '**SegWit** separates signature data from some transaction fields, reduces virtual transaction weight, and enables P2WPKH/P2WSH formats.',
    },
    taproot: {
      fr: 'Le **Taproot** est le format Bitcoin bc1p basé sur Bech32m. Il associe les clés Schnorr et les scripts MAST pour améliorer la confidentialité et l’efficacité des scripts complexes.',
      en: '**Taproot** is the bc1p Bitcoin format based on Bech32m. It combines Schnorr keys and MAST scripts to improve privacy and efficiency for complex scripts.',
    },
  };
  for (const [term, definition] of Object.entries(glossary)) {
    if (query.includes(term)) return isFr ? definition.fr : definition.en;
  }

  // Out-of-scope guardrail check (e.g. Eiffel Tower, weather, recipes...)
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
  if (query.includes('fee') || query.includes('frais') || query.includes('sat/vb') || query.includes('coût') || query.includes('vbyte') || query.includes('vbytes')) {
    const rate = context?.feeRate;
    if (rate === undefined) {
      return isFr
        ? "Le taux de frais actuel n'est pas disponible dans le contexte chargé. Un **vbyte (vB)** est une unité virtuelle de poids utilisée pour mesurer la taille d'une transaction Bitcoin. Les frais s'évaluent en sat/vB : poids virtuel multiplié par le taux choisi."
        : "The current fee rate is not available in the loaded context. A **vbyte (vB)** is a virtual weight unit used to measure a Bitcoin transaction. Fees are calculated in sat/vB: virtual transaction weight multiplied by the selected fee rate.";
    }
    return isFr
      ? `Le taux de frais fourni par le contexte est de **${rate} sat/vB**. Sur Bitcoin, les frais dépendent du poids virtuel de la transaction et de la saturation du mempool, et non du montant envoyé.`
      : `The fee rate supplied by the context is **${rate} sat/vB**. Bitcoin transaction fees depend on virtual transaction weight and mempool demand, not on the amount transferred.`;
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

  // 7. General fallback: return to the Bitcoin wallet scope without inventing data
  return isFr
    ? 'Je peux répondre sur Bitcoin, Lightning, votre portefeuille chargé, ses transactions et ses risques. Pour toute autre question, revenons à l’adresse ou à la transaction que vous souhaitez analyser.'
    : 'I can answer questions about Bitcoin, Lightning, your loaded wallet, transactions, and risks. For unrelated topics, let us return to the address or transaction you want to analyze.';
}

/** Main entry point — Gemini primary, local autonomous fallback only if API fails */
export async function generateAIResponse(
  messages: ChatMessage[],
  level: UserLevel,
  context: ChatContext | null,
  language: Language = 'fr'
): Promise<{ response: string; provider: 'gemini' | 'local' }> {
  const systemPrompt = buildSystemPrompt(level, context, language);
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

  // 1. Try Gemini first (live intelligence)
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    try {
      const response = await callGemini(messages, systemPrompt);
      return { response, provider: 'gemini' };
    } catch (err) {
      const error = err as { message?: string };
      console.warn('[AI] Gemini call failed, engaging local fallback engine:', error.message);
    }
  }

  // 2. Local fallback engine (only if Gemini API is unreachable)
  const localResponse = generateLocalResponse(lastUserMessage, level, context, language);
  return { response: localResponse, provider: 'local' };
}
