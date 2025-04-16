
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { checkAdminStatus } from "@/services/adminService";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminCourseManager from "@/components/admin/AdminCourseManager";
import AdminUserManager from "@/components/admin/AdminUserManager";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (user) {
          const adminStatus = await checkAdminStatus(user.id);
          
          setIsAdmin(adminStatus);
          
          if (!adminStatus) {
            toast.error("No tienes permiso para acceder a esta página");
            navigate('/dashboard');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error verificando estado de administrador:", error);
        toast.error("Error al verificar permisos de administrador");
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sagrapp-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-sagrapp-light">
        <AppSidebar />
        <main className="flex-1">
          <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
            
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="users">Usuarios</TabsTrigger>
              </TabsList>
              
              <TabsContent value="courses">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Cursos</CardTitle>
                    <CardDescription>Administra los cursos, lecciones y contenido.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminCourseManager />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <CardDescription>Administra usuarios y asigna roles de administrador.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminUserManager />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
