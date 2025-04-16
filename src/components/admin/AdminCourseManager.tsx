
import { useState, useEffect } from "react";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "@/services/adminService";
import { Course } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminCourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    is_active: true,
    image_url: "",
  });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const coursesData = await getAllCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Error al cargar cursos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      setIsSubmitting(true);
      if (!newCourse.title || !newCourse.description) {
        toast.error("El título y la descripción son obligatorios");
        return;
      }

      await createCourse({
        title: newCourse.title,
        description: newCourse.description,
        is_active: newCourse.is_active,
        image_url: newCourse.image_url || null,
      });

      toast.success("Curso creado exitosamente");
      setNewCourse({
        title: "",
        description: "",
        is_active: true,
        image_url: "",
      });
      loadCourses();
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Error al crear curso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCourse = async () => {
    if (!editingCourse) return;
    
    try {
      setIsSubmitting(true);
      
      await updateCourse(editingCourse.id, {
        title: editingCourse.title,
        description: editingCourse.description,
        is_active: editingCourse.is_active,
        image_url: editingCourse.image_url,
      });
      
      toast.success("Curso actualizado exitosamente");
      setEditingCourse(null);
      loadCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Error al actualizar curso");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      toast.success("Curso eliminado exitosamente");
      loadCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error al eliminar curso");
    }
  };

  const handleReorderCourses = async (courseId: string, direction: 'up' | 'down') => {
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return;
    
    if (direction === 'up' && courseIndex === 0) return;
    if (direction === 'down' && courseIndex === courses.length - 1) return;
    
    const newCourses = [...courses];
    const swapIndex = direction === 'up' ? courseIndex - 1 : courseIndex + 1;
    
    // Swap order_index values
    const currentOrderIndex = newCourses[courseIndex].order_index;
    const swapOrderIndex = newCourses[swapIndex].order_index;
    
    try {
      // Update first course
      await updateCourse(newCourses[courseIndex].id, {
        order_index: swapOrderIndex
      });
      
      // Update second course
      await updateCourse(newCourses[swapIndex].id, {
        order_index: currentOrderIndex
      });
      
      toast.success("Orden actualizado");
      loadCourses();
    } catch (error) {
      console.error("Error reordering courses:", error);
      toast.error("Error al reordenar cursos");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cursos ({courses.length})</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-sagrapp-primary">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Curso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Curso</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">URL de Imagen</Label>
                <Input
                  id="image_url"
                  value={newCourse.image_url}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, image_url: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={newCourse.is_active}
                  onCheckedChange={(checked) =>
                    setNewCourse({ ...newCourse, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Activo</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="mr-2">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                disabled={isSubmitting || !newCourse.title || !newCourse.description}
                onClick={handleAddCourse}
              >
                {isSubmitting ? "Creando..." : "Crear Curso"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-sagrapp-primary" />
        </div>
      ) : courses.length === 0 ? (
        <p className="text-center py-6 text-gray-500">
          No hay cursos disponibles. Crea tu primer curso.
        </p>
      ) : (
        <Card>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Lecciones</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="flex space-x-2">
                      <div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorderCourses(course.id, 'up')}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorderCourses(course.id, 'down')}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="py-2">{course.order_index}</span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {course.description}
                    </TableCell>
                    <TableCell>
                      {course.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X className="mr-1 h-3 w-3" /> Inactivo
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{course.lesson_count}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setEditingCourse(course)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Curso</DialogTitle>
                          </DialogHeader>
                          {editingCourse && (
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Título</Label>
                                <Input
                                  id="edit-title"
                                  value={editingCourse.title}
                                  onChange={(e) =>
                                    setEditingCourse({
                                      ...editingCourse,
                                      title: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">
                                  Descripción
                                </Label>
                                <Textarea
                                  id="edit-description"
                                  rows={3}
                                  value={editingCourse.description}
                                  onChange={(e) =>
                                    setEditingCourse({
                                      ...editingCourse,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-image-url">
                                  URL de Imagen
                                </Label>
                                <Input
                                  id="edit-image-url"
                                  value={editingCourse.image_url || ""}
                                  onChange={(e) =>
                                    setEditingCourse({
                                      ...editingCourse,
                                      image_url: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-is-active"
                                  checked={editingCourse.is_active}
                                  onCheckedChange={(checked) =>
                                    setEditingCourse({
                                      ...editingCourse,
                                      is_active: checked,
                                    })
                                  }
                                />
                                <Label htmlFor="edit-is-active">Activo</Label>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="mr-2">
                                Cancelar
                              </Button>
                            </DialogClose>
                            <Button
                              onClick={handleEditCourse}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Eliminar Curso</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <p>
                              ¿Estás seguro de que deseas eliminar el curso "
                              {course.title}"? Esta acción no puede deshacerse.
                            </p>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="mr-2">
                                Cancelar
                              </Button>
                            </DialogClose>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              Eliminar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default AdminCourseManager;
