/**
 * Role-based Access Control Configuration
 *
 * Define which roles can access which routes
 */

export type UserRole = "admin" | "guest";

export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
  description: string;
}

/**
 * Route permissions configuration
 *
 * ADMIN: Full access to all pages
 * GUEST: Limited access - home, profile, and their own appointments/prescriptions
 */
export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Public routes (accessible to both)
  {
    path: "/home",
    allowedRoles: ["admin", "guest"],
    description: "Home page - accessible to all authenticated users",
  },
  {
    path: "/profile",
    allowedRoles: ["admin", "guest"],
    description: "User profile - accessible to all",
  },

  // Guest-specific routes (own data only)
  {
    path: "/my-appointments",
    allowedRoles: ["admin", "guest"],
    description: "My appointments - guest sees only their own",
  },
  {
    path: "/my-prescriptions",
    allowedRoles: ["admin", "guest"],
    description: "My prescriptions - guest sees only their own",
  },
  {
    path: "/book-appointment",
    allowedRoles: ["admin", "guest"],
    description: "Book new appointment - guest can book for themselves",
  },

  // Admin-only routes
  {
    path: "/pacient",
    allowedRoles: ["admin"],
    description: "Patient list - admin only",
  },
  {
    path: "/medicalCare",
    allowedRoles: ["admin"],
    description: "Register new patient - admin only",
  },
  {
    path: "/schedules",
    allowedRoles: ["admin"],
    description: "All schedules - admin only",
  },
  {
    path: "/prescriptions",
    allowedRoles: ["admin"],
    description: "All prescriptions - admin only",
  },
  {
    path: "/medicalPrescription",
    allowedRoles: ["admin"],
    description: "Create prescription - admin only",
  },
  {
    path: "/games",
    allowedRoles: ["admin", "guest"],
    description: "Games - accessible to all",
  },
];

/**
 * Check if a role has access to a specific route
 */
export const hasRouteAccess = (
  route: string,
  userRole: UserRole | null
): boolean => {
  if (!userRole) return false;

  // Admin has access to everything
  if (userRole === "admin") return true;

  // Find route permission
  const permission = ROUTE_PERMISSIONS.find((p) => route.startsWith(p.path));

  if (!permission) {
    // If route not configured, deny access by default
    return false;
  }

  return permission.allowedRoles.includes(userRole);
};

/**
 * Get redirect path based on user role
 */
export const getDefaultRedirect = (userRole: UserRole | null): string => {
  if (userRole === "admin") return "/home";
  if (userRole === "guest") return "/home";
  return "/";
};

/**
 * Guest appointment rules
 */
export const GUEST_APPOINTMENT_RULES = {
  MAX_ACTIVE_APPOINTMENTS: 1,
  ALLOW_BOOKING: true,
  ALLOW_CANCELLATION: true,
  ALLOW_RESCHEDULE: true,
};
