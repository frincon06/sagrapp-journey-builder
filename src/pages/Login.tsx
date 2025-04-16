
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
      // Navigation is handled in AuthContext after successful login
    } catch (error) {
      console.error("Login error:", error);
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
              <h1 className="text-2xl font-bold">Iniciar sesión en Sagrapp</h1>
              <p className="text-gray-600 mt-2 text-center">
                Continúa tu viaje espiritual
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-sagrapp-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-sagrapp-primary hover:bg-sagrapp-secondary"
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-sagrapp-primary hover:underline font-medium"
                >
                  Regístrate
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

export default Login;
