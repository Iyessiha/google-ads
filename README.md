# 🚀 Google Ads Automation Client

Plateforme complète d'automatisation Google Ads pour MonWe Infinity LLC (ProfityX, SINOVA, TivyX, ASILI).

## ✨ Fonctionnalités

### 🎯 Gestion des Campagnes
- ✅ Créer, lister, modifier les campagnes
- ✅ Gérer les budgets (créer, mettre à jour)
- ✅ Contrôler le statut (ENABLED/PAUSED)

### 👥 Groupes d'Annonces et Keywords
- ✅ Créer des groupes d'annonces
- ✅ Ajouter des keywords avec match types (EXACT, PHRASE, BROAD)
- ✅ Ajouter des negative keywords
- ✅ Lister et analyser les performances

### 📢 Annonces
- ✅ Créer des annonces Search
- ✅ Lister les annonces par groupe
- ✅ Modifier le statut des annonces

### 👤 Audiences
- ✅ Créer des audiences personnalisées
- ✅ Lister toutes les audiences
- ✅ Support Customer Match

### 📈 Conversions et Reporting
- ✅ Envoyer des conversions offline
- ✅ Rapport de performance (30 jours)
- ✅ Analyse ROI par campagne
- ✅ Performance par keyword
- ✅ Stratégies d'enchères automatiques

### 🔐 Sécurité
- ✅ OAuth 2.0 avec renouvellement automatique
- ✅ Variables d'environnement
- ✅ Secrets protégés par GitHub

---

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Cloner le repo
git clone https://github.com/Iyessiha/google-ads.git
cd google-ads

# Installer les dépendances
npm install
```

### 2. Configuration

```bash
# Copier le template
cp .env.example .env.local

# Ajouter vos credentials Google
# GOOGLE_ADS_CLIENT_ID=...
# GOOGLE_ADS_CLIENT_SECRET=...
# GOOGLE_ADS_REFRESH_TOKEN=...
# GOOGLE_ADS_CUSTOMER_ID=266527474700
```

Voir [SETUP.md](./SETUP.md) pour les instructions détaillées de configuration OAuth.

### 3. Lancer localement

```bash
npm run dev
```

Accédez à `http://localhost:3000` 🎉

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Configuration OAuth et déploiement
- **[ACTIONS.md](./ACTIONS.md)** - Toutes les actions avec exemples
- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Index des endpoints

---

## 🔗 Endpoints Disponibles

### Campagnes
```
GET  /api/campaigns
POST /api/campaigns/create
PUT  /api/campaigns/:id/status
```

### Groupes & Keywords
```
POST /api/ad-groups/create
GET  /api/ad-groups/:campaignId
POST /api/keywords/add
GET  /api/keywords/:adGroupId
POST /api/keywords/negative
```

### Annonces
```
POST /api/ads/create
GET  /api/ads/:adGroupId
```

### Audiences
```
POST /api/audiences/create
GET  /api/audiences
```

### Conversions & Rapports
```
POST /api/conversions/offline
GET  /api/reports/performance
GET  /api/reports/roi
GET  /api/reports/keywords
```

Voir [API_ENDPOINTS.md](./API_ENDPOINTS.md) pour la liste complète.

---

## 💡 Exemples d'Utilisation

### Créer une campagne complète

```bash
# 1. Créer la campagne
curl -X POST http://localhost:3000/api/campaigns/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Campagne Q1",
    "budget_usd": 5000
  }'

# 2. Créer un groupe
curl -X POST http://localhost:3000/api/ad-groups/create \
  -H "Content-Type: application/json" \
  -d '{
    "campaign_id": "123456",
    "name": "Groupe Principal",
    "cpc_bid_micros": 1500000
  }'

# 3. Ajouter keywords
curl -X POST http://localhost:3000/api/keywords/add \
  -H "Content-Type: application/json" \
  -d '{
    "ad_group_id": "456789",
    "keywords": [
      {"text": "logiciel comptabilité", "match_type": "EXACT"},
      {"text": "gestion finances", "match_type": "PHRASE"}
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
    "description": "Gérez vos finances sans prise de tête."
  }'
```

### Analyser les performances

```bash
# ROI par campagne
curl http://localhost:3000/api/reports/roi

# Performance par keyword
curl http://localhost:3000/api/reports/keywords?campaignId=123456
```

---

## 🏗️ Architecture

```
google-ads-client/
├── lib/
│   ├── google-ads-client.ts           # Client principal
│   └── google-ads-client-extended.ts  # Actions avancées
├── pages/api/
│   ├── campaigns/                     # Campagnes
│   ├── ad-groups/                     # Groupes d'annonces
│   ├── keywords/                      # Keywords
│   ├── ads/                           # Annonces
│   ├── audiences/                     # Audiences
│   ├── conversions/                   # Conversions
│   ├── budgets/                       # Budgets
│   └── reports/                       # Rapports
├── types.ts                           # Types TypeScript
├── package.json
├── SETUP.md
├── ACTIONS.md
└── API_ENDPOINTS.md
```

---

## 🔄 Flux de Travail Recommandé

1. **Créer Campagne** → `POST /api/campaigns/create`
2. **Créer Groupe** → `POST /api/ad-groups/create`
3. **Ajouter Keywords** → `POST /api/keywords/add`
4. **Créer Annonces (PAUSED)** → `POST /api/ads/create`
5. **Réviser** → Vérifier dans Google Ads Manager
6. **Activer** → `PUT /api/campaigns/:id/status`
7. **Monitorer** → `GET /api/reports/roi`

---

## 📊 Cas d'Usage par SaaS

### ProfityX (Comptabilité)
```
Campagnes:
  - Comptabilité Cloud
  - Facturation électronique
  - Gestion Trésorerie

Keywords:
  - logiciel comptabilité
  - gestion finances PME
  - bilans comptables
```

### SINOVA (CRM)
```
Campagnes:
  - CRM Cloud
  - Automation Ventes
  - Customer Success

Keywords:
  - crm cloud
  - gestion client
  - automation workflow
```

### TivyX (Gestion Temps)
```
Campagnes:
  - Feuille de Temps
  - Gestion Projet
  - Time Tracking

Keywords:
  - suivi heures
  - feuille de temps
  - gestion projet cloud
```

### ASILI (RH)
```
Campagnes:
  - Logiciel RH
  - Paie Cloud
  - Gestion Talents

Keywords:
  - logiciel rh
  - paie cloud
  - gestion talents
```

---

## 🚀 Déploiement

### Sur Vercel

```bash
# Déployer
vercel

# Ajouter les variables d'environnement dans Vercel
# Settings → Environment Variables
```

Voir [SETUP.md](./SETUP.md) pour les instructions complètes.

---

## 🔐 Sécurité

- ✅ OAuth 2.0 automatique
- ✅ Variables d'environnement (.env.local)
- ✅ Token auto-renewal (buffer de 1 minute)
- ✅ GitHub push protection pour les secrets
- ✅ Jamais committer les credentials

---

## 📞 Support

Pour les questions sur:
- **Configuration OAuth**: Voir [SETUP.md](./SETUP.md)
- **API Actions**: Voir [ACTIONS.md](./ACTIONS.md)
- **Endpoints**: Voir [API_ENDPOINTS.md](./API_ENDPOINTS.md)

---

## 📜 Licence

MIT - MonWe Infinity LLC

---

## 👨‍💻 Développé par

**Claude Haiku 4.5** avec ❤️ pour **Qi (MonWe Infinity LLC)**

---

## 🔗 Ressources

- [Google Ads API v16 Docs](https://developers.google.com/google-ads/api/docs)
- [GAQL Reference](https://developers.google.com/google-ads/api/fields/v16/overview)
- [Google Ads Manager](https://ads.google.com)

---

**✨ Dernière mise à jour: Octobre 2026**
