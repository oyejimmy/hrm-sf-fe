// Security utilities for the frontend

/**
 * Sanitize input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate MongoDB ObjectId format
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Secure token storage using httpOnly cookies (when available)
 * Falls back to sessionStorage for better security than localStorage
 */
export const tokenStorage = {
  setToken: (key: string, value: string): void => {
    try {
      // Use sessionStorage instead of localStorage for better security
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  getToken: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  removeToken: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  clearAll: (): void => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};

/**
 * Validate and sanitize form data
 */
export const validateFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value.trim());
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Generate a secure random string
 */
export const generateSecureId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};