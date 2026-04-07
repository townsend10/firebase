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

/**
 * Server-side role verification — fetches user role from Firestore
 * using the Admin SDK (trusted, server-only, no client SDK).
 */

import { adminDb } from "@/app/api/firebase/firebase-admin";

export async function getServerSideRole(userId: string): Promise<{ role: string | null }> {
  try {
    const usersRef = adminDb.collection("users");

    // Try to fetch by document ID first (most common case: id = document ID from useUserRole)
    const docSnap = await usersRef.doc(userId).get();
    if (docSnap.exists) {
      const data = docSnap.data()!;
      return { role: data.role || "guest" };
    }

    // Fallback: search by uid field (in case id is the Firebase Auth UID)
    const snapshot = await usersRef.where("uid", "==", userId).get();

    if (snapshot.empty) {
      return { role: null };
    }

    const userData = snapshot.docs[0].data();
    return { role: userData.role || "guest" };
  } catch {
    return { role: null };
  }
}

/**
 * Server action guards — receive TRUSTED server-side verified role
 */

export function requireAdmin(userRole: string) {
  if (userRole !== "admin") {
    return { error: "Acesso negado. Apenas administradores podem realizar esta acao." };
  }
}

export function requireAuth(userRole: string) {
  if (!userRole) {
    return { error: "Usuario nao autenticado." };
  }
}

export function requireOwnership(
  userRole: string,
  userId: string,
  resourceOwnerId: string | undefined,
) {
  if (!userRole || !userId) {
    return { error: "Usuario nao autenticado." };
  }
  if (userRole === "admin") return;
  if (resourceOwnerId !== userId) {
    return { error: "Voce nao tem permissao para acessar este recurso." };
  }
}

