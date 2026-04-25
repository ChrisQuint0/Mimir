export interface Bootcamp {
  id: string;
  user_id: string;
  title: string;
  goal: string;
  duration_days: number;
  current_day: number;
  caption?: string | null;
  published_at?: string | null;
  created_at?: string;
}

export interface BootcampProfile {
  id: string;
  display_name: string;
  avatar_url?: string | null;
}

export interface FeedBootcamp extends Bootcamp {
  author: BootcampProfile;
  enrollment_count: number;
  is_enrolled: boolean;
  is_owner: boolean;
  is_following_author: boolean;
}

export interface Review {
  id: string;
  bootcamp_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithAuthor extends Review {
  author: BootcampProfile;
}

export interface SyllabusDay {
  day: number;
  title: string;
  topics: string[];
  description: string;
}
