export interface Circles {
  circle_name: string;
  circle_user: CircleUser[];
}

export interface CircleUser {
  circle_user_id: number;
  circle_id: number;
  user_id: string;
}

export interface CircleName {
  circle_id: number;
  circle_name: string;
  created_at: string | null;
  updated_at: string | null;
}
