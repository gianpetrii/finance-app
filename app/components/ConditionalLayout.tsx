"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { QuickActions } from "@/components/QuickActions";

const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar Desktop - Colapsable */}
        <div className="hidden lg:block border-r">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 transition-all duration-300">
          <div className="h-full w-full max-w-sm mx-auto px-4 py-6 sm:max-w-md sm:px-6 md:max-w-2xl md:px-8 lg:max-w-[1200px]">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background z-50">
          <Sidebar />
        </div>
      </div>
      
      <QuickActions />
    </>
  );
}
