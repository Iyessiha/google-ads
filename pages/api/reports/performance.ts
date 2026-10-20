/**
 * GET /api/reports/performance
 * Rapport de performance par campagne
 */

import { NextApiRequest, NextApiResponse } from "next";
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
    const client = createGoogleAdsClient();
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

    const result = await client.request(
      `customers/${client.config.customerId}/googleAds:search`,
      { query }
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: "Campaign performance report (last 30 days)",
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
