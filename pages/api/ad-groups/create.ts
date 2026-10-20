/**
 * POST /api/ad-groups/create
 * Créer un groupe d'annonces
 */

import { NextApiRequest, NextApiResponse } from "next";
import { createGoogleAdsClient } from "@/lib/google-ads-client";
import { ApiResponse } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { campaign_id, name, cpc_bid_micros } = req.body;

    if (!campaign_id || !name) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: campaign_id, name",
      });
    }

    const client = createGoogleAdsClient();
    const operations = [
      {
        create: {
          ad_group: {
            campaign: `customers/${client.config.customerId}/campaigns/${campaign_id}`,
            name,
            status: "ENABLED",
            cpc_bid_micros: cpc_bid_micros || 1000000,
          },
        },
      },
    ];

    const result = await client.mutate(
      `customers/${client.config.customerId}/ad_groups:create`,
      operations
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: `Ad group "${name}" created successfully`,
    });
  } catch (error) {
    console.error("Ad group creation error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
