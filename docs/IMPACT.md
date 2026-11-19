# Impact Local & Régional — BTC Copilot

## 1. Cible Utilisateur Principale

La cible prioritaire de BTC Copilot est constituée par les **particuliers, épargnants et utilisateurs débutants ou intermédiaires de Bitcoin** souhaitant comprendre leurs transactions, vérifier la sécurité de leurs adresses et éviter les pièges et arnaques sans confier leurs clés privées à un tiers.

---

## 2. Problème Concret Identifié

Dans de nombreuses régions, l'adoption quotidienne de Bitcoin se heurte à trois barrières majeures :
1. **L'incompréhension des délais et des frais** : Pourquoi une transaction on-chain met-elle 20 minutes ? Pourquoi les frais varient-ils selon la mempool ?
2. **La peur de l'erreur ou de l'arnaque** : L'angoisse d'envoyer des fonds vers une mauvaise adresse, de subir une attaque de traçage (dust attack) ou de payer 25% de frais involontairement.
3. **Le manque de support pédagogique fiable** : Un utilisateur isolé n'a personne pour lui expliquer simplement les termes techniques (UTXO, vBytes, RBF) sans jargon condescendant.

---

## 3. Cas d'Usage Concret : Surveillance & Accompagnement Pédagogique

```
Utilisateur / Adresse Publique
       │
       ▼
Analyse en lecture seule via BTC Copilot (Mempool Proxy)
       │
       ▼
Audit instantané : Détection d'anomalies, poussières dust, santé du wallet
       │
       ▼
L'assistant IA décrypte en direct les confirmations et les frais en langage clair
       │
       ▼
En cas de doute (adresse suspecte, frais excessifs) :
Recommandation d'attente ou alternative Lightning Network à 1 satoshi
```

---

## 4. Métriques Clés d'Impact (Sans chiffres fabriqués)

Pour mesurer objectivement l'impact de BTC Copilot lors de sa phase pilote, les indicateurs suivants sont intégrés :

1. **Wallets NWC connectés** : Nombre de commerçants connectant leur propre nœud/wallet non-custodial.
2. **Factures générées & réglées** : Volume de paiements Lightning traités sans passer par un intermédiaire commercial.
3. **Temps moyen de compréhension des alertes** : Réduction du temps nécessaire pour identifier la cause d'une transaction non confirmée.
4. **Questions posées au Copilot IA** : Identification des interrogations récurrentes pour alimenter les guides pédagogiques communautaires.

---

## 5. Hypothèses à Valider sur le Terrain

* *Hypothèse 1* : Les commerçants préfèrent une interface d'assistance conversationnelle intégrée plutôt que de chercher sur des forums techniques.
* *Hypothèse 2* : La standardisation de Nostr Wallet Connect (NIP-47) élimine la friction de configuration pour les utilisateurs de portefeuilles modernes (Alby Hub, Phoenix, Mutiny).
