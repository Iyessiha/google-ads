/**
 * Vercel API Route: POST /api/campaigns/create
 * Crée une nouvelle campagne Google Ads
 *
 * Place ce fichier dans: pages/api/campaigns/create.ts
 */

import { NextApiRequest, NextApiResponse } from "next";
import { createGoogleAdsClient } from "../../../lib/google-ads-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, budget_usd } = req.body;

  if (!name || !budget_usd) {
    return res.status(400).json({
      error: "Missing required fields: name, budget_usd"
    });
  }

  try {
    const client = createGoogleAdsClient();

    // Convertir USD en micros (1$ = 1,000,000 micros)
    const budget_micros = Math.round(budget_usd * 1_000_000);

    const result = await client.createCampaign({
      name,
      budget_micros,
    });

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
