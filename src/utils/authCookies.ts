
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
 * Clear a preview access cookie
 */
export const clearPreviewAccessCookie = (previewId: string): void => {
  const cookieName = `preview_access_${previewId}`;
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};
