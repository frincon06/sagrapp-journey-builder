
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCourses, getUserProgress, updateUserStreak } from "@/services/courseService";
import { Course, UserProgress } from "@/types/models";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { 
  BookOpen, 
  Award, 
  Zap, 
  ChevronRight,
  BookOpenCheck,
  Library
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get all courses
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        // Get user progress if user is logged in
        if (user) {
          const progressData = await getUserProgress(user.id);
          setUserProgress(progressData);
        }
      } catch (error: any) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error al cargar datos",
          description: error.message || "No se pudieron cargar los cursos",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, toast]);

  // Function to get course progress percentage
  const getCourseProgress = (courseId: string) => {
    const courseLessonCount = courses.find(c => c.id === courseId)?.lesson_count || 0;
    let courseLessons = 0;
    
    if (typeof courseLessonCount === 'number') {
      courseLessons = courseLessonCount;
    } else if (Array.isArray(courseLessonCount) && courseLessonCount.length > 0) {
      courseLessons = courseLessonCount[0]?.count || 0;
    }
    
    const completedLessons = userProgress.filter(
      p => p.course_id === courseId && p.completed
    ).length;
    
    return courseLessons > 0 ? Math.round((completedLessons / courseLessons) * 100) : 0;
  };

  // Find the most recent course the user was working on
  const getActiveCourse = () => {
    if (userProgress.length === 0) return courses[0]; // Default to first course if no progress
    
    const sortedProgress = [...userProgress].sort(
      (a, b) => new Date(b.completed_at || "").getTime() - new Date(a.completed_at || "").getTime()
    );
    
    const recentCourseId = sortedProgress[0]?.course_id;
    return courses.find(c => c.id === recentCourseId) || courses[0];
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-sagrapp-light">
        <AppSidebar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Hola, {user?.full_name || 'Estudiante'}
              </h1>
              <p className="text-gray-600">
                Continúa tu viaje de aprendizaje bíblico
              </p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tu racha</p>
                    {isLoading ? (
                      <Skeleton className="h-6 w-20" />
                    ) : (
                      <p className="text-2xl font-bold">{user?.streak_days || 0} días</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nivel</p>
                    {isLoading ? (
                      <Skeleton className="h-6 w-20" />
                    ) : (
                      <p className="text-2xl font-bold">{user?.level || 1}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BookOpenCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">XP Espiritual</p>
                    {isLoading ? (
                      <Skeleton className="h-6 w-20" />
                    ) : (
                      <p className="text-2xl font-bold">{user?.xp || 0} XP</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Learning Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Continúa aprendiendo</h2>
              
              {isLoading ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-6" />
                  <Skeleton className="h-2 w-full mb-2" />
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              ) : courses.length > 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-sagrapp-accent rounded-lg">
                      <BookOpen className="h-6 w-6 text-sagrapp-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{getActiveCourse()?.title}</h3>
                      <p className="text-gray-600">{getActiveCourse()?.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progreso del curso</span>
                      <span className="text-sm font-medium">{getCourseProgress(getActiveCourse()?.id || "")}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-sagrapp-primary h-2.5 rounded-full" 
                        style={{ width: `${getCourseProgress(getActiveCourse()?.id || "")}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate(`/courses/${getActiveCourse()?.id}/lessons`)}
                    className="ml-auto bg-sagrapp-primary hover:bg-sagrapp-secondary"
                  >
                    Continuar <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-600 mb-4">No hay cursos disponibles actualmente.</p>
                </div>
              )}
            </div>

            {/* All Courses Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Explorá todos los cursos</h2>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/courses')}
                  className="text-sagrapp-primary"
                >
                  Ver todos
                </Button>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <Skeleton className="h-40 w-full mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-2 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.slice(0, 3).map(course => (
                    <div key={course.id} className="course-card">
                      {course.image_url ? (
                        <div 
                          className="h-40 rounded-lg mb-4 bg-center bg-cover" 
                          style={{ backgroundImage: `url(${course.image_url})` }}
                        />
                      ) : (
                        <div className="h-40 rounded-lg mb-4 bg-sagrapp-accent flex items-center justify-center">
                          <Library className="h-12 w-12 text-sagrapp-primary/50" />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="space-y-2 mb-4 mt-auto">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Progreso</span>
                          <span className="text-sm font-medium">{getCourseProgress(course.id)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-sagrapp-primary h-2 rounded-full" 
                            style={{ width: `${getCourseProgress(course.id)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => navigate(`/courses/${course.id}/lessons`)}
                        className="w-full bg-sagrapp-primary hover:bg-sagrapp-secondary"
                      >
                        {getCourseProgress(course.id) > 0 ? 'Continuar' : 'Comenzar'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-600">No hay cursos disponibles actualmente.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
