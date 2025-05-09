
// Auth cookie utilities for Supabase authentication
// This helps with browser private mode compatibility

/**
 * Set authentication cookie
 */
export const setAuthCookie = (name: string, value: string, days: number = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=None; Secure`;
};

/**
 * Get authentication cookie
 */
export const getAuthCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
};

/**
 * Remove authentication cookie
 */
export const removeAuthCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure`;
};

/**
 * Set Supabase access token cookie
 */
export const setAccessTokenCookie = (token: string) => {
  setAuthCookie('sb-access-token', token);
};

/**
 * Get Supabase access token cookie
 */
export const getAccessTokenCookie = () => {
  return getAuthCookie('sb-access-token');
};

/**
 * Set Supabase refresh token cookie
 */
export const setRefreshTokenCookie = (token: string) => {
  setAuthCookie('sb-refresh-token', token);
};

/**
 * Get Supabase refresh token cookie
 */
export const getRefreshTokenCookie = () => {
  return getAuthCookie('sb-refresh-token');
};

/**
 * Store preview access status in cookie
 */
export const setPreviewAccessCookie = (projectId: string) => {
  setAuthCookie(`preview_access_${projectId}`, 'authorized');
};

/**
 * Check preview access status from cookie
 */
export const checkPreviewAccessCookie = (projectId: string): boolean => {
  return getAuthCookie(`preview_access_${projectId}`) === 'authorized';
};

/**
 * Clean all authentication cookies
 */
export const cleanAllAuthCookies = () => {
  // Clean all possible Supabase auth cookies
  removeAuthCookie('sb-access-token');
  removeAuthCookie('sb-refresh-token');
  removeAuthCookie('supabase-auth-token');
  
  // Clean all preview auth cookies (we don't know all the project IDs, so this is a best effort)
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf('preview_access_') === 0) {
      const cookieName = cookie.split('=')[0];
      removeAuthCookie(cookieName);
    }
  }
};
