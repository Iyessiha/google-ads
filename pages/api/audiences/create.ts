/**
 * POST /api/audiences/create
 * Créer une audience personnalisée
 */

import { NextApiRequest, NextApiResponse } from "next";
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
    const { name, description, membership_status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: name",
      });
    }

    const client = createGoogleAdsClient();
    const operations = [
      {
        create: {
          customer_match_user_list: {
            name,
            description: description || "",
            membership_status: membership_status || "CLOSED",
            upload_keyword_type: "CONTACT_INFO",
          },
        },
      },
    ];

    const result = await client.mutate(
      `customers/${client.config.customerId}/customer_match_user_lists:create`,
      operations
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: `Audience "${name}" created successfully`,
    });
  } catch (error) {
    console.error("Audience creation error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
