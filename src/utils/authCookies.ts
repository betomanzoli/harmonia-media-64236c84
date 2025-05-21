
// Functions to manage preview access cookies

/**
 * Sets a cookie for preview access
 */
export const setPreviewAccessCookie = (projectId: string): void => {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14); // 14 days expiry
    
    document.cookie = `preview_access_${projectId}=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    console.log(`Set preview access cookie for project: ${projectId}`);
  } catch (error) {
    console.error('Error setting preview access cookie:', error);
  }
};

/**
 * Checks if there's an access cookie for the project
 */
export const checkPreviewAccessCookie = (projectId: string): boolean => {
  try {
    const cookies = document.cookie.split(';');
    const cookieName = `preview_access_${projectId}=`;
    
    const hasCookie = cookies.some(cookie => 
      cookie.trim().startsWith(cookieName)
    );
    
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
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14); // 14 days expiry
    
    document.cookie = `preview_email_${projectId}=${email}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  } catch (error) {
    console.error('Error setting preview email cookie:', error);
  }
};

/**
 * Gets the email from the auth cookie if present
 */
export const getAuthCookie = (cookieName: string): string | null => {
  try {
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
 * Clears all preview access cookies
 */
export const clearPreviewCookies = (): void => {
  try {
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      const cookieName = cookie.split('=')[0].trim();
      if (cookieName.startsWith('preview_access_') || cookieName.startsWith('preview_email_')) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }
    
    console.log('All preview cookies cleared');
  } catch (error) {
    console.error('Error clearing preview cookies:', error);
  }
};
