# Script de Démonstration (3 Minutes) — BTC Copilot

Ce scénario est spécialement conçu pour le jury du Hackathon afin de présenter une démonstration fluide, sans temps mort et directement alignée sur les critères d'évaluation.

---

## ⏱️ Minute 0:00 - 0:30 — Le Problème (30 secondes)
* **Accroche** : "Pour un commerçant, un travailleur indépendant ou un débutant, utiliser Bitcoin et Lightning reste intimidant. Les explorateurs de blocs sont remplis de jargon incompréhensible (UTXO, mempool congestion, scriptpubkeys), et vérifier la bonne réception d'un paiement Lightning nécessite souvent de jongler entre plusieurs outils complexes sans comprendre ce qui se passe."
* **Impact** : "Ce manque de lisibilité crée de l'anxiété, ralentit l'adoption locale et expose les utilisateurs à des erreurs évitables."

---

## ⏱️ Minute 0:30 - 1:00 — La Solution BTC Copilot (30 secondes)
* **Présentation** : "Voici BTC Copilot : le copilote intelligent et non-custodial qui connecte votre wallet Bitcoin et Lightning à une intelligence artificielle sécurisée."
* **Piliers clés** :
  1. Connexion non-custodiale via **Nostr Wallet Connect (NWC - NIP-47)** : zéro détention de clé.
  2. Moteur de surveillance statistique déterministe (zéro hallucination financière).
  3. Assistant IA bilingue débutant/professionnel pour démystifier chaque mouvement.

---

## ⏱️ Minute 1:00 - 2:15 — Démonstration Live (75 secondes)

### Action 1 : Connexion Réelle Lightning (NWC)
1. Ouvrir l'onglet **Lightning & NWC**.
2. Montrer la connexion instantanée à un wallet Lightning sans confier de clé privée.
3. Afficher le solde réel en satoshis.
4. Générer une véritable facture Lightning BOLT-11 (ex: 2 100 sats pour un café ou une prestation).
5. Montrer le polling temps réel qui attend le paiement.

### Action 2 : Dashboard On-Chain & Clarté
1. Revenir sur le **Dashboard**.
2. Charger le wallet de démonstration (Adresse Satoshi Genesis ou adresse commerçante).
3. Montrer la séparation nette : solde confirmé vs transactions en mempool, estimations de frais en temps réel (sat/vB).

### Action 3 : Explication Assistée par l'IA
1. Cliquer sur "Explain" sur une transaction.
2. Basculer entre le mode **Beginner** (analogie claire, vulgarisation des frais) et **Professional** (analyse UTXO, script Taproot/SegWit).

---

## ⏱️ Minute 2:15 - 2:45 — Impact Local & Régional (30 secondes)
* "Pour les petits commerces locaux et les freelances, BTC Copilot agit comme un terminal de caisse et un comptable intelligent :
  * Encaissement instantané à frais quasi-nuls via Lightning.
  * Détection automatique des paiements inhabituels sans frais d'infrastructure lourds.
  * Autonomie complète sans dépendre d'un intermédiaire bancaire."

---

## ⏱️ Minute 2:45 - 3:00 — Conclusion & Roadmap FOSS (15 secondes)
* "BTC Copilot est 100% open source, respecte la vie privée grâce à sa Privacy Gateway, et fait le pont entre le protocole Nostr, le réseau Bitcoin et l'IA générative. Merci !"
