import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/", "/login", "/register", "/forgot-password"];

// Rutas protegidas que requieren autenticación
const protectedRoutes = ["/dashboard", "/transactions", "/daily-expenses", "/cards", "/services", "/notifications", "/budget", "/goals", "/reports", "/accounts", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso a archivos estáticos y API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Permitir acceso a rutas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Por ahora, este middleware es básico
  // La protección real de rutas se hace en el cliente con useAuth
  // En producción, deberías usar Firebase Admin SDK para verificar tokens

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

