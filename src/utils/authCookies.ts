
// Cookie utilities for preview access

/**
 * Set a cookie for preview access
 */
export const setPreviewAccessCookie = (previewId: string, expiryDays = 7): void => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + expiryDays);
  
  const cookieName = `preview_access_${previewId}`;
  const cookieValue = 'granted';
  const cookieExpiry = `expires=${expiry.toUTCString()}`;
  
  document.cookie = `${cookieName}=${cookieValue}; ${cookieExpiry}; path=/; SameSite=Lax`;
};

/**
 * Set a cookie for preview email identification
 */
export const setPreviewEmailCookie = (previewId: string, email: string, expiryDays = 7): void => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + expiryDays);
  
  const cookieName = `preview_email_${previewId}`;
  const cookieValue = email;
  const cookieExpiry = `expires=${expiry.toUTCString()}`;
  
  document.cookie = `${cookieName}=${cookieValue}; ${cookieExpiry}; path=/; SameSite=Lax`;
};

/**
 * Check if preview access cookie exists
 */
export const checkPreviewAccessCookie = (previewId: string): boolean => {
  const cookieName = `preview_access_${previewId}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length) === 'granted';
    }
  }
  
  return false;
};

/**
 * Get preview email cookie
 */
export const getPreviewEmailCookie = (previewId: string): string | null => {
  const cookieName = `preview_email_${previewId}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length);
    }
  }
  
  return null;
};

/**
 * Get any auth cookie by name
 */
export const getAuthCookie = (name: string): string | null => {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length);
    }
  }
  
  return null;
};

/**
 * Clear a preview access cookie
 */
export const clearPreviewAccessCookie = (previewId: string): void => {
  const cookieName = `preview_access_${previewId}`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

/**
 * Clear preview email cookie
 */
export const clearPreviewEmailCookie = (previewId: string): void => {
  const cookieName = `preview_email_${previewId}`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

/**
 * Clear all preview-related cookies
 */
export const clearAllPreviewCookies = (): void => {
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const cookieParts = cookie.split('=');
    const cookieName = cookieParts[0];
    
    if (cookieName.startsWith('preview_')) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    }
  }
};
