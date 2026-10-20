/**
 * POST /api/keywords/add
 * Ajouter des keywords à un groupe d'annonces
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
    const { ad_group_id, keywords } = req.body;

    if (!ad_group_id || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: ad_group_id, keywords (array)",
      });
    }

    const client = createExtendedClient() as any;
    const result = await client.addKeywords({
      ad_group_id,
      keywords,
    });

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
