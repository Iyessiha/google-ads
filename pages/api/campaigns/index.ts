/**
 * Vercel API Route: GET /api/campaigns
 * Liste toutes tes campagnes Google Ads
 *
 * Place ce fichier dans: pages/api/campaigns/index.ts
 */

import { NextApiRequest, NextApiResponse } from "next";
import { createGoogleAdsClient } from "../../../lib/google-ads-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = createGoogleAdsClient();
    const campaigns = await client.getCampaigns();

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
