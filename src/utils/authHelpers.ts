import { User } from '../hooks/useAuth';

/**
 * Role hierarchy for permission checking
 */
export const ROLE_HIERARCHY = {
  admin: 4,
  hr: 3,
  team_lead: 2,
  employee: 1,
} as const;

/**
 * Check if user has required role or higher
 */
export const hasRole = (userRole: string, requiredRole: string): boolean => {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 0;
  return userLevel >= requiredLevel;
};

/**
 * Check if user has any of the required roles
 */
export const hasAnyRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

/**
 * Get dashboard route based on user role
 */
export const getDashboardRoute = (role: string): string => {
  switch (role) {
    case 'admin':
    case 'hr':
      return '/admin/dashboard';
    case 'team_lead':
      return '/team-lead/dashboard';
    case 'employee':
      return '/employee/dashboard';
    default:
      return '/login';
  }
};

/**
 * Check if user can access a specific route
 */
export const canAccessRoute = (user: User | null, allowedRoles: string[]): boolean => {
  if (!user) return false;
  if (allowedRoles.length === 0) return true;
  return hasAnyRole(user.role, allowedRoles);
};

/**
 * Validate user session
 */
export const isValidSession = (user: User | null, token: string | null): boolean => {
  return !!(user && token && user.status === 'active');
};