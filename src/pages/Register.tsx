
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signUp(email, password, fullName);
      // Navigation is handled in AuthContext after successful registration
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sagrapp-accent flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center text-sagrapp-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>
      </div>

      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="h-10 w-10 text-sagrapp-primary" />
              </div>
              <h1 className="text-2xl font-bold">Crear una cuenta en Sagrapp</h1>
              <p className="text-gray-600 mt-2 text-center">
                Comienza tu viaje de conocimiento bíblico
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-sagrapp-primary hover:bg-sagrapp-secondary"
              >
                {isSubmitting ? "Registrando..." : "Crear cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-sagrapp-primary hover:underline font-medium"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Sagrapp. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default Register;
