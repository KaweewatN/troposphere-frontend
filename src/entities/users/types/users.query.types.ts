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

export interface UserMembership {
  user_id: number;
  club_id: number;
  club_name: string;
  role: string;
  joined_at: string;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  name: string;
  picture?: string | null;
  global_role: number;
  memberships: UserMembership[];
  created_at: string;
}

export interface UserByStudentId {
  id: number;
  email: string;
  name: string;
  student_id: string;
  picture?: string | null;
}

export type UserClubsResponse = ApiResponse<UserClubs[]>;
export type UserHistoryResponse = ApiResponse<UserHistory[]>;
export type UserByStudentIdResponse = UserByStudentId;
