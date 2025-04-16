
import { useState, useEffect } from "react";
import { getAllUsers, checkAdminStatus } from "@/services/adminService";
import { User } from "@/types/models";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const AdminUserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminStatuses, setAdminStatuses] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
      
      // Cargar el estado de administrador para cada usuario
      const statuses: Record<string, boolean> = {};
      for (const user of usersData) {
        statuses[user.id] = await checkAdminStatus(user.id);
      }
      setAdminStatuses(statuses);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string) => {
    try {
      const isCurrentlyAdmin = adminStatuses[userId];
      
      if (isCurrentlyAdmin) {
        // Eliminar rol de administrador
        const { error } = await supabase
          .from('admins')
          .delete()
          .eq('user_id', userId);
          
        if (error) throw error;
        
        toast.success("Rol de administrador removido");
      } else {
        // Añadir rol de administrador
        const { error } = await supabase
          .from('admins')
          .insert({ user_id: userId });
          
        if (error) throw error;
        
        toast.success("Usuario promovido a administrador");
      }
      
      // Actualizar los estados locales
      setAdminStatuses({
        ...adminStatuses,
        [userId]: !isCurrentlyAdmin
      });
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast.error("Error al cambiar el estado de administrador");
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar usuarios..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-sagrapp-primary" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-center py-6 text-gray-500">
          No hay usuarios registrados.
        </p>
      ) : (
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>XP</TableHead>
                <TableHead>Racha</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.level}</TableCell>
                  <TableCell>{user.xp}</TableCell>
                  <TableCell>{user.streak_days} días</TableCell>
                  <TableCell>
                    {adminStatuses[user.id] ? (
                      <Badge variant="default" className="bg-sagrapp-primary">Admin</Badge>
                    ) : (
                      <Badge variant="outline">Usuario</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={adminStatuses[user.id] ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleAdminStatus(user.id)}
                    >
                      {adminStatuses[user.id] 
                        ? "Quitar Admin" 
                        : "Hacer Admin"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
};

export default AdminUserManager;
