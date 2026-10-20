/**
 * GET /api/reports/roi
 * Rapport ROI par campagne
 */

import { NextApiRequest, NextApiResponse } from "next";
import { createGoogleAdsClient } from "@/lib/google-ads-client";
import { ApiResponse } from "@/lib/types";

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
        metrics.cost_micros,
        metrics.conversion_value_micros,
        segments.date
      FROM campaign
      WHERE segments.date >= LAST_30_DAYS
      AND campaign.status != REMOVED
    `;

    const data = await client.request(
      `customers/${client.config.customerId}/googleAds:search`,
      { query }
    );

    const dataObj = data as any;
    const result = {
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
