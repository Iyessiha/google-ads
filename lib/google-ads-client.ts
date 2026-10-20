/**
 * Google Ads API Client
 * Réutilisable pour tous tes SaaS (ProfityX, SINOVA, TivyX, ASILI)
 */

interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string; // Sans tirets: 266527474700
}

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class GoogleAdsClient {
  private config: GoogleAdsConfig;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: GoogleAdsConfig) {
    this.config = config;
  }

  /**
   * Obtient un access token valide
   * Renouvelle automatiquement si expiré
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.config.refreshToken,
        grant_type: "refresh_token",
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data: AccessTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000; // 1 min buffer

    return this.accessToken;
  }

  /**
   * Requête GET générique à l'API Google Ads
   */
  async request<T>(
    path: string,
    query?: Record<string, string>
  ): Promise<T> {
    const token = await this.getAccessToken();
    const url = new URL(`https://googleads.googleapis.com/v16/${path}`);

    if (query) {
      Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, v));
    }

    const response = await fetch(url.toString(), {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Developer-Token": "", // Pas nécessaire pour OAuth
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Requête MUTATE à l'API Google Ads (créer, modifier, supprimer)
   */
  async mutate<T>(
    path: string,
    operations: any[]
  ): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(`https://googleads.googleapis.com/v16/${path}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operations }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mutation failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Lister les campagnes
   */
  async getCampaigns() {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign_budget.total_amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros
      FROM campaign
      WHERE campaign.status != REMOVED
      LIMIT 100
    `;

    return this.request("customers/" + this.config.customerId + "/googleAds:search", {
      query,
    });
  }

  /**
   * Créer une nouvelle campagne
   */
  async createCampaign(data: {
    name: string;
    budget_micros: number; // e.g., 1000000 = $10
    type?: string;
  }) {
    const operations = [
      {
        create: {
          campaign: {
            name: data.name,
            status: "PAUSED", // Toujours créer en pause
            advertising_channel_type: "SEARCH",
            campaign_budget: {
              amount_micros: data.budget_micros,
            },
          },
        },
      },
    ];

    return this.mutate(
      `customers/${this.config.customerId}/campaigns:create`,
      operations
    );
  }

  /**
   * Modifier le statut d'une campagne
   */
  async updateCampaignStatus(campaignId: string, status: "ENABLED" | "PAUSED") {
    const operations = [
      {
        update: {
          resource_name: `customers/${this.config.customerId}/campaigns/${campaignId}`,
          campaign: { status },
        },
      },
    ];

    return this.mutate(
      `customers/${this.config.customerId}/campaigns:mutate`,
      operations
    );
  }

  /**
   * Obtenir les statistiques d'une campagne
   */
  async getCampaignStats(campaignId: string) {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        segments.date
      FROM campaign
      WHERE campaign.id = ${campaignId}
    `;

    return this.request(`customers/${this.config.customerId}/googleAds:search`, {
      query,
    });
  }
}

/**
 * Factory function pour créer le client depuis les variables d'env
 */
export function createGoogleAdsClient(): GoogleAdsClient {
  return new GoogleAdsClient({
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  });
}
