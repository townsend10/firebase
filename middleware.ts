import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public routes (accessible to everyone)
  const publicRoutes = ["/", "/login", "/register"];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For all other routes, allow access
  // Authentication will be handled client-side by ProtectedRoute component
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
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
