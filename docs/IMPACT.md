# Impact Local & Régional — BTC Copilot

## 1. Cible Utilisateur Principale

La cible prioritaire de BTC Copilot est constituée par les **commerçants de proximité, artisans et travailleurs indépendants** souhaitant accepter des paiements en Bitcoin et Lightning sans subir la complexité technique ni confier leurs clés à des banques ou plateformes custodiales centralisées.

---

## 2. Problème Concret Identifié

Dans de nombreuses régions, l'adoption de Bitcoin au point de vente se heurte à trois barrières majeures :
1. **L'incompréhension des délais et des frais** : Pourquoi une transaction on-chain met-elle 20 minutes ? Pourquoi les frais varient-ils ?
2. **La peur de l'erreur financière** : L'angoisse de recevoir un montant erroné ou d'être victime d'une double dépense / dust attack.
3. **Le manque de support d'assistance immédiat** : Un commerçant seul à sa caisse n'a personne pour lui expliquer un statut de paiement bloqué.

---

## 3. Cas d'Usage Concret : Encaissement & Réconciliation au Point de Vente

```
Commerçant / Client 
       │
       ▼
Génération Facture Lightning via BTC Copilot (NWC)
       │
       ▼
Client règle en 2 secondes avec son wallet mobile
       │
       ▼
BTC Copilot confirme la réception et notifie le commerçant
       │
       ▼
En cas d'anomalie (montant inhabituel, frais anormaux on-chain) :
L'IA explique immédiatement le phénomène en français/anglais sans jargon
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
