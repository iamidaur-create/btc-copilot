'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en';

export interface Translations {
  // Navigation
  nav: {
    dashboard: string;
    transactions: string;
    assistant: string;
    monitoring: string;
    security: string;
    lightning: string;
    settings: string;
  };
  // TopBar
  topBar: {
    activeTarget: string;
    demoWallet: string;
    privacySafe: string;
    aiGateway: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    analyzeBtn: string;
    loadingBtn: string;
    loadDemo: string;
    noWalletLoaded: string;
    noWalletDesc: string;
    readOnlyBadge: string;
    recentTransactions: string;
    shown: string;
    explainBtn: string;
    refresh: string;
    updated: string;
  };
  // Wallet Stats
  walletStats: {
    confirmedBalance: string;
    confirmedSub: string;
    pendingBalance: string;
    inMempool: string;
    noPending: string;
    totalReceived: string;
    lifetimeIncoming: string;
    totalSent: string;
    totalTransactions: string;
    networkFees: string;
    fast: string;
    medium: string;
    slow: string;
    economy: string;
    live: string;
  };
  // Transactions Page
  transactionsPage: {
    title: string;
    subtitle: string;
    all: string;
    received: string;
    sent: string;
    pending: string;
    exportCsv: string;
    refresh: string;
    thType: string;
    thTxid: string;
    thAmount: string;
    thStatus: string;
    thFee: string;
    thDate: string;
    thAction: string;
    confirmed: string;
    mempoolPending: string;
    explain: string;
    selfTransfer: string;
    emptyFilter: string;
  };
  // Assistant
  assistant: {
    title: string;
    subtitle: string;
    level: string;
    beginner: string;
    expert: string;
    welcomeMsg: string;
    inputPlaceholder: string;
    sendBtn: string;
    suggestedTitle: string;
    suggested: string[];
    privacyTitle: string;
    privacyDesc: string;
    privacyBullets: string[];
    outOfScopeMsg: string;
  };
  // Monitoring / Alerts
  monitoring: {
    title: string;
    subtitle: string;
    noAlertsTitle: string;
    noAlertsDesc: string;
    explainAiBtn: string;
    profileSmall: string;
    profileWhale: string;
  };
  // Lightning
  lightning: {
    title: string;
    subtitle: string;
    protocolReady: string;
    networkCapacity: string;
    lockedSats: string;
    activeChannels: string;
    routingConduits: string;
    activeNodes: string;
    torClearnet: string;
    medianBaseFee: string;
    medianFeeRate: string;
    demoNodeTitle: string;
    liquidityHubBadge: string;
    viewMempool: string;
    nodeCapacity: string;
    openChannels: string;
    operatorOrigin: string;
    // NWC Wallet Manager
    connectTitle: string;
    connectDesc: string;
    connectBtn: string;
    connectingBtn: string;
    disconnectBtn: string;
    pairingSecretLabel: string;
    pairingSecretPlaceholder: string;
    pairingSecretHelp: string;
    connectedWallet: string;
    supportedMethods: string;
    lightningBalance: string;
    createInvoiceTitle: string;
    createInvoiceDesc: string;
    amountLabel: string;
    memoLabel: string;
    generateInvoiceBtn: string;
    generatingInvoiceBtn: string;
    invoiceReady: string;
    copyInvoice: string;
    copied: string;
    awaitingPayment: string;
    paymentReceived: string;
  };
  // Security
  security: {
    title: string;
    subtitle: string;
    badge: string;
    readOnlyTitle: string;
    readOnlyDesc: string;
    privacyGatewayTitle: string;
    privacyGatewayDesc: string;
    serverCredsTitle: string;
    serverCredsDesc: string;
    matrixTitle: string;
    matrixDesc: string;
    thDataElement: string;
    thGatewayTreatment: string;
    thTransmitted: string;
    thSecurityRationale: string;
    badgeNever: string;
    badgeShortened: string;
    badgeSanitized: string;
    badgeYes: string;
    // Verification & Risk Guardian
    riskVerifierTitle: string;
    riskVerifierDesc: string;
    verifyInputPlaceholder: string;
    verifyBtn: string;
    verifyingBtn: string;
    statusRiskIdentified: string;
    statusWarning: string;
    statusNoMatch: string;
    statusInsufficient: string;
    disclaimer: string;
    sourceLabel: string;
    verifiedAtLabel: string;
  };
  // Settings
  settings: {
    title: string;
    subtitle: string;
    resetDefaults: string;
    walletConfigTitle: string;
    walletConfigDesc: string;
    demoModeLabel: string;
    demoModeDesc: string;
    storageBackendLabel: string;
    storageBackendDesc: string;
    aiOrchestrationTitle: string;
    aiOrchestrationDesc: string;
    primaryProviderLabel: string;
    primaryProviderDesc: string;
    fallbackProviderLabel: string;
    fallbackProviderDesc: string;
    badgeActive: string;
    badgeDefault: string;
    badgeStandby: string;
    languageTitle: string;
    languageDesc: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      dashboard: 'Tableau de bord',
      transactions: 'Transactions',
      assistant: 'Assistant IA',
      monitoring: 'Surveillance',
      security: 'Sécurité & Risques',
      lightning: 'Lightning NWC',
      settings: 'Paramètres',
    },
    topBar: {
      activeTarget: 'Wallet actif :',
      demoWallet: 'Wallet Démo',
      privacySafe: 'Données protégées',
      aiGateway: 'Passerelle IA :',
    },
    dashboard: {
      title: 'Tableau de bord',
      subtitle: 'Analysez n’importe quelle adresse Bitcoin. Lecture seule — aucune clé privée requise.',
      inputPlaceholder: 'Entrez une adresse Bitcoin (1..., 3..., bc1...)',
      analyzeBtn: 'Analyser',
      loadingBtn: 'Chargement…',
      loadDemo: 'Charger le Wallet Démo (Satoshi Genesis)',
      noWalletLoaded: 'Aucun wallet chargé',
      noWalletDesc: 'Saisissez une adresse Bitcoin ci-dessus ou chargez le wallet démo pour explorer les données en temps réel.',
      readOnlyBadge: 'Lecture seule · Zéro clé privée · Connexion non requise',
      recentTransactions: 'Transactions Récentes',
      shown: 'affichées',
      explainBtn: 'Expliquer',
      refresh: 'Actualiser',
      updated: 'Mis à jour il y a',
    },
    walletStats: {
      confirmedBalance: 'Solde Confirmé',
      confirmedSub: '₿ confirmé on-chain',
      pendingBalance: 'Solde en Attente',
      inMempool: 'tx dans la mempool',
      noPending: 'Aucune transaction en attente',
      totalReceived: 'Total Reçu',
      lifetimeIncoming: 'historique des entrées',
      totalSent: 'Total Envoyé',
      totalTransactions: 'transactions au total',
      networkFees: 'Frais Réseau',
      fast: 'Rapide',
      medium: 'Moyen',
      slow: 'Lent',
      economy: 'Économique',
      live: 'En direct',
    },
    transactionsPage: {
      title: 'Historique des Transactions',
      subtitle: 'Explorez vos transactions on-chain avec filtres, export et explication IA.',
      all: 'Toutes',
      received: 'Reçues',
      sent: 'Envoyées',
      pending: 'En attente',
      exportCsv: 'Exporter CSV',
      refresh: 'Actualiser',
      thType: 'Type',
      thTxid: 'ID Transaction',
      thAmount: 'Montant',
      thStatus: 'Statut',
      thFee: 'Frais',
      thDate: 'Date',
      thAction: 'Action IA',
      confirmed: 'Confirmé',
      mempoolPending: 'En attente (mempool)',
      explain: 'Expliquer',
      selfTransfer: 'Auto-transfert',
      emptyFilter: 'Aucune transaction ne correspond à ce filtre.',
    },
    assistant: {
      title: 'Assistant IA Bitcoin',
      subtitle: 'Posez des questions directes et techniques sur vos transactions, vos frais et Bitcoin.',
      level: 'Niveau :',
      beginner: 'Débutant',
      expert: 'Expert',
      welcomeMsg:
        "Bonjour ! Je suis **BTC Copilot**, votre assistant dédié à Bitcoin et au Lightning Network.\n\nJe réponds à vos questions sur vos transactions, les frais de réseau, les confirmations et les formats de scripts. Mes réponses sont directes, factuelles et sans métaphores superflues.\n\nComment puis-je vous aider ?",
      inputPlaceholder: 'Posez une question sur votre wallet ou Bitcoin...',
      sendBtn: 'Envoyer',
      suggestedTitle: 'Suggestions',
      suggested: [
        'Quel est mon solde actuel ?',
        'Pourquoi ma transaction est-elle en attente ?',
        'Comment fonctionnent les frais de transaction ?',
        'Que signifie "sat" (satoshi) ?',
        'Est-ce risqué de partager mon adresse Bitcoin ?',
        'Qu’est-ce que le Lightning Network ?',
      ],
      privacyTitle: 'Passerelle de Confidentialité',
      privacyDesc: 'Toutes les requêtes sont assainies avant envoi. Les adresses sont tronquées, et les clés privées ou seed phrases sont rigoureusement bloquées.',
      privacyBullets: [
        '✓ Orchestration IA côté serveur',
        '✓ Aucun secret stocké ou transmis',
        '✓ Gemini Flash + Fallback local',
      ],
      outOfScopeMsg: "Je suis BTC Copilot, un assistant strictement dédié à Bitcoin et au Lightning Network. Je ne peux pas répondre aux questions de culture générale ou hors sujet.",
    },
    monitoring: {
      title: 'Surveillance du Portefeuille',
      subtitle: 'Détection d’anomalies adaptative basée sur le profil du portefeuille.',
      noAlertsTitle: 'Aucune anomalie détectée',
      noAlertsDesc: 'Toutes les transactions récentes respectent les modèles de dépense habituels.',
      explainAiBtn: 'Expliquer cette alerte',
      profileSmall: 'Profil Standard (< 0.1 BTC) : Détection dès 3x la moyenne',
      profileWhale: 'Profil Whale (> 1 BTC) : Détection dès 5x la moyenne',
    },
    lightning: {
      title: 'Lightning Network & Portefeuille NWC',
      subtitle: 'Connectez votre portefeuille Lightning non-custodial via Nostr Wallet Connect (NIP-47), consultez vos soldes et générez des factures.',
      protocolReady: 'Protocole NWC Prêt',
      networkCapacity: 'Capacité Totale du Réseau',
      lockedSats: '~253 milliards de satoshis verrouillés',
      activeChannels: 'Canaux Actifs',
      routingConduits: 'Canaux de routage de paiement',
      activeNodes: 'Nœuds Actifs',
      torClearnet: '6 816 Tor • 3 283 Clearnet',
      medianBaseFee: 'Frais de Base Médian',
      medianFeeRate: 'Taux de frais médian : 100 ppm',
      demoNodeTitle: 'Nœud Démo : ACINQ (Phoenix Wallet)',
      liquidityHubBadge: 'Top 3 Hub de Liquidité',
      viewMempool: 'Voir sur Mempool',
      nodeCapacity: 'Capacité du Nœud',
      openChannels: 'Canaux Ouverts',
      operatorOrigin: 'Opérateur / Origine',
      // NWC Wallet Manager
      connectTitle: 'Connexion Portefeuille NWC (NIP-47)',
      connectDesc: 'Connectez un wallet Lightning distant (Alby, Mutiny, Umbrel, etc.). Le secret reste uniquement en mémoire.',
      connectBtn: 'Connecter Wallet',
      connectingBtn: 'Connexion en cours…',
      disconnectBtn: 'Déconnecter',
      pairingSecretLabel: 'Chaîne de connexion NWC (nostr+walletconnect://...)',
      pairingSecretPlaceholder: 'nostr+walletconnect://...',
      pairingSecretHelp: 'Non-custodial : aucun secret n’est envoyé à un serveur ni stocké dans le navigateur.',
      connectedWallet: 'Portefeuille Lightning Connecté',
      supportedMethods: 'Méthodes NWC supportées :',
      lightningBalance: 'Solde Lightning Réel',
      createInvoiceTitle: 'Recevoir des satoshis (Facture BOLT-11)',
      createInvoiceDesc: 'Générez une facture Lightning réelle pour recevoir des paiements.',
      amountLabel: 'Montant (en satoshis)',
      memoLabel: 'Description / Note',
      generateInvoiceBtn: 'Générer Facture',
      generatingInvoiceBtn: 'Génération…',
      invoiceReady: 'Facture BOLT-11 prête',
      copyInvoice: 'Copier Facture',
      copied: 'Copié !',
      awaitingPayment: 'En attente de paiement (vérification en temps réel)…',
      paymentReceived: 'Paiement reçu avec succès !',
    },
    security: {
      title: 'Centre de Sécurité & Bouclier Anti-Arnaque',
      subtitle: 'Zéro gestion de clés privées, passerelle de confidentialité stricte et vérification des risques connus (Zafy).',
      badge: 'Protection Lecture Seule',
      readOnlyTitle: 'Garantie 100% Lecture Seule',
      readOnlyDesc: 'BTC Copilot ne demande, ne stocke ni ne manipule aucune clé privée, seed phrase ou mot de passe. Aucune transaction ne peut être signée ou diffusée.',
      privacyGatewayTitle: 'Passerelle de Confidentialité Active',
      privacyGatewayDesc: 'Les adresses et identifiants de transaction sont tronqués avant tout appel d’IA. Les montants sont anonymisés pour empêcher le profilage.',
      serverCredsTitle: 'Identifiants Serveur Isolés',
      serverCredsDesc: 'Les clés API résident exclusivement dans les variables d’environnement du serveur. Aucun secret n’est exposé au navigateur.',
      matrixTitle: 'Matrice d’Assainissement des Données',
      matrixDesc: 'Journal d’audit des données transmises aux modèles d’IA versus celles strictement bloquées.',
      thDataElement: 'Élément de donnée',
      thGatewayTreatment: 'Traitement par la Passerelle',
      thTransmitted: 'Transmis à l’IA ?',
      thSecurityRationale: 'Justification Sécurité',
      badgeNever: 'JAMAIS',
      badgeShortened: 'Tronqué uniquement',
      badgeSanitized: 'Assaini',
      badgeYes: 'Oui (Sécurisé)',
      // Verification & Risk Guardian
      riskVerifierTitle: 'Vérificateur d’Adresses & Détection de Risques (Style Zafy)',
      riskVerifierDesc: 'Vérifiez une adresse Bitcoin avant tout envoi sensible. Les résultats s’appuient sur des sources transparentes.',
      verifyInputPlaceholder: 'Collez une adresse Bitcoin à analyser (ex: bc1q..., 1..., 3...)',
      verifyBtn: 'Vérifier l’Adresse',
      verifyingBtn: 'Analyse en cours…',
      statusRiskIdentified: 'Risque Identifié',
      statusWarning: 'Avertissement',
      statusNoMatch: 'Aucune Correspondance Trouvée',
      statusInsufficient: 'Données Insuffisantes',
      disclaimer: 'Avertissement important : L’absence de signalement dans les bases de données connues ne garantit en aucun cas qu’une adresse soit sûre à 100%. Vérifiez toujours vos destinataires.',
      sourceLabel: 'Sources vérifiées :',
      verifiedAtLabel: 'Date d’analyse :',
    },
    settings: {
      title: 'Paramètres de la Plateforme',
      subtitle: 'Configurez la langue, les seuils de surveillance et le comportement de l’assistant.',
      resetDefaults: 'Réinitialiser',
      walletConfigTitle: 'Configuration du Portefeuille',
      walletConfigDesc: 'Gestion de l’adresse cible et du mode démonstration',
      demoModeLabel: 'Mode Démonstration',
      demoModeDesc: 'Précharge l’adresse historique du bloc Genesis de Satoshi pour les tests',
      storageBackendLabel: 'Stockage des Préférences',
      storageBackendDesc: 'localStorage local (aucune donnée personnelle sur serveur distant)',
      aiOrchestrationTitle: 'Orchestration des Fournisseurs IA',
      aiOrchestrationDesc: 'Bascule automatique de secours et gestion de disponibilité',
      primaryProviderLabel: 'Fournisseur Principal',
      primaryProviderDesc: 'Google Gemini (gemini-3.5-flash-lite / rapide et fiable)',
      fallbackProviderLabel: 'Fallback Local Autonome',
      fallbackProviderDesc: 'Moteur de règles déterministe hors-ligne (100% disponible sans clé)',
      badgeActive: 'Actif',
      badgeDefault: 'Par défaut',
      badgeStandby: 'En veille',
      languageTitle: 'Langue de l’Interface',
      languageDesc: 'Basculez facilement entre le français et l’anglais',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      assistant: 'AI Assistant',
      monitoring: 'Monitoring',
      security: 'Security & Risks',
      lightning: 'Lightning NWC',
      settings: 'Settings',
    },
    topBar: {
      activeTarget: 'Active Target:',
      demoWallet: 'Demo Wallet',
      privacySafe: 'Privacy Safe',
      aiGateway: 'AI Gateway:',
    },
    dashboard: {
      title: 'Wallet Dashboard',
      subtitle: 'Analyze any Bitcoin address. Read-only — no private keys required.',
      inputPlaceholder: 'Enter a Bitcoin address (1..., 3..., bc1...)',
      analyzeBtn: 'Analyze',
      loadingBtn: 'Loading…',
      loadDemo: 'Load Demo Wallet (Satoshi Genesis)',
      noWalletLoaded: 'No wallet loaded',
      noWalletDesc: 'Enter a Bitcoin address above or load the demo wallet to explore live data.',
      readOnlyBadge: 'Read-only · Zero private keys · No connection required',
      recentTransactions: 'Recent Transactions',
      shown: 'shown',
      explainBtn: 'Explain',
      refresh: 'Refresh',
      updated: 'Updated',
    },
    walletStats: {
      confirmedBalance: 'Confirmed Balance',
      confirmedSub: '₿ on-chain confirmed',
      pendingBalance: 'Pending Balance',
      inMempool: 'tx in mempool',
      noPending: 'No pending transactions',
      totalReceived: 'Total Received',
      lifetimeIncoming: 'lifetime incoming',
      totalSent: 'Total Sent',
      totalTransactions: 'total transactions',
      networkFees: 'Network Fees',
      fast: 'Fast',
      medium: 'Medium',
      slow: 'Slow',
      economy: 'Economy',
      live: 'Live',
    },
    transactionsPage: {
      title: 'Transaction History',
      subtitle: 'Explore confirmed and pending on-chain transactions with AI analysis.',
      all: 'All',
      received: 'Received',
      sent: 'Sent',
      pending: 'Pending',
      exportCsv: 'Export CSV',
      refresh: 'Refresh',
      thType: 'Type',
      thTxid: 'Transaction ID',
      thAmount: 'Amount',
      thStatus: 'Status',
      thFee: 'Fee',
      thDate: 'Date',
      thAction: 'AI Action',
      confirmed: 'Confirmed',
      mempoolPending: 'Pending (Mempool)',
      explain: 'Explain',
      selfTransfer: 'Self-Transfer',
      emptyFilter: 'No transactions match this filter.',
    },
    assistant: {
      title: 'Bitcoin AI Assistant',
      subtitle: 'Ask direct, factual questions about your transactions, fees, and Bitcoin mechanics.',
      level: 'Level:',
      beginner: 'Beginner',
      expert: 'Expert',
      welcomeMsg:
        "Hello! I am **BTC Copilot**, your assistant dedicated to Bitcoin and the Lightning Network.\n\nI answer questions about your transactions, network fees, confirmations, and script formats with direct, factual explanations.\n\nHow can I help you?",
      inputPlaceholder: 'Ask anything about your wallet or Bitcoin...',
      sendBtn: 'Send',
      suggestedTitle: 'Suggested',
      suggested: [
        'What is my current balance?',
        'Why is my transaction still unconfirmed?',
        'How do transaction fees work?',
        'What does "sat" mean?',
        'Is it safe to share my Bitcoin address?',
        'What is the Lightning Network?',
      ],
      privacyTitle: 'Privacy Gateway',
      privacyDesc: 'All inputs are sanitized before transmission. Addresses are truncated, and private keys or seed phrases are strictly blocked.',
      privacyBullets: [
        '✓ Server-side AI orchestration',
        '✓ Zero stored or transmitted secrets',
        '✓ Gemini Flash + Local fallback',
      ],
      outOfScopeMsg: "I am BTC Copilot, an assistant strictly dedicated to Bitcoin and the Lightning Network. I cannot answer general knowledge or out-of-scope questions.",
    },
    monitoring: {
      title: 'Wallet Monitoring',
      subtitle: 'Adaptive anomaly detection calibrated to wallet profile.',
      noAlertsTitle: 'No anomalies detected',
      noAlertsDesc: 'All recent transactions align with expected spending patterns.',
      explainAiBtn: 'Explain this alert',
      profileSmall: 'Standard profile (< 0.1 BTC): Alert at 3x rolling mean',
      profileWhale: 'Whale profile (> 1 BTC): Alert at 5x rolling mean',
    },
    lightning: {
      title: 'Lightning Network & NWC Wallet',
      subtitle: 'Connect your non-custodial Lightning wallet with Nostr Wallet Connect, inspect balances, and receive payments.',
      protocolReady: 'NWC Protocol Ready',
      networkCapacity: 'Total Network Capacity',
      lockedSats: '~253 Billion satoshis locked',
      activeChannels: 'Active Channels',
      routingConduits: 'Payment routing conduits',
      activeNodes: 'Active Nodes',
      torClearnet: '6,816 Tor • 3,283 Clearnet',
      medianBaseFee: 'Median Base Fee',
      medianFeeRate: 'Median fee rate: 100 ppm',
      demoNodeTitle: 'Demo Node: ACINQ (Phoenix Wallet)',
      liquidityHubBadge: 'Top 3 Liquidity Hub',
      viewMempool: 'View on Mempool',
      nodeCapacity: 'Node Capacity',
      openChannels: 'Open Channels',
      operatorOrigin: 'Operator / Origin',
      // NWC Wallet Manager
      connectTitle: 'Connect NWC Wallet (NIP-47)',
      connectDesc: 'Connect a remote Lightning wallet (Alby, Mutiny, Umbrel, etc.). Secrets remain in memory only.',
      connectBtn: 'Connect Wallet',
      connectingBtn: 'Connecting…',
      disconnectBtn: 'Disconnect',
      pairingSecretLabel: 'NWC Connection URI (nostr+walletconnect://...)',
      pairingSecretPlaceholder: 'nostr+walletconnect://...',
      pairingSecretHelp: 'Non-custodial: credentials are never sent to external servers or stored in localStorage.',
      connectedWallet: 'Connected Lightning Wallet',
      supportedMethods: 'Supported NWC Methods:',
      lightningBalance: 'Live Lightning Balance',
      createInvoiceTitle: 'Receive Satoshis (BOLT-11 Invoice)',
      createInvoiceDesc: 'Generate a real Lightning invoice to receive payments.',
      amountLabel: 'Amount (in satoshis)',
      memoLabel: 'Description / Memo',
      generateInvoiceBtn: 'Generate Invoice',
      generatingInvoiceBtn: 'Generating…',
      invoiceReady: 'BOLT-11 Invoice Ready',
      copyInvoice: 'Copy Invoice',
      copied: 'Copied!',
      awaitingPayment: 'Awaiting payment (live verification polling)…',
      paymentReceived: 'Payment received successfully!',
    },
    security: {
      title: 'Security Center & Risk Guardian',
      subtitle: 'Zero private key handling, strict privacy gateway, and verified scam blacklist checking (Zafy).',
      badge: 'Read-Only Guard',
      readOnlyTitle: '100% Read-Only Guarantee',
      readOnlyDesc: 'BTC Copilot never requests, stores, or processes private keys, seed phrases, or wallet passwords. Transactions cannot be broadcast or signed.',
      privacyGatewayTitle: 'Privacy Gateway Boundary',
      privacyGatewayDesc: 'Public addresses and transaction IDs are truncated before AI calls. Financial metrics are aggregated to minimize linkability.',
      serverCredsTitle: 'Isolated Server Credentials',
      serverCredsDesc: 'Mistral and Gemini API keys reside exclusively in server-side environment variables. Zero secrets delivered to the browser bundle.',
      matrixTitle: 'Privacy Gateway Data Sanitization Matrix',
      matrixDesc: 'Audit log of what information is shared with external AI providers versus what is blocked.',
      thDataElement: 'Data Element',
      thGatewayTreatment: 'Gateway Treatment',
      thTransmitted: 'Transmitted to AI?',
      thSecurityRationale: 'Security Rationale',
      badgeNever: 'NEVER',
      badgeShortened: 'Shortened Only',
      badgeSanitized: 'Sanitized',
      badgeYes: 'Yes (Sanitized)',
      // Verification & Risk Guardian
      riskVerifierTitle: 'Address & Risk Guardian (Zafy-style)',
      riskVerifierDesc: 'Verify any Bitcoin address before sending funds. Results are checked against verified scam databases.',
      verifyInputPlaceholder: 'Paste a Bitcoin address to check (e.g. bc1q..., 1..., 3...)',
      verifyBtn: 'Verify Address',
      verifyingBtn: 'Analyzing…',
      statusRiskIdentified: 'Risk Identified',
      statusWarning: 'Warning',
      statusNoMatch: 'No Match Found',
      statusInsufficient: 'Insufficient Data',
      disclaimer: 'Critical Disclaimer: The absence of a report in known scam databases does NOT guarantee an address is 100% safe. Always verify your recipient through independent channels.',
      sourceLabel: 'Verified sources:',
      verifiedAtLabel: 'Checked at:',
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'Configure language, monitoring thresholds, and assistant preferences.',
      resetDefaults: 'Reset Defaults',
      walletConfigTitle: 'Wallet Configuration',
      walletConfigDesc: 'Manage active wallet address and demonstration mode',
      demoModeLabel: 'Demonstration Mode',
      demoModeDesc: 'Pre-load Satoshi Genesis address for hackathon testing',
      storageBackendLabel: 'Storage Backend',
      storageBackendDesc: 'Client-side localStorage (no personal data stored on servers)',
      aiOrchestrationTitle: 'AI Provider Orchestration',
      aiOrchestrationDesc: 'Dual-provider failover and availability controls',
      primaryProviderLabel: 'Primary Provider',
      primaryProviderDesc: 'Google Gemini (gemini-3.5-flash-lite / fast and reliable)',
      fallbackProviderLabel: 'Autonomous Local Fallback',
      fallbackProviderDesc: 'Deterministic offline rule engine (100% uptime with zero keys)',
      badgeActive: 'Active',
      badgeDefault: 'Default',
      badgeStandby: 'Standby',
      languageTitle: 'Interface Language',
      languageDesc: 'Switch easily between French and English',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: translations.fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('btc-copilot-lang') as Language | null;
      if (saved === 'fr' || saved === 'en') {
        setLanguageState(saved);
      }
    } catch {}
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('btc-copilot-lang', lang);
    } catch {}
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
