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
