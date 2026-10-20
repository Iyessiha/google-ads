/**
 * POST /api/audiences/create
 * Créer une audience personnalisée
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
    const { name, description, membership_status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: name",
      });
    }

    const client = createExtendedClient() as any;
    const result = await client.createAudience({
      name,
      description,
      membership_status,
    });

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
