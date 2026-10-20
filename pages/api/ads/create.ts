/**
 * POST /api/ads/create
 * Créer une annonce Search
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
    const { ad_group_id, final_url, headline1, headline2, description } =
      req.body;

    if (!ad_group_id || !final_url || !headline1 || !headline2 || !description) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: ad_group_id, final_url, headline1, headline2, description",
      });
    }

    const client = createGoogleAdsClient();
    const operations = [
      {
        create: {
          ad: {
            expanded_text_ad: {
              headline_part1: headline1,
              headline_part2: headline2,
              description,
              final_url,
            },
          },
          ad_group: `customers/${client.config.customerId}/ad_groups/${ad_group_id}`,
          status: "PAUSED",
        },
      },
    ];

    const result = await client.mutate(
      `customers/${client.config.customerId}/ads:create`,
      operations
    );

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
