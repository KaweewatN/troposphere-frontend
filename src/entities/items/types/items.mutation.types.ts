// Request payloads
export interface BorrowItemRequest {
  club_id: number;
  item_id: number;
  qr_code: string;
  return_date: string; // ISO date string format: "YYYY-MM-DDTHH:mm:ss.sssZ"
}

// Response payloads
export interface BorrowItemResponse {
  message: string;
  item_name: string;
}
// Item mutation types
export interface UploadItemImagesResponse {
  message: string;
  uploaded_images: string[];
}

export interface DeleteItemImagesRequest {
  image_urls: string[];
}

export interface DeleteItemImagesResponse {
  message: string;
}

export interface ApproveItemTransactionRequest {
  action: string;
}

export interface ApproveItemTransactionResponse {
  message: string;
  item_name: string;
  status: string;
}

export interface CreateItemRequest {
  name: string;
  description: string;
  is_high_risk: boolean;
  status: string;
  qr_code: string;
}

export interface CreateItemResponse {
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
