/**
 * User Management entity type definitions
 */

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Club {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface BorrowHistoryItem {
  id: number;
  userId: number;
  itemId: number;
  itemName: string;
  borrowedAt: string;
  returnedAt?: string;
  status: "borrowed" | "returned" | "overdue";
}

export interface BorrowHistoryResponse {
  history: BorrowHistoryItem[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ClubAdmin extends User {
  clubId: number;
  assignedAt?: string;
}

export interface ClubAdminsResponse {
  admins: ClubAdmin[];
  clubId: number;
  total: number;
}

export interface ClubModerator extends User {
  clubId: number;
  assignedAt?: string;
}

export interface ClubModeratorsResponse {
  moderators: ClubModerator[];
  clubId: number;
  total: number;
}

export interface UserClub extends Club {
  role: "admin" | "moderator" | "member";
  joinedAt: string;
}

export interface UserClubsResponse {
  clubs: UserClub[];
  total: number;
}
