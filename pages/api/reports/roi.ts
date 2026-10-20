/**
 * GET /api/reports/roi
 * Rapport ROI par campagne
 */

import { NextApiRequest, NextApiResponse } from "next";
import { GoogleAdsClientExtended } from "@/lib/google-ads-client-extended";
import { createGoogleAdsClient } from "@/lib/google-ads-client";
import { ApiResponse } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const baseClient = createGoogleAdsClient();
    const client = Object.assign(
      Object.create(Object.getPrototypeOf(baseClient)),
      baseClient,
      GoogleAdsClientExtended.prototype
    ) as GoogleAdsClientExtended;

    const result = await client.getCampaignROI();

    return res.status(200).json({
      success: true,
      data: result,
      message: "Campaign ROI analysis (last 30 days)",
    });
  } catch (error) {
    console.error("ROI report error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
