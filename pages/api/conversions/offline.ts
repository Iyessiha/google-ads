/**
 * POST /api/conversions/offline
 * Envoyer une conversion offline
 * Utile pour tracker les ventes en magasin, appels, etc.
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

    const client = createExtendedClient() as any;
    const result = await client.sendOfflineConversion({
      gclid,
      conversion_action_id,
      conversion_date_time,
      conversion_value,
      currency_code,
    });

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
