
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { User } from '@/types/models';
import { Json } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://nphcolyqvcswmfkpcgdf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waGNvbHlxdmNzd21ma3BjZ2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTU3MzcsImV4cCI6MjA2MDM5MTczN30.Gdm8Dsc7_bL3dJ6UKojjWc-ZUeh9OFfVwjD4rGnYaQQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to handle type conversions safely
export function dbCourseToModel(dbCourse: any): any {
  if (!dbCourse) return null;
  
  // Handle lesson_count which can come as an array with count property
  let lessonCount = 0;
  if (dbCourse.lesson_count) {
    if (Array.isArray(dbCourse.lesson_count) && dbCourse.lesson_count.length > 0) {
      lessonCount = dbCourse.lesson_count[0]?.count || 0;
    } else if (typeof dbCourse.lesson_count === 'number') {
      lessonCount = dbCourse.lesson_count;
    }
  }
  
  return {
    ...dbCourse,
    lesson_count: lessonCount
  };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error || !data) {
    console.error('Error fetching user data:', error);
    return null;
  }
  
  return data as User;
}
