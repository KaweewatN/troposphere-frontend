type ItemStatus = "AVAILABLE" | "BORROWED" | "UNAVAILABLE";

// Request payloads
export interface CreateClubRequest {
  name: string;
  description: string;
}

export interface AddItemToClubRequest {
  name: string;
  description: string;
  is_high_risk: boolean;
  status: ItemStatus;
  qr_code: string;
}

export interface BorrowItemFromQrCodeRequest {
  qr_code: string;
  return_date: string;
}

export interface ReturnItemFromQrCodeRequest {
  qr_code: string;
}

// Response payloads
export interface CreateClubResponse {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface AddItemToClubResponse {
  name: string;
  description: string;
  is_high_risk: boolean;
  status: ItemStatus;
  qr_code: string;
  id: number;
  created_at: string;
  club_id: number;
  images: string[];
}

export interface BorrowItemFromQrCodeResponse {
  message: string;
  item_name: string;
}

export interface ReturnItemFromQrCodeResponse {
  message: string;
  item_name: string;
}
