# Google Ads Automation - Toutes les Actions Disponibles

Documentation complète de tous les endpoints et actions implémentées.

## 📊 Campagnes

### GET `/api/campaigns` - Lister toutes les campagnes
**Description:** Récupère la liste de toutes les campagnes avec métriques

**Réponse:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "campaign": {
          "id": "123456",
          "name": "Q4 Sale Campaign",
          "status": "ENABLED"
        },
        "metrics": {
          "impressions": "5000",
          "clicks": "150",
          "cost_micros": "450000000"
        }
      }
    ]
  }
}
```

### POST `/api/campaigns/create` - Créer une campagne
**Champs requis:**
- `name` (string): Nom de la campagne
- `budget_usd` (number): Budget en USD

**Exemple:**
```json
{
  "name": "Nouvelle Campagne Q1",
  "budget_usd": 5000
}
```

### PUT `/api/campaigns/:campaignId/status` - Modifier le statut
**Champs requis:**
- `status` (string): "ENABLED" ou "PAUSED"

---

## 💰 Budgets

### POST `/api/budgets/create` - Créer un budget
**Champs requis:**
- `name` (string): Nom du budget
- `amount_micros` (number): Montant en micros (1$ = 1,000,000 micros)

**Exemple:**
```json
{
  "name": "Budget ProfityX - Septembre",
  "amount_micros": 5000000000
}
```

### PUT `/api/budgets/:budgetId/update` - Modifier un budget
**Champs requis:**
- `amount_micros` (number): Nouveau montant

---

## 👥 Groupes d'Annonces

### POST `/api/ad-groups/create` - Créer un groupe d'annonces
**Champs requis:**
- `campaign_id` (string): ID de la campagne
- `name` (string): Nom du groupe d'annonces
- `cpc_bid_micros` (number, optionnel): Enchère par clic

**Exemple:**
```json
{
  "campaign_id": "123456",
  "name": "Groupe - Ventes",
  "cpc_bid_micros": 1500000
}
```

### GET `/api/ad-groups/:campaignId` - Lister les groupes d'une campagne

---

## 🔍 Mots-clés (Keywords)

### POST `/api/keywords/add` - Ajouter des keywords
**Champs requis:**
- `ad_group_id` (string): ID du groupe d'annonces
- `keywords` (array): Liste des mots-clés

**Exemple:**
```json
{
  "ad_group_id": "456789",
  "keywords": [
    {
      "text": "logiciel comptabilité",
      "match_type": "EXACT",
      "bid_micros": 1500000
    },
    {
      "text": "gestion finances",
      "match_type": "PHRASE",
      "bid_micros": 1200000
    }
  ]
}
```

**Match types:** 
- `EXACT` - Correspond exactement au terme de recherche
- `PHRASE` - Correspond à l'expression dans la recherche
- `BROAD` - Correspond à des variantes du mot-clé

### GET `/api/keywords/:adGroupId` - Lister les keywords d'un groupe

### POST `/api/keywords/negative` - Ajouter des negative keywords
Exclut certains mots-clés des recherches
```json
{
  "ad_group_id": "456789",
  "keywords": [
    {
      "text": "gratuit",
      "match_type": "EXACT"
    },
    {
      "text": "pirate",
      "match_type": "BROAD"
    }
  ]
}
```

---

## 📢 Annonces

### POST `/api/ads/create` - Créer une annonce Search
**Champs requis:**
- `ad_group_id` (string): ID du groupe d'annonces
- `final_url` (string): URL de destination
- `headline1` (string): Premier titre (max 30 caractères)
- `headline2` (string): Deuxième titre (max 30 caractères)
- `description` (string): Description (max 90 caractères)

**Exemple:**
```json
{
  "ad_group_id": "456789",
  "final_url": "https://profityx.com/comptabilite",
  "headline1": "Comptabilité Simple",
  "headline2": "Pour PME",
  "description": "Gérez votre comptabilité sans prise de tête. Essai gratuit 30 jours."
}
```

⚠️ **Note:** Les annonces sont créées en **PAUSED** par défaut pour révision

### GET `/api/ads/:adGroupId` - Lister les annonces d'un groupe

---

## 👤 Audiences Personnalisées

### POST `/api/audiences/create` - Créer une audience
**Champs requis:**
- `name` (string): Nom de l'audience
- `description` (string, optionnel): Description
- `membership_status` (string, optionnel): "OPEN" ou "CLOSED"

**Exemple:**
```json
{
  "name": "Clients ProfityX",
  "description": "Liste de clients actuels",
  "membership_status": "CLOSED"
}
```

### GET `/api/audiences` - Lister toutes les audiences

---

## 📈 Conversions Offline

### POST `/api/conversions/offline` - Envoyer une conversion offline
Tracker les ventes hors ligne (magasin physique, appels téléphoniques, etc.)

**Champs requis:**
- `gclid` (string): Google Click ID depuis la visite
- `conversion_action_id` (string): ID de l'action de conversion
- `conversion_date_time` (string): Date/heure au format "YYYY-MM-DD HH:MM:SS+TZ"
- `conversion_value` (number, optionnel): Valeur de la conversion
- `currency_code` (string, optionnel): Code devise (défaut: USD)

**Exemple:**
```json
{
  "gclid": "CjwKCAjw_uKmBhADEiwAsTmqAI-...",
  "conversion_action_id": "987654",
  "conversion_date_time": "2026-10-20 15:30:00+02:00",
  "conversion_value": 299.99,
  "currency_code": "USD"
}
```

---

## 📊 Rapports Avancés

### GET `/api/reports/performance` - Rapport de performance
Affiche les métriques par campagne pour les 30 derniers jours

**Réponse inclut:**
- Impressions
- Clics
- Coûts
- Conversions
- Valeur de conversion

### GET `/api/reports/roi` - Analyse ROI
Calcule le ROI (retour sur investissement) par campagne

**Réponse inclut:**
```json
{
  "calculated_roi": [
    {
      "campaign_id": "123456",
      "campaign_name": "Q4 Sale",
      "cost": 5000,
      "revenue": 25000,
      "roi": 4.0
    }
  ]
}
```

### GET `/api/reports/keywords?campaignId=123456` - Rapport keywords
Performance détaillée par mot-clé

---

## ⚙️ Stratégies d'Enchères

### POST `/api/bidding/create-strategy` - Créer une stratégie
**Champs requis:**
- `name` (string): Nom de la stratégie
- `type` (string): Type de stratégie

**Types disponibles:**
- `MAXIMIZE_CONVERSIONS` - Maximiser les conversions
- `MAXIMIZE_CONVERSION_VALUE` - Maximiser la valeur de conversion
- `TARGET_CPA` - Coût par acquisition cible
- `ENHANCED_CPC` - Coût par clic amélioré

**Exemple:**
```json
{
  "name": "Stratégie - Maximiser Conversions",
  "type": "MAXIMIZE_CONVERSIONS"
}
```

Pour TARGET_CPA, ajouter:
```json
{
  "target_cpa_micros": 1000000
}
```

---

## 📝 Exemples d'Utilisation Complets

### Cas 1: Créer une campagne complète

```bash
# 1. Créer la campagne
curl -X POST http://localhost:3000/api/campaigns/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Automne 2026",
    "budget_usd": 5000
  }'
# Récupère campaign_id: "123456"

# 2. Créer un groupe d'annonces
curl -X POST http://localhost:3000/api/ad-groups/create \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_id": "123456",
    "name": "Groupe Principal",
    "cpc_bid_micros": 1500000
  }'
# Récupère ad_group_id: "456789"

# 3. Ajouter des keywords
curl -X POST http://localhost:3000/api/keywords/add \
  -H "Content-Type: application/json" \
  -d '{
    "ad_group_id": "456789",
    "keywords": [
      {"text": "comptabilité simple", "match_type": "PHRASE"},
      {"text": "gestion trésorerie", "match_type": "EXACT"}
    ]
  }'

# 4. Créer une annonce
curl -X POST http://localhost:3000/api/ads/create \
  -H "Content-Type: application/json" \
  -d '{
    "ad_group_id": "456789",
    "final_url": "https://profityx.com",
    "headline1": "Comptabilité Simple",
    "headline2": "Essai Gratuit 30j",
    "description": "Gérez vos finances simplement. Intégration bancaire incluse."
  }'
```

### Cas 2: Tracker une vente offline

```bash
curl -X POST http://localhost:3000/api/conversions/offline \
  -H "Content-Type: application/json" \
  -d '{
    "gclid": "CjwKCAjw_uKmBhADEiwAsTmqAI-...",
    "conversion_action_id": "987654",
    "conversion_date_time": "2026-10-20 14:30:00+02:00",
    "conversion_value": 599.99,
    "currency_code": "USD"
  }'
```

### Cas 3: Analyser les performances

```bash
# Performance global
curl http://localhost:3000/api/reports/performance

# ROI par campagne
curl http://localhost:3000/api/reports/roi

# Performance par keyword
curl http://localhost:3000/api/reports/keywords?campaignId=123456
```

---

## 🔐 Sécurité

- Toutes les opérations utilisent OAuth 2.0
- Les tokens sont renouvelés automatiquement
- Les credentials doivent être stockés dans `.env.local`
- Jamais committer les credentials en dur

---

## 💡 Conseils Pratiques

1. **Toujours créer les annonces en PAUSED** - Révise d'abord avant de passer en ENABLED
2. **Utiliser des negative keywords** - Exclue les mots-clés non pertinents
3. **Commencer petit** - Lance avec un petit budget, puis augmente progressivement
4. **Suivre le ROI** - Utilise les rapports pour optimiser les performances
5. **Tester les audiences** - Les audiences personnalisées sont puissantes pour le retargeting

---

## 📚 Ressources

- [Documentation Google Ads API v16](https://developers.google.com/google-ads/api/docs)
- [GAQL Reference](https://developers.google.com/google-ads/api/fields/v16/overview)
- [Setup Guide](./SETUP.md)
