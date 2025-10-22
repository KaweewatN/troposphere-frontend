export interface Club {
  id: number;
  name: string;
  description: string;
}

export interface ClubMember {
  user_id: number;
  name: string;
  email: string;
}

export interface ClubMembersResponse {
  message: string;
  total_members: number;
  data: ClubMember[];
}
