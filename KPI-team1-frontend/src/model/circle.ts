export interface Circles {
  circle_name: string;
  circle_user: CircleUser[];
}

export interface CircleUser {
  circle_user_id: number;
  circle_id: number;
  user_id: string;
}
