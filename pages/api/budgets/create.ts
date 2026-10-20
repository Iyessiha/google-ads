/**
 * POST /api/budgets/create
 * Créer un nouveau budget
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
    const { name, amount_micros } = req.body;

    if (!name || !amount_micros) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, amount_micros",
      });
    }

    const client = createExtendedClient() as any;
    const result = await client.createBudget({
      name,
      amount_micros,
    });

    return res.status(200).json({
      success: true,
      data: result,
      message: `Budget "${name}" created successfully`,
    });
  } catch (error) {
    console.error("Budget creation error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
