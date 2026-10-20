/**
 * POST /api/ads/create
 * Créer une annonce Search
 */

import { NextApiRequest, NextApiResponse } from "next";
import { createExtendedClient } from "@/lib/create-extended-client";
import { ApiResponse } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { ad_group_id, final_url, headline1, headline2, description } =
      req.body;

    if (!ad_group_id || !final_url || !headline1 || !headline2 || !description) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: ad_group_id, final_url, headline1, headline2, description",
      });
    }

    const client = createExtendedClient() as any;
    const result = await client.createSearchAd({
      ad_group_id,
      final_url,
      headline1,
      headline2,
      description,
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: "Search ad created successfully (paused by default)",
    });
  } catch (error) {
    console.error("Ad creation error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
