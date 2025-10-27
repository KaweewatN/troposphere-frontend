import type { ApiResponse, MembersResponse } from "./clubs.generic.types";

export interface Club {
  id: number;
  name: string;
  description: string;
  created_at: string;
  image_path: string;
}
export interface ClubMember {
  user_id: number;
  name: string;
  email: string;
}

export interface ClubDetails {
  name: string;
  description: string;
  total_members: number;
  image_path: string;
}

export type ClubResponse = ApiResponse<Club[]>;
export type ClubMembersResponse = MembersResponse<ClubMember[]>;
export type ClubDetailsResponse = ApiResponse<ClubDetails>;
