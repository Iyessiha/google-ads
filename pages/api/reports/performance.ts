/**
 * GET /api/reports/performance
 * Rapport de performance par campagne
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
    const result = await client.getCampaignPerformance();

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
