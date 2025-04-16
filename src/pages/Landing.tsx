
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Award, Heart, Zap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sagrapp-accent">
      {/* Navigation */}
      <nav className="container mx-auto py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-sagrapp-primary" />
          <span className="text-2xl font-bold text-sagrapp-primary">Sagrapp</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/login")}
            className="font-medium"
          >
            Iniciar sesión
          </Button>
          <Button 
            onClick={() => navigate("/register")}
            className="font-medium bg-sagrapp-primary hover:bg-sagrapp-secondary"
          >
            Registrarse
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-12 md:py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sagrapp-text leading-tight">
              Aprende la Biblia de forma <span className="text-sagrapp-primary">divertida y efectiva</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Una experiencia gamificada para fortalecer tu conocimiento bíblico a través de lecciones interactivas, desafíos diarios y seguimiento de progreso.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Button 
                onClick={() => navigate("/register")}
                size="lg"
                className="bg-sagrapp-primary hover:bg-sagrapp-secondary text-white font-semibold rounded-full px-8"
              >
                Comenzar gratis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full px-8"
              >
                Conocer más
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto max-w-md"
          >
            <div className="rounded-2xl bg-white shadow-xl overflow-hidden border-4 border-sagrapp-primary/20">
              <div className="p-6 bg-sagrapp-primary text-white">
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-8 w-8" />
                  <h3 className="text-xl font-bold">Sagrapp Journey</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-sagrapp-primary/20 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-sagrapp-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tu racha</p>
                      <p className="text-xl font-bold">7 días</p>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Nivel</div>
                    <div className="text-xl font-bold">5</div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold">Próxima lección</h4>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-sagrapp-primary" />
                    </div>
                    <div>
                      <p className="font-medium">La Fe de Jesús</p>
                      <p className="text-sm text-gray-500">Lección 3 de 20</p>
                    </div>
                  </div>
                  <Button className="w-full bg-sagrapp-primary hover:bg-sagrapp-secondary">
                    Continuar aprendiendo
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progreso del curso</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-sagrapp-primary h-2.5 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Qué hace especial a Sagrapp?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una experiencia diseñada para enriquecer tu conocimiento bíblico de manera entretenida y efectiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <FeatureCard 
            icon={<BookOpen className="h-8 w-8 text-sagrapp-primary" />}
            title="Lecciones interactivas"
            description="Aprende con lecciones estructuradas, preguntas interactivas y reflexiones guiadas."
          />
          <FeatureCard 
            icon={<Zap className="h-8 w-8 text-sagrapp-primary" />}
            title="Sistema de XP y niveles"
            description="Gana experiencia espiritual y sube de nivel mientras aprendes y creces en conocimiento."
          />
          <FeatureCard 
            icon={<Award className="h-8 w-8 text-sagrapp-primary" />}
            title="Logros y medallas"
            description="Desbloquea logros por completar cursos, mantener rachas y participar activamente."
          />
          <FeatureCard 
            icon={<Heart className="h-8 w-8 text-sagrapp-primary" />}
            title="Racha espiritual"
            description="Mantén una racha diaria de estudio bíblico para formar un hábito duradero."
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-sagrapp-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comienza tu viaje bíblico hoy
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Únete a nuestra comunidad y fortalece tu conocimiento espiritual de manera divertida y efectiva.
          </p>
          <Button 
            onClick={() => navigate("/register")}
            size="lg"
            className="bg-white text-sagrapp-primary hover:bg-gray-100 font-semibold rounded-full px-8"
          >
            Crear cuenta gratis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-sagrapp-primary" />
              <span className="text-xl font-bold">Sagrapp</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-sagrapp-primary transition-colors">Términos</a>
              <a href="#" className="hover:text-sagrapp-primary transition-colors">Privacidad</a>
              <a href="#" className="hover:text-sagrapp-primary transition-colors">Contacto</a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Sagrapp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    >
      <div className="w-14 h-14 bg-sagrapp-accent rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Landing;
