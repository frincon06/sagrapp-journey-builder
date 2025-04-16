
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import { 
  BookOpen, 
  Home, 
  Award, 
  User, 
  LogOut,
  Settings,
  BarChart
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { checkAdminStatus } from "@/services/adminService";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        try {
          const adminStatus = await checkAdminStatus(user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      }
    };
    
    checkAdmin();
  }, [user]);
  
  const menuItems = [
    { 
      title: "Inicio", 
      path: "/dashboard", 
      icon: Home 
    },
    { 
      title: "Cursos", 
      path: "/courses", 
      icon: BookOpen 
    },
    { 
      title: "Logros", 
      path: "/achievements", 
      icon: Award 
    },
    { 
      title: "Perfil", 
      path: "/profile", 
      icon: User 
    },
  ];
  
  const adminItems = [
    {
      title: "Panel Admin",
      path: "/admin",
      icon: Settings
    },
    {
      title: "Estadísticas",
      path: "/admin/stats",
      icon: BarChart
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center pl-2">
          <BookOpen className="h-6 w-6 text-sagrapp-primary" />
          <span className="text-lg font-bold ml-2">Sagrapp</span>
          <SidebarTrigger className="ml-auto h-8 w-8 shrink-0" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* User profile section */}
        <div className="mb-6 px-4 py-2">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="bg-sagrapp-primary text-white">
                {user?.full_name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.full_name || "Usuario"}</p>
              <p className="text-xs text-gray-500">Nivel {user?.level || 1}</p>
            </div>
          </div>
        </div>
        
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.path}
                    className={
                      location.pathname === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        
        {/* Admin section, only shown if user is admin */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={
                        location.pathname === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
