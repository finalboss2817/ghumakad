
export type BudgetType = 'Low' | 'Medium' | 'Luxury';
export type TravelType = 'Solo' | 'Couple' | 'Friends' | 'Family';
export type TravelPace = 'Relaxed' | 'Balanced' | 'Fast';

export interface DayPlan {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
  food: string[];
  travelTips: string;
}

export interface Itinerary {
  id: string;
  destination: string;
  totalDays: number;
  travelType: TravelType;
  budget: BudgetType;
  interests: string[];
  days: DayPlan[];
  mustKnowTips: string[];
  commonMistakes: string[];
  userName?: string;
  user_id?: string;
  createdAt: string;
  is_verified?: boolean;
}

export interface TravelPreferences {
  destination: string;
  days: number;
  budget: BudgetType;
  type: TravelType;
  interests: string[];
  pace?: TravelPace;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  location_name?: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    avatar_url: string;
    full_name: string;
  };
  likes_count: number;
  has_liked: boolean;
  has_followed?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  following_count: number;
  followers_count: number;
  location?: string;
}
