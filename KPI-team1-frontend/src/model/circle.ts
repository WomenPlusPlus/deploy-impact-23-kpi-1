export interface FavoriteCircle {
  circle_name: string;
  circle_user: CircleUser[];
}

export interface CircleUser {
  circle_user_id: number;
  circle_id: number;
  user_id: string;
}

export interface Circle {
  circle_id: number;
  circle_name: string;
  created_at: string;
  updated_at: string | null;
}
