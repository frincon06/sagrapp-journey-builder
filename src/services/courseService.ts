import { supabase, dbCourseToModel } from '@/lib/supabase';
import { Course, Lesson, Question, SpiritualActivity, UserProgress, UserAnswer } from '@/types/models';
import { Json } from '@/integrations/supabase/types';

export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lesson_count:lessons(count)
    `)
    .eq('is_active', true)
    .order('order_index');
    
  if (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
  
  return data.map(course => dbCourseToModel(course)) as Course[];
}

export async function getCourseById(courseId: string) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lesson_count:lessons(count)
    `)
    .eq('id', courseId)
    .single();
    
  if (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
  
  return dbCourseToModel(data) as Course;
}

export async function getLessons(courseId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_active', true)
    .order('order_index');
    
  if (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
  
  return data as Lesson[];
}

export async function getLessonById(lessonId: string) {
  const { data: lessonData, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
    
  if (lessonError) {
    console.error('Error fetching lesson:', lessonError);
    throw lessonError;
  }
  
  const { data: questionsData, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('id');
    
  if (questionsError) {
    console.error('Error fetching questions:', questionsError);
    throw questionsError;
  }
  
  const { data: activityData, error: activityError } = await supabase
    .from('spiritual_activities')
    .select('*')
    .eq('lesson_id', lessonId)
    .single();
    
  if (activityError && activityError.code !== 'PGRST116') {
    console.error('Error fetching spiritual activity:', activityError);
    throw activityError;
  }
  
  const lesson = lessonData as Lesson;
  lesson.questions = questionsData as Question[];
  lesson.spiritual_activity = activityData as SpiritualActivity;
  
  return lesson;
}

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
  
  return data.map(progress => ({
    ...progress,
    answers: progress.answers as unknown as UserAnswer[]
  })) as UserProgress[];
}

export async function saveLessonProgress(progress: Omit<UserProgress, 'id'>) {
  const supabaseProgress = {
    user_id: progress.user_id,
    course_id: progress.course_id,
    lesson_id: progress.lesson_id,
    completed: progress.completed,
    answers: progress.answers as unknown as Json,
    spiritual_response: progress.spiritual_response,
    xp_earned: progress.xp_earned,
    completed_at: progress.completed_at
  };
  
  const { data, error } = await supabase
    .from('user_progress')
    .insert([supabaseProgress]);
    
  if (error) {
    console.error('Error saving lesson progress:', error);
    throw error;
  }
  
  return data;
}

export async function updateUserXP(userId: string, xpToAdd: number) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('xp, level')
    .eq('id', userId)
    .single();
    
  if (userError) {
    console.error('Error fetching user data:', userError);
    throw userError;
  }
  
  const newXP = (userData?.xp || 0) + xpToAdd;
  let newLevel = userData?.level || 1;
  
  if (newXP >= ((newLevel * 100) + ((newLevel - 1) * 50))) {
    newLevel += 1;
  }
  
  const { data, error } = await supabase
    .from('users')
    .update({ 
      xp: newXP, 
      level: newLevel,
      last_activity: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating user XP:', error);
    throw error;
  }
  
  return { newXP, newLevel };
}

export async function updateUserStreak(userId: string) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('streak_days, last_activity')
    .eq('id', userId)
    .single();
    
  if (userError) {
    console.error('Error fetching user streak data:', userError);
    throw userError;
  }
  
  const lastActivity = new Date(userData?.last_activity || '');
  const today = new Date();
  
  if (today.getDate() - lastActivity.getDate() > 1) {
    const { error } = await supabase
      .from('users')
      .update({ 
        streak_days: 1,
        last_activity: today.toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      console.error('Error resetting user streak:', error);
      throw error;
    }
    
    return 1;
  } 
  else if (today.getDate() !== lastActivity.getDate()) {
    const newStreak = (userData?.streak_days || 0) + 1;
    
    const { error } = await supabase
      .from('users')
      .update({ 
        streak_days: newStreak,
        last_activity: today.toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating user streak:', error);
      throw error;
    }
    
    return newStreak;
  }
  
  return userData?.streak_days || 0;
}
