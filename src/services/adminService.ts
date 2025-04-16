import { supabase, dbCourseToModel } from '@/lib/supabase';
import { Course, Lesson, Question, SpiritualActivity, User } from '@/types/models';
import { Json } from '@/integrations/supabase/types';

// Course management
export async function getAllCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lesson_count:lessons(count)
    `)
    .order('order_index');
    
  if (error) {
    console.error('Error fetching all courses:', error);
    throw error;
  }
  
  // Transform the data to match our model
  return data.map(course => dbCourseToModel(course)) as Course[];
}

export async function createCourse(course: { title: string; description: string; order_index?: number; is_active?: boolean; image_url?: string | null }) {
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select();
    
  if (error) {
    console.error('Error creating course:', error);
    throw error;
  }
  
  return data[0] as Course;
}

export async function updateCourse(courseId: string, updates: Partial<Course>) {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)
    .select();
    
  if (error) {
    console.error('Error updating course:', error);
    throw error;
  }
  
  return data[0] as Course;
}

export async function deleteCourse(courseId: string) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);
    
  if (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
  
  return true;
}

// Lesson management
export async function createLesson(lesson: { 
  course_id: string;
  title: string;
  main_text?: string;
  key_verse?: string;
  order_index?: number;
  is_active?: boolean;
  image_url?: string | null;
}) {
  const { data, error } = await supabase
    .from('lessons')
    .insert([{
      course_id: lesson.course_id,
      title: lesson.title,
      main_text: lesson.main_text || '',
      key_verse: lesson.key_verse || '',
      order_index: lesson.order_index || 0,
      is_active: lesson.is_active !== undefined ? lesson.is_active : true,
      image_url: lesson.image_url
    }])
    .select();
    
  if (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
  
  return data[0] as Lesson;
}

export async function updateLesson(lessonId: string, updates: Partial<Lesson>) {
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', lessonId)
    .select();
    
  if (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
  
  return data[0] as Lesson;
}

export async function deleteLesson(lessonId: string) {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId);
    
  if (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
  
  return true;
}

// Question management
export async function createQuestion(question: {
  lesson_id: string;
  text: string;
  type: string;
  options?: string[] | Json;
  correct_answer?: string | string[] | Json;
  verse_reference?: string;
  xp_value?: number;
}) {
  const { data, error } = await supabase
    .from('questions')
    .insert(question)
    .select();
    
  if (error) {
    console.error('Error creating question:', error);
    throw error;
  }
  
  return data[0] as Question;
}

export async function updateQuestion(questionId: string, updates: Partial<Question>) {
  const { data, error } = await supabase
    .from('questions')
    .update(updates)
    .eq('id', questionId)
    .select();
    
  if (error) {
    console.error('Error updating question:', error);
    throw error;
  }
  
  return data[0] as Question;
}

export async function deleteQuestion(questionId: string) {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId);
    
  if (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
  
  return true;
}

// Spiritual activity management
export async function createSpiritualActivity(activity: {
  lesson_id: string;
  activity_type: string;
  description: string;
  prompt: string;
}) {
  const { data, error } = await supabase
    .from('spiritual_activities')
    .insert(activity)
    .select();
    
  if (error) {
    console.error('Error creating spiritual activity:', error);
    throw error;
  }
  
  return data[0] as SpiritualActivity;
}

export async function updateSpiritualActivity(activityId: string, updates: Partial<SpiritualActivity>) {
  const { data, error } = await supabase
    .from('spiritual_activities')
    .update(updates)
    .eq('id', activityId)
    .select();
    
  if (error) {
    console.error('Error updating spiritual activity:', error);
    throw error;
  }
  
  return data[0] as SpiritualActivity;
}

// User management for admins
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  return data as User[];
}

export async function getUserStats() {
  // You would implement this with more complex queries depending on your needs
  const { data: totalUsers, error: usersError } = await supabase
    .from('users')
    .select('id', { count: 'exact' });
    
  if (usersError) {
    console.error('Error fetching user count:', usersError);
    throw usersError;
  }
  
  const { data: activeUsers, error: activeError } = await supabase
    .from('users')
    .select('id', { count: 'exact' })
    .gte('last_activity', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Active in last 7 days
    
  if (activeError) {
    console.error('Error fetching active users:', activeError);
    throw activeError;
  }
  
  return {
    totalUsers: totalUsers.length,
    activeUsers: activeUsers.length
  };
}

// Check if a user is an admin
export async function checkAdminStatus(userId: string) {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is OK
    console.error('Error checking admin status:', error);
    throw error;
  }
  
  return !!data; // Return true if data exists (user is admin)
}
