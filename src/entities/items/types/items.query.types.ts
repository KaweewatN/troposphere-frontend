import type { ApiResponse } from "./items.generic.type";

interface ItemSearch {
  id: number;
  name: string;
  description: string;
  status: string;
  is_high_risk: boolean;
  images: string[];
}

export interface ItemIdSearchResponse {
  name: string;
  description: string;
  is_high_risk: boolean;
  status: string;
  qr_code: string;
  id: number;
  created_at: string;
  club_id: number;
  images: string[];
}

export interface ItemSearchInClub {
  id: number;
  name: string;
  description: string;
  status: string;
  is_high_risk: boolean;
  qr_code: string;
  images: string[];
}

export interface ItemSearchInClubApproval {
  transaction_id: number;
  item_id: number;
  item_name: string;
  borrower_name: string;
  status: string;
  requested_at: string;
  message: string;
}

// Response
export type ItemSearchResponse = ApiResponse<ItemSearch[]>;
export type ItemSearchInClubResponse = ApiResponse<ItemSearchInClub[]>;
export type ItemSearchInClubApprovalResponse = ItemSearchInClubApproval[];
