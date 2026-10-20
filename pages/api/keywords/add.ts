/**
 * POST /api/keywords/add
 * Ajouter des keywords à un groupe d'annonces
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
    const { ad_group_id, keywords } = req.body;

    if (!ad_group_id || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: ad_group_id, keywords (array)",
      });
    }

    const client = createGoogleAdsClient();
    const operations = keywords.map((kw) => ({
      create: {
        ad_group_criterion: {
          ad_group: `customers/${client.config.customerId}/ad_groups/${ad_group_id}`,
          keyword: {
            text: kw.text,
            match_type: kw.match_type,
          },
          status: "ENABLED",
          cpc_bid_micros: kw.bid_micros || 1000000,
        },
      },
    }));

    const result = await client.mutate(
      `customers/${client.config.customerId}/ad_group_criteria:create`,
      operations
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: `${keywords.length} keyword(s) added successfully`,
    });
  } catch (error) {
    console.error("Keywords addition error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
