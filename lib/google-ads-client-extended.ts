/**
 * Google Ads API Client - Extended
 * Actions avancées : budgets, audiences, conversions, keywords, ads, etc.
 *
 * Ajoute à google-ads-client.ts ou utilise directement
 */

import { GoogleAdsClient } from "./google-ads-client";

export class GoogleAdsClientExtended extends GoogleAdsClient {
  /**
   * ============================================
   * BUDGETS
   * ============================================
   */

  /**
   * Créer un nouveau budget
   */
  async createBudget(data: { name: string; amount_micros: number }) {
    const operations = [
      {
        create: {
          campaign_budget: {
            name: data.name,
            amount_micros: data.amount_micros,
            delivery_method: "STANDARD",
          },
        },
      },
    ];

    return this.mutate(
      `customers/${this.config.customerId}/campaign_budgets:create`,
      operations
    );
  }

  /**
   * Modifier le budget d'une campagne
   */
  async updateCampaignBudget(
    campaignId: string,
    budgetId: string,
    amount_micros: number
  ) {
    const operations = [
      {
        update: {
          resource_name: `customers/${this.config.customerId}/campaign_budgets/${budgetId}`,
          campaign_budget: { amount_micros },
          update_mask: "amount_micros",
        },
      },
    ];

    return this.mutate(
      `customers/${this.config.customerId}/campaign_budgets:mutate`,
      operations
    );
  }

  /**
   * ============================================
   * AUDIENCES
   * ============================================
   */

  /**
   * Créer une audience personnalisée
   */
  async createAudience(data: {
    name: string;
    description?: string;
    membership_status?: "OPEN" | "CLOSED";
  }) {
    const operations = [
      {
        create: {
          customer_match_user_list: {
            name: data.name,
            description: data.description || "",
            membership_status: data.membership_status || "CLOSED",
            upload_keyword_type: "CONTACT_INFO",
          },
        },
      },
    ];

    return this.mutate(
      `customers/${this.config.customerId}/customer_match_user_lists:create`,
      operations
    );
  }

  /**
   * Lister toutes les audiences
   */
  async listAudiences() {
    const query = `
      SELECT
        audience.id,
        audience.name,
        audience.type,
        audience.description,
        audience.status
      FROM audience
      WHERE audience.status != REMOVED
      LIMIT 100
    `;

    return this.request(`customers/${this.config.customerId}/googleAds:search`, {
      query,
    });
  }

  /**
   * ============================================
   * CONVERSIONS OFFLINE
   * ============================================
   */

  /**
   * Envoyer une conversion offline
   * Utile pour tracker les ventes en magasin, appels, etc.
   */
  async sendOfflineConversion(data: {
    gclid: string;
    conversion_action_id: string;
    conversion_date_time: string; // Format: "2026-10-20 15:00:00+02:00"
    conversion_value?: number;
    currency_code?: string;
  }) {
    const operations = [
      {
        create: {
          gclid_date_pair: {
            gclid: data.gclid,
            conversion_date_time: data.conversion_date_time,
          },
          conversion_action: `customers/${this.config.customerId}/conversion_actions/${data.conversion_action_id}`,
          conversion_date_time: data.conversion_date_time,
          conversion_value: data.conversion_value || 0,
          currency_code: data.currency_code || "USD",
        },
      },
    ];

    return this.mutate(
      `customers/${this.config.customerId}/offline_user_conversions:create`,
      operations
    );
  }

  /**
   * ============================================
   * AD GROUPS
   * ============================================
   */

  /**
   * Créer un groupe d'annonces
   */
  async createAdGroup(data: {
    campaign_id: string;
    name: string;
    cpc_bid_micros?: number;
  }) {
    const operations = [
      {
        create: {
          ad_group: {
            campaign: `customers/${this.config.customerId}/campaigns/${data.campaign_id}`,
            name: data.name,
            status: "ENABLED",
            cpc_bid_micros: data.cpc_bid_micros || 1000000, // $10 par défaut
          },
        },
      },
    ];

    return this.mutate(
      `customers/${this.config.customerId}/ad_groups:create`,
      operations
    );
  }

  /**
   * Lister les groupes d'annonces d'une campagne
   */
  async listAdGroups(campaignId: string) {
    const query = `
      SELECT
        ad_group.id,
        ad_group.name,
        ad_group.status,
        ad_group.type,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros
      FROM ad_group
      WHERE campaign.id = ${campaignId}
      AND ad_group.status != REMOVED
      LIMIT 100
    `;

    return this.request(`customers/${this.config.customerId}/googleAds:search`, {
      query,
    });
  }

  /**
   * ============================================
   * KEYWORDS
   * ============================================
   */

  /**
   * Ajouter des keywords à un groupe d'annonces
   */
  async addKeywords(data: {
    ad_group_id: string;
    keywords: Array<{
      text: string;
      match_type: "EXACT" | "PHRASE" | "BROAD";
      bid_micros?: number;
    }>;
  }) {
    const operations = data.keywords.map((kw) => ({
      create: {
        ad_group_criterion: {
          ad_group: `customers/${this.config.customerId}/ad_groups/${data.ad_group_id}`,
          keyword: {
            text: kw.text,
            match_type: kw.match_type,
          },
          status: "ENABLED",
          cpc_bid_micros: kw.bid_micros || 1000000,
        },
      },
    }));

    return this.mutate(
      `customers/${this.config.customerId}/ad_group_criteria:create`,
      operations
    );
  }

  /**
   * Lister les keywords d'un groupe d'annonces
   */
  async listKeywords(adGroupId: string) {
    const query = `
      SELECT
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group_criterion.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM ad_group_criterion
      WHERE ad_group.id = ${adGroupId}
      AND ad_group_criterion.type = KEYWORD
      LIMIT 500
    `;

    return this.request(`customers/${this.config.customerId}/googleAds:search`, {
      query,
    });
  }

  /**
   * ============================================
   * ADS
   * ============================================
   */

  /**
   * Créer une annonce Search
   */
  async createSearchAd(data: {
    ad_group_id: string;
    final_url: string;
    headline1: string;
    headline2: string;
    description: string;
  }) {
    const operations = [
      {
        create: {
          ad: {
            expanded_text_ad: {
              headline_part1: data.headline1,
              headline_part2: data.headline2,
              description: data.description,
              final_url: data.final_url,
            },
          },
          ad_group: `customers/${this.config.customerId}/ad_groups/${data.ad_group_id}`,
          status: "PAUSED", // Toujours créer en pause
        },
      },
    ];

    return this.mutate(
      `customers/${this.config.customerId}/ads:create`,
      operations
    );
  }

  /**
   * Lister les annonces d'un groupe
   */
  async listAds(adGroupId: string) {
    const query = `
      SELECT
        ad.id,
        ad.name,
        ad.type,
        ad.status,
        ad.expanded_text_ad.headline_part1,
        ad.expanded_text_ad.headline_part2,
        ad.expanded_text_ad.description,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM ad
      WHERE ad_group.id = ${adGroupId}
      LIMIT 100
    `;

    return this.request(`customers/${this.config.customerId}/googleAds:search`, {
      query,
    });
  }

  /**
   * ============================================
   * RAPPORTS AVANCÉS
   * ============================================
   */

  /**
   * Rapport: Performance par campagne (derniers 30 jours)
   */
  async getCampaignPerformance() {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversion_value_micros
      FROM campaign
      WHERE segments.date >= LAST_30_DAYS
      AND campaign.status != REMOVED
      ORDER BY segments.date DESC
    `;

    return this.request(`customers/${this.config.customerId}/googleAds:search`, {
      query,
    });
  }

  /**
   * Rapport: Performance par keyword
   */
  async getKeywordPerformance(campaignId?: string) {
    const campaignFilter = campaignId ? `AND campaign.id = ${campaignId}` : "";

    const query = `
      SELECT
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group.id,
        campaign.id,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversion_value_micros
      FROM ad_group_criterion
      WHERE ad_group_criterion.type = KEYWORD
      AND segments.date >= LAST_30_DAYS
      ${campaignFilter}
      ORDER BY metrics.cost_micros DESC
      LIMIT 1000
    `;

    return this.request(`customers/${this.config.customerId}/googleAds:search`, {
      query,
    });
  }

  /**
   * Rapport: ROI par campagne
   */
  async getCampaignROI() {
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        metrics.cost_micros,
        metrics.conversion_value_micros,
        segments.date
      FROM campaign
      WHERE segments.date >= LAST_30_DAYS
      AND campaign.status != REMOVED
    `;

    const data = await this.request(
      `customers/${this.config.customerId}/googleAds:search`,
      {
        query,
      }
    );

    // Calculate ROI
    return {
      ...data,
      calculated_roi: (data as any).results?.map((r: any) => ({
        campaign_id: r.campaign.id,
        campaign_name: r.campaign.name,
        cost: parseInt(r.metrics.cost_micros || "0") / 1_000_000,
        revenue: parseInt(r.metrics.conversion_value_micros || "0") / 1_000_000,
        roi:
          (parseInt(r.metrics.conversion_value_micros || "0") -
            parseInt(r.metrics.cost_micros || "0")) /
          parseInt(r.metrics.cost_micros || "1"),
      })),
    };
  }

  /**
   * ============================================
   * NEGATIVE KEYWORDS / EXCLUSIONS
   * ============================================
   */

  /**
   * Ajouter des negative keywords (exclure des recherches)
   */
  async addNegativeKeywords(data: {
    ad_group_id?: string;
    campaign_id?: string;
    keywords: Array<{
      text: string;
      match_type: "EXACT" | "PHRASE" | "BROAD";
    }>;
  }) {
    if (!data.ad_group_id && !data.campaign_id) {
      throw new Error("Must provide either ad_group_id or campaign_id");
    }

    const operations = data.keywords.map((kw) => ({
      create: {
        ad_group_criterion: data.ad_group_id
          ? {
              ad_group: `customers/${this.config.customerId}/ad_groups/${data.ad_group_id}`,
              negative: true,
              keyword: {
                text: kw.text,
                match_type: kw.match_type,
              },
            }
          : {
              campaign: `customers/${this.config.customerId}/campaigns/${data.campaign_id}`,
              negative: true,
              keyword: {
                text: kw.text,
                match_type: kw.match_type,
              },
            },
      },
    }));

    return this.mutate(
      `customers/${this.config.customerId}/ad_group_criteria:create`,
      operations
    );
  }

  /**
   * ============================================
   * BIDDING STRATEGY
   * ============================================
   */

  /**
   * Créer une stratégie d'enchères automatique
   */
  async createBiddingStrategy(data: {
    name: string;
    type:
      | "MAXIMIZE_CONVERSIONS"
      | "MAXIMIZE_CONVERSION_VALUE"
      | "TARGET_CPA"
      | "ENHANCED_CPC";
    target_cpa_micros?: number;
  }) {
    const operations = [
      {
        create: {
          bidding_strategy: {
            name: data.name,
            status: "ENABLED",
            ...(data.type === "TARGET_CPA" && {
              target_cpa: {
                target_cpa_micros: data.target_cpa_micros || 1000000,
              },
            }),
            ...(data.type === "MAXIMIZE_CONVERSIONS" && {
              maximize_conversions: {},
            }),
            ...(data.type === "MAXIMIZE_CONVERSION_VALUE" && {
              maximize_conversion_value: {},
            }),
            ...(data.type === "ENHANCED_CPC" && {
              enhanced_cpc: {},
            }),
          },
        },
      },
    ];

    return this.mutate(
      `customers/${this.config.customerId}/bidding_strategies:create`,
      operations
    );
  }
}
