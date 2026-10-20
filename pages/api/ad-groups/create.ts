/**
 * POST /api/ad-groups/create
 * Créer un groupe d'annonces
 */

import { NextApiRequest, NextApiResponse } from "next";
import { GoogleAdsClientExtended } from "@/lib/google-ads-client-extended";
import { createGoogleAdsClient } from "@/lib/google-ads-client";
import { ApiResponse } from "@/types";

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

    const baseClient = createGoogleAdsClient();
    const client = Object.assign(
      Object.create(Object.getPrototypeOf(baseClient)),
      baseClient,
      GoogleAdsClientExtended.prototype
    ) as GoogleAdsClientExtended;

    const result = await client.createAdGroup({
      campaign_id,
      name,
      cpc_bid_micros,
    });

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
