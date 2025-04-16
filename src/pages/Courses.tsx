
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCourses, getUserProgress } from "@/services/courseService";
import { Course, UserProgress } from "@/types/models";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Library } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { Input } from "@/components/ui/input";

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
        console.error("Error loading courses data:", error);
        toast({
          title: "Error al cargar cursos",
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
    const courseLessons = courses.find(c => c.id === courseId)?.lesson_count || 0;
    const completedLessons = userProgress.filter(
      p => p.course_id === courseId && p.completed
    ).length;
    
    return courseLessons > 0 ? Math.round((completedLessons / courseLessons) * 100) : 0;
  };

  // Filter courses by search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-sagrapp-light">
        <AppSidebar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Todos los cursos</h1>
              <p className="text-gray-600">
                Explora y aprende con nuestros cursos bíblicos
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="max-w-md">
                <div className="relative">
                  <Input
                    placeholder="Buscar cursos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-2 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
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
                    <div className="mt-auto">
                      <div className="space-y-2 mb-4">
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron cursos</h3>
                <p className="text-gray-600 mb-6">
                  No se encontraron cursos que coincidan con tu búsqueda.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Courses;
