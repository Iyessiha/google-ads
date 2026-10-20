/**
 * Types TypeScript pour Google Ads API
 */

export interface Campaign {
  id: string;
  name: string;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  budget: {
    total_amount_micros: number;
  };
  metrics: {
    impressions: string;
    clicks: string;
    cost_micros: string;
    conversions?: string;
  };
}

export interface CampaignCreateRequest {
  name: string;
  budget_usd: number;
  type?: "SEARCH" | "DISPLAY" | "SHOPPING";
}

export interface CampaignUpdateRequest {
  id: string;
  status: "ENABLED" | "PAUSED";
}

export interface GoogleAdsSearchResponse {
  results: Array<{
    campaign: Campaign;
    metrics: Campaign["metrics"];
  }>;
  fieldMask?: string;
  summary?: {
    total_results_count: string;
  };
}

export interface GoogleAdsMutateResponse {
  results: Array<{
    resource_name: string;
    create_results?: any;
    update_results?: any;
  }>;
  partial_failure_error?: {
    code: number;
    message: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
