import type { ApiResponse } from "./users.generic.types";

export interface UserClubs {
  club_id: number;
  club_name: string;
  image_path: string;
}

export interface UserHistory {
  transaction_id: number;
  item_name: string;
  status: string;
  borrow_date: string;
  return_date: string;
}

export interface UserDetails {
  name: string;
  email: string;
  picture?: string | null;
}

export type UserClubsResponse = ApiResponse<UserClubs[]>;
export type UserHistoryResponse = ApiResponse<UserHistory[]>;
export type UserDetailsResponse = ApiResponse<UserDetails>;
