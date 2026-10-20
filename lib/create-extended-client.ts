/**
 * Factory function to create an extended Google Ads client
 * Avoids circular dependencies in API routes
 */

import { GoogleAdsClient, createGoogleAdsClient } from "./google-ads-client";

/**
 * Create a Google Ads client with extended methods
 */
export function createExtendedClient() {
  const baseClient = createGoogleAdsClient();

  // Add extended methods to the client
  const extendedMethods = {
    createBudget: async (data: { name: string; amount_micros: number }) => {
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
      return baseClient.mutate(
        `customers/${baseClient.config.customerId}/campaign_budgets:create`,
        operations
      );
    },

    createAdGroup: async (data: {
      campaign_id: string;
      name: string;
      cpc_bid_micros?: number;
    }) => {
      const operations = [
        {
          create: {
            ad_group: {
              campaign: `customers/${baseClient.config.customerId}/campaigns/${data.campaign_id}`,
              name: data.name,
              status: "ENABLED",
              cpc_bid_micros: data.cpc_bid_micros || 1000000,
            },
          },
        },
      ];
      return baseClient.mutate(
        `customers/${baseClient.config.customerId}/ad_groups:create`,
        operations
      );
    },

    addKeywords: async (data: {
      ad_group_id: string;
      keywords: Array<{
        text: string;
        match_type: "EXACT" | "PHRASE" | "BROAD";
        bid_micros?: number;
      }>;
    }) => {
      const operations = data.keywords.map((kw) => ({
        create: {
          ad_group_criterion: {
            ad_group: `customers/${baseClient.config.customerId}/ad_groups/${data.ad_group_id}`,
            keyword: {
              text: kw.text,
              match_type: kw.match_type,
            },
            status: "ENABLED",
            cpc_bid_micros: kw.bid_micros || 1000000,
          },
        },
      }));
      return baseClient.mutate(
        `customers/${baseClient.config.customerId}/ad_group_criteria:create`,
        operations
      );
    },

    createSearchAd: async (data: {
      ad_group_id: string;
      final_url: string;
      headline1: string;
      headline2: string;
      description: string;
    }) => {
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
            ad_group: `customers/${baseClient.config.customerId}/ad_groups/${data.ad_group_id}`,
            status: "PAUSED",
          },
        },
      ];
      return baseClient.mutate(
        `customers/${baseClient.config.customerId}/ads:create`,
        operations
      );
    },

    createAudience: async (data: {
      name: string;
      description?: string;
      membership_status?: "OPEN" | "CLOSED";
    }) => {
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
      return baseClient.mutate(
        `customers/${baseClient.config.customerId}/customer_match_user_lists:create`,
        operations
      );
    },

    sendOfflineConversion: async (data: {
      gclid: string;
      conversion_action_id: string;
      conversion_date_time: string;
      conversion_value?: number;
      currency_code?: string;
    }) => {
      const operations = [
        {
          create: {
            gclid_date_pair: {
              gclid: data.gclid,
              conversion_date_time: data.conversion_date_time,
            },
            conversion_action: `customers/${baseClient.config.customerId}/conversion_actions/${data.conversion_action_id}`,
            conversion_date_time: data.conversion_date_time,
            conversion_value: data.conversion_value || 0,
            currency_code: data.currency_code || "USD",
          },
        },
      ];
      return baseClient.mutate(
        `customers/${baseClient.config.customerId}/offline_user_conversions:create`,
        operations
      );
    },

    getCampaignPerformance: async () => {
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
      return baseClient.request(
        `customers/${baseClient.config.customerId}/googleAds:search`,
        { query }
      );
    },

    getCampaignROI: async () => {
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
      const data = await baseClient.request(
        `customers/${baseClient.config.customerId}/googleAds:search`,
        { query }
      );
      const dataObj = data as any;
      return {
        ...dataObj,
        calculated_roi: dataObj.results?.map((r: any) => ({
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
    },
  };

  return { ...baseClient, ...extendedMethods };
}
