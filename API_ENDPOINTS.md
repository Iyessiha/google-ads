# API Endpoints Complets

## 📋 Index de Tous les Endpoints

### Campagnes
- `GET /api/campaigns` - Lister toutes les campagnes
- `POST /api/campaigns/create` - Créer une campagne
- `PUT /api/campaigns/:id/status` - Modifier le statut (ENABLED/PAUSED)

### Budgets
- `POST /api/budgets/create` - Créer un budget
- `PUT /api/budgets/:id/update` - Modifier un budget

### Groupes d'Annonces
- `POST /api/ad-groups/create` - Créer un groupe d'annonces
- `GET /api/ad-groups/:campaignId` - Lister les groupes d'une campagne

### Keywords
- `POST /api/keywords/add` - Ajouter des keywords
- `GET /api/keywords/:adGroupId` - Lister les keywords d'un groupe
- `POST /api/keywords/negative` - Ajouter des negative keywords

### Annonces
- `POST /api/ads/create` - Créer une annonce Search
- `GET /api/ads/:adGroupId` - Lister les annonces d'un groupe

### Audiences
- `POST /api/audiences/create` - Créer une audience
- `GET /api/audiences` - Lister toutes les audiences

### Conversions
- `POST /api/conversions/offline` - Envoyer une conversion offline

### Rapports
- `GET /api/reports/performance` - Rapport de performance (30 jours)
- `GET /api/reports/roi` - Analyse ROI par campagne
- `GET /api/reports/keywords` - Performance des keywords

### Stratégies d'Enchères
- `POST /api/bidding/create-strategy` - Créer une stratégie d'enchères

---

## 🚀 Démarrage Rapide

### 1. Configuration
```bash
# Copier le template des variables d'environnement
cp .env.example .env.local

# Ajouter les credentials
echo "GOOGLE_ADS_CLIENT_ID=YOUR_CLIENT_ID" >> .env.local
echo "GOOGLE_ADS_CLIENT_SECRET=YOUR_CLIENT_SECRET" >> .env.local
echo "GOOGLE_ADS_REFRESH_TOKEN=YOUR_REFRESH_TOKEN" >> .env.local
```

### 2. Installation
```bash
npm install
npm run dev
```

### 3. Tester un endpoint
```bash
# Lister les campagnes
curl http://localhost:3000/api/campaigns
```

---

## 💼 Cas d'Usage par SaaS

### ProfityX (Comptabilité)
```
Campagne → Groupes → Keywords:
  - "logiciel comptabilité"
  - "gestion finances PME"
  - "factures électroniques"
```

### SINOVA (CRM)
```
Campagne → Groupes → Keywords:
  - "crm cloud"
  - "gestion client"
  - "automation ventes"
```

### TivyX (Gestion Temps)
```
Campagne → Groupes → Keywords:
  - "feuille de temps"
  - "suivi heures"
  - "gestion projet"
```

### ASILI (RH)
```
Campagne → Groupes → Keywords:
  - "logiciel RH"
  - "paie cloud"
  - "gestion talents"
```

---

## 🔄 Workflow Recommandé

1. **Créer la Campagne**
   ```
   POST /api/campaigns/create
   ```

2. **Créer Groupe d'Annonces**
   ```
   POST /api/ad-groups/create
   ```

3. **Ajouter Keywords**
   ```
   POST /api/keywords/add
   ```

4. **Créer Annonces (PAUSED)**
   ```
   POST /api/ads/create
   ```

5. **Réviser et Activer**
   ```
   PUT /api/campaigns/:id/status → ENABLED
   ```

6. **Monitorer Performances**
   ```
   GET /api/reports/performance
   GET /api/reports/roi
   ```

---

## 📊 Formats de Données

### Budget en Micros
- 1 USD = 1,000,000 micros
- $5.00 = 5,000,000 micros
- $0.01 = 10,000 micros

### Dates pour Conversions
Format: `"YYYY-MM-DD HH:MM:SS+TZ"`
Exemple: `"2026-10-20 15:30:00+02:00"`

### Match Types Keywords
- `EXACT` - Correspondance exacte
- `PHRASE` - L'expression doit être présente
- `BROAD` - Variantes du mot-clé autorisées

---

## ⚠️ Limites et Bonnes Pratiques

| Limite | Valeur |
|--------|--------|
| Campagnes par compte | Illimité |
| Groupes par campagne | Illimité |
| Keywords par groupe | 10,000 |
| Annonces par groupe | 300 |
| Budgets minimum | $1/jour |
| Enchère minimum | $0.01 par clic |

---

## 🆘 Dépannage

### Erreur: "Authorization access_token missing"
- Vérifier `GOOGLE_ADS_REFRESH_TOKEN` dans `.env.local`
- Token expiré? Réexécuter le script OAuth

### Erreur: "INVALID_PARAMETER_VALUE"
- Vérifier le format des données
- Vérifier que les IDs existent (campaign_id, ad_group_id, etc.)

### Erreur: "RESOURCE_NOT_FOUND"
- L'ID n'existe pas ou a été supprimé
- Utiliser un endpoint de listing pour vérifier

---

## 📱 Automatisation à Travers les SaaS

Les endpoints peuvent être utilisés pour automatiser les actions de tous les SaaS:

```typescript
// Pseudo-code pour automatisation multi-produit
for (const saas of [ProfityX, SINOVA, TivyX, ASILI]) {
  // 1. Créer campagne par SaaS
  const campaign = await createCampaign(saas.name);
  
  // 2. Créer groupes par catégorie
  for (const category of saas.categories) {
    const adGroup = await createAdGroup(campaign.id, category);
    
    // 3. Ajouter keywords
    await addKeywords(adGroup.id, category.keywords);
    
    // 4. Créer annonces
    await createAd(adGroup.id, saas.ads[category]);
  }
  
  // 5. Monitorer performances
  const roi = await getCampaignROI(campaign.id);
}
```

---

Voir [ACTIONS.md](./ACTIONS.md) pour la documentation détaillée de chaque action.
