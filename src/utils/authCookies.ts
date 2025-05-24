
// Functions to manage preview access cookies

/**
 * Sets a cookie for preview access
 */
export const setPreviewAccessCookie = (projectId: string): void => {
  try {
    if (!projectId) {
      console.error('Project ID is required to set preview access cookie');
      return;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14); // 14 days expiry
    
    const cookieValue = `true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    document.cookie = `preview_access_${projectId}=${cookieValue}`;
    
    console.log(`Set preview access cookie for project: ${projectId}, expires: ${expiryDate.toUTCString()}`);
    
    // Verify cookie was set correctly
    setTimeout(() => {
      const cookieExists = checkPreviewAccessCookie(projectId);
      console.log(`Cookie verification: ${cookieExists ? 'Successfully set' : 'Failed to set'}`);
    }, 100);
  } catch (error) {
    console.error('Error setting preview access cookie:', error);
  }
};

/**
 * Checks if there's an access cookie for the project
 */
export const checkPreviewAccessCookie = (projectId: string): boolean => {
  try {
    if (!projectId) {
      console.error('Project ID is required to check preview access cookie');
      return false;
    }
    
    const cookies = document.cookie.split(';');
    const cookieName = `preview_access_${projectId}`;
    
    console.log(`Looking for cookie: ${cookieName}`);
    console.log(`All cookies: ${document.cookie}`);
    
    const hasCookie = cookies.some(cookie => {
      const trimmedCookie = cookie.trim();
      const result = trimmedCookie.startsWith(`${cookieName}=`);
      console.log(`Checking cookie: ${trimmedCookie}, match: ${result}`);
      return result;
    });
    
    console.log(`Checking preview access cookie for ${projectId}: ${hasCookie ? 'Found' : 'Not found'}`);
    return hasCookie;
  } catch (error) {
    console.error('Error checking preview access cookie:', error);
    return false;
  }
};

/**
 * Sets a cookie storing the email used to access a preview
 */
export const setPreviewEmailCookie = (projectId: string, email: string): void => {
  try {
    if (!projectId || !email) {
      console.error('Project ID and email are required to set preview email cookie');
      return;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14); // 14 days expiry
    
    const cookieValue = `${email}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    document.cookie = `preview_email_${projectId}=${cookieValue}`;
    
    console.log(`Set preview email cookie for project: ${projectId}, email: ${email}`);
  } catch (error) {
    console.error('Error setting preview email cookie:', error);
  }
};

/**
 * Gets the email from the auth cookie if present
 */
export const getAuthCookie = (cookieName: string): string | null => {
  try {
    if (!cookieName) {
      console.error('Cookie name is required');
      return null;
    }
    
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting auth cookie:', error);
    return null;
  }
};

/**
 * Gets the email associated with a project preview
 */
export const getPreviewEmailCookie = (projectId: string): string | null => {
  if (!projectId) return null;
  return getAuthCookie(`preview_email_${projectId}`);
};

/**
 * Clears all preview access cookies
 */
export const clearPreviewCookies = (): void => {
  try {
    const cookies = document.cookie.split(';');
    
    // Debug current cookies
    console.log('Current cookies before clearing:', document.cookie);
    
    let clearedCount = 0;
    for (let cookie of cookies) {
      const cookieName = cookie.split('=')[0].trim();
      if (cookieName.startsWith('preview_access_') || cookieName.startsWith('preview_email_')) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        clearedCount++;
      }
    }
    
    console.log(`Cleared ${clearedCount} preview cookies`);
    console.log('Cookies after clearing:', document.cookie);
  } catch (error) {
    console.error('Error clearing preview cookies:', error);
  }
};

/**
 * Debug helper: Log all cookies
 */
export const debugCookies = (): void => {
  console.log('=== Current Cookies ===');
  const cookies = document.cookie.split(';');
  if (cookies.length === 1 && cookies[0] === '') {
    console.log('No cookies found');
  } else {
    cookies.forEach((cookie, index) => {
      console.log(`Cookie ${index + 1}: ${cookie.trim()}`);
    });
  }
  console.log('=====================');
};
