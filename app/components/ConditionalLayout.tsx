"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { QuickActions } from "@/components/QuickActions";

// Cargar Sidebar dinámicamente solo cuando se necesite
const Sidebar = dynamic(() => import("./Sidebar").then(mod => ({ default: mod.Sidebar })), {
  ssr: false,
});

// Rutas que NO deben mostrar el Sidebar
const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    // Layout sin Sidebar para páginas públicas - Carga rápida
    return <main className="flex-1">{children}</main>;
  }

  // Layout con Sidebar para páginas protegidas - Carga solo cuando se necesita
  return (
    <>
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar - Oculto en mobile, visible en desktop */}
        <div className="hidden lg:block lg:w-64 border-r">
          <Sidebar />
        </div>

        {/* Main content - Full width en mobile */}
        <main className="flex-1 transition-all duration-200">
          <div className="h-full w-full max-w-sm mx-auto px-4 py-6 sm:max-w-md sm:px-6 md:max-w-2xl md:px-8 lg:max-w-[1200px]">
            {children}
          </div>
        </main>

        {/* Mobile navigation en la parte inferior */}
        <div className="lg:hidden border-t">
          <Sidebar />
        </div>
      </div>
      
      {/* Quick Actions Button */}
      <QuickActions />
    </>
  );
}

