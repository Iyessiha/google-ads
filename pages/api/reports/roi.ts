/**
 * GET /api/reports/roi
 * Rapport ROI par campagne
 */

import { NextApiRequest, NextApiResponse } from "next";
import { createExtendedClient } from "@/lib/create-extended-client";
import { ApiResponse } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const client = createExtendedClient() as any;
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
