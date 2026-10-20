/**
 * POST /api/conversions/offline
 * Envoyer une conversion offline
 * Utile pour tracker les ventes en magasin, appels, etc.
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
    const {
      gclid,
      conversion_action_id,
      conversion_date_time,
      conversion_value,
      currency_code,
    } = req.body;

    if (!gclid || !conversion_action_id || !conversion_date_time) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: gclid, conversion_action_id, conversion_date_time",
      });
    }

    const client = createGoogleAdsClient();
    const operations = [
      {
        create: {
          gclid_date_pair: {
            gclid,
            conversion_date_time,
          },
          conversion_action: `customers/${client.config.customerId}/conversion_actions/${conversion_action_id}`,
          conversion_date_time,
          conversion_value: conversion_value || 0,
          currency_code: currency_code || "USD",
        },
      },
    ];

    const result = await client.mutate(
      `customers/${client.config.customerId}/offline_user_conversions:create`,
      operations
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: "Offline conversion sent successfully",
    });
  } catch (error) {
    console.error("Offline conversion error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
