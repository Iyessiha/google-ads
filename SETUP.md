# Google Ads Automation Client

Client TypeScript réutilisable pour automatiser tes campagnes Google Ads à travers tous tes SaaS (ProfityX, SINOVA, TivyX, ASILI).

## Setup (5 min)

### 1. Clone ou copie les fichiers

```bash
# Dans ton projet Vercel existant
cp google-ads-client.ts lib/
cp api-campaigns-*.ts pages/api/campaigns/
cp .env.example .env.local
```

### 2. Remplis les variables d'env

Ouvre `~/Documents/google-ads-setup/.env` sur ton Mac et copie les 4 valeurs dans `.env.local` :

```env
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...
GOOGLE_ADS_CUSTOMER_ID=266527474700
```

### 3. Installe les dépendances

```bash
npm install
```

### 4. Test en local

```bash
npm run dev
# Puis : curl http://localhost:3000/api/campaigns
```

### 5. Déploie sur Vercel

```bash
vercel env add GOOGLE_ADS_CLIENT_ID
vercel env add GOOGLE_ADS_CLIENT_SECRET
vercel env add GOOGLE_ADS_REFRESH_TOKEN
vercel env add GOOGLE_ADS_CUSTOMER_ID
vercel deploy
```

## Endpoints disponibles

### GET /api/campaigns
Liste toutes tes campagnes

```bash
curl https://ton-app.vercel.app/api/campaigns
```

### POST /api/campaigns/create
Crée une nouvelle campagne

```bash
curl -X POST https://ton-app.vercel.app/api/campaigns/create \
  -H "Content-Type: application/json" \
  -d '{"name": "ProfityX - Sept 2026", "budget_usd": 100}'
```

## Utiliser avec Claude

Depuis Claude Cloud, appelle tes endpoints :

```typescript
const campaigns = await fetch('https://ton-app.vercel.app/api/campaigns')
  .then(r => r.json());
```

Ou intègre comme un serveur MCP local (voir bonus).

## Extensible

Le client supporte aussi :
- `updateCampaignStatus()` - Mettre en pause/activer une campagne
- `getCampaignStats()` - Statistiques d'une campagne
- `mutate()` - Actions custom via l'API Google Ads

## Bonus: Serveur MCP local

Pour utiliser comme serveur MCP que Claude peut appeler directement :

```typescript
// mcp-server.ts
import { createGoogleAdsClient } from "./lib/google-ads-client";

const client = createGoogleAdsClient();

export async function handleCampaignRequest(action: string, params: any) {
  switch (action) {
    case "list":
      return await client.getCampaigns();
    case "create":
      return await client.createCampaign(params);
    case "update_status":
      return await client.updateCampaignStatus(params.id, params.status);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
```

Puis configure dans `~/.claude/config.json` pour le faire tourner localement.

## Support

Questions ? Regarde :
- https://developers.google.com/google-ads/api/docs/start
- Les types TypeScript du client pour les actions possibles
