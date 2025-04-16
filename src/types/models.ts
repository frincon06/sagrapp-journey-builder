
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  xp: number;
  level: number;
  streak_days: number;
  last_activity: string; // ISO date
  created_at: string; // ISO date
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string; // ISO date
  lesson_count: number | { count: number }[];
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  main_text: string;
  key_verse: string;
  order_index: number;
  is_active: boolean;
  image_url?: string;
  created_at: string; // ISO date
  questions: Question[];
  spiritual_activity?: SpiritualActivity;
}

export interface Question {
  id: string;
  lesson_id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'reflection';
  options?: string[];
  correct_answer?: string | string[];
  verse_reference?: string;
  xp_value: number;
}

export interface SpiritualActivity {
  id: string;
  lesson_id: string;
  activity_type: 'reflection' | 'prayer' | 'decision';
  description: string;
  prompt: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  answers: UserAnswer[] | any; // Changed to allow Json type from Supabase
  spiritual_response?: string;
  xp_earned: number;
  completed_at?: string; // ISO date
}

export interface UserAnswer {
  question_id: string;
  user_answer: string | string[];
  is_correct?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  xp_reward: number;
  required_level?: number;
  required_streak?: number;
  required_courses?: string[];
  required_lessons?: number;
}

export interface UserAchievement {
  user_id: string;
  achievement_id: string;
  earned_at: string; // ISO date
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  start_date: string; // ISO date
  end_date: string; // ISO date
  goal_type: 'lessons' | 'xp' | 'streak';
  goal_value: number;
  reward_xp: number;
  is_active: boolean;
}
