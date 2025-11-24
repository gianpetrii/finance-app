"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Wallet, Bell, Settings, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  // Rutas públicas
  const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!user?.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Links de navegación para usuarios autenticados
  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Finanzas", href: "/transactions" },
    { name: "Gastos Diarios", href: "/daily-expenses" },
    { name: "Reportes", href: "/reports" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">FinancialAdvisor</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {!loading && user && !isPublicRoute && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </>
            )}

            {!loading && !user && isPublicRoute && (
              <>
                <Link
                  href="/#features"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Funciones
                </Link>
                <Link
                  href="/#pricing"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Precios
                </Link>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {loading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Usuario"} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || "Usuario"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Configuración
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Comenzar Gratis</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            {!loading && user && !isPublicRoute ? (
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  href="/#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md"
                >
                  Funciones
                </Link>
                <Link
                  href="/#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md"
                >
                  Precios
                </Link>
                {!user && (
                  <>
                    <Button asChild variant="ghost" className="justify-start">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        Iniciar Sesión
                      </Link>
                    </Button>
                    <Button asChild className="justify-start">
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        Comenzar Gratis
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

