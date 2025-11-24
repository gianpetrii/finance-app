"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ArrowRight, 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  Shield, 
  Smartphone,
  Zap
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Verificar autenticación de forma lazy (solo si es necesario)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Importar dinámicamente solo cuando se necesita
        const { auth } = await import("@/app/lib/firebase");
        const { onAuthStateChanged } = await import("firebase/auth");
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            // Si está autenticado, redirigir al dashboard
            router.push("/dashboard");
          } else {
            // Si no está autenticado, mostrar landing page
            setIsChecking(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Mostrar loading solo mientras verifica (muy rápido)
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Gestiona tus finanzas de manera{" "}
              <span className="text-primary">inteligente</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              FinancialAdvisor te ayuda a controlar tus ingresos, gastos y ahorros de forma simple y efectiva.
              Todo en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/register">
                  Comenzar Gratis <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/login">
                  Iniciar Sesión
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Todo lo que necesitas para controlar tu dinero
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Herramientas poderosas y fáciles de usar para gestionar tus finanzas personales
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Control de Ingresos</CardTitle>
                <CardDescription>
                  Registra y visualiza todos tus ingresos mensuales de forma clara y organizada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Análisis de Gastos</CardTitle>
                <CardDescription>
                  Gráficos interactivos que te muestran en qué gastas tu dinero y cómo optimizarlo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gestión de Tarjetas</CardTitle>
                <CardDescription>
                  Controla el saldo y movimientos de todas tus tarjetas de crédito y débito
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>100% Seguro</CardTitle>
                <CardDescription>
                  Tus datos están protegidos con Firebase Authentication y encriptación de extremo a extremo
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Responsive Design</CardTitle>
                <CardDescription>
                  Accede desde cualquier dispositivo: móvil, tablet o computadora
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rápido y Eficiente</CardTitle>
                <CardDescription>
                  Interfaz optimizada para una experiencia fluida y sin demoras
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Gratis</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Disponible</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">∞</div>
              <div className="text-muted-foreground">Transacciones</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Listo para tomar control de tus finanzas?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Únete hoy y comienza a gestionar tu dinero de manera inteligente
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link href="/register">
              Crear Cuenta Gratis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
    <Footer />
    </>
  );
}

