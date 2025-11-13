// Item mutation types

export interface UploadItemImagesResponse {
  message: string;
  uploaded_images: string[];
}

export interface ApproveItemTransactionRequest {
  action: string;
}

export interface ApproveItemTransactionResponse {
  message: string;
  item_name: string;
  status: string;
}
