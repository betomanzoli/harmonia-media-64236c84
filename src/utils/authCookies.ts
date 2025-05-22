
// Functions to manage preview access cookies

/**
 * Detects if the browser is likely in private/incognito mode
 */
export const isPrivateBrowsing = async (): Promise<boolean> => {
  try {
    // Method 1: Try to use localStorage (most reliable method)
    const testKey = 'preview-test-key';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    
    // Method 2: Check for specific private mode characteristics
    // This helps with some browsers where localStorage appears to work but doesn't persist
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    
    // Safari on iOS private mode has specific localStorage behavior
    if (isIOS && isSafari) {
      // Alternative approach for detecting Safari private mode
      // without using the non-standard openDatabase method
      try {
        // In Safari private mode, localStorage can be written to but not persisted
        localStorage.setItem(testKey, '2');
        const testValue = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        // Additional check: In private mode, the value might not be properly stored
        if (testValue !== '2') {
          console.log("Detected Safari private mode (localStorage inconsistency)");
          return true;
        }
        
        // Create a 1MB test file in localStorage
        const bigString = new Array(1024 * 1024).join('x');
        localStorage.setItem('bigTest', bigString);
        localStorage.removeItem('bigTest');
      } catch (e) {
        console.log("Detected Safari private mode (localStorage quota error)");
        return true;
      }
    }
    
    // If we get here, localStorage is working normally
    console.log("Browser appears to be in standard mode");
    return false;
  } catch (e) {
    // localStorage failed, likely in private browsing
    console.log("Detected private browsing mode (localStorage unavailable)");
    return true;
  }
};

const isSecureContext = () => {
  return window.location.protocol === 'https:';
};

/**
 * Sets a cookie for preview access with improved private browsing support
 */
export const setPreviewAccessCookie = (projectId: string): void => {
  try {
    if (!projectId) {
      console.error('Project ID is required to set preview access cookie');
      return;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14); // 14 days expiry
    
    // Build cookie with appropriate security settings based on protocol
    let cookieValue = `true; expires=${expiryDate.toUTCString()}; path=/`;
    
    const isSecure = isSecureContext();
    
    // In secure contexts, use SameSite=None with Secure flag
    if (isSecure) {
      cookieValue += '; Secure; SameSite=None';
    } else {
      // In non-secure contexts (HTTP), use SameSite=Lax
      cookieValue += '; SameSite=Lax';
    }
    
    document.cookie = `preview_access_${projectId}=${cookieValue}`;
    
    console.log(`Set preview access cookie for project: ${projectId}, expires: ${expiryDate.toUTCString()}, secure context: ${isSecure}`);
    
    // Also store as a reliable fallback in localStorage for incognito/private browsing
    try {
      localStorage.setItem(`preview_access_${projectId}`, 'true');
      localStorage.setItem(`preview_access_expiry_${projectId}`, expiryDate.toISOString());
    } catch (e) {
      console.warn('Could not set localStorage fallback for preview access', e);
    }
    
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
 * Checks if there's an access cookie for the project, with improved private browsing support
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
      return trimmedCookie.startsWith(`${cookieName}=`);
    });
    
    if (hasCookie) {
      console.log(`Found valid cookie for project: ${projectId}`);
      return true;
    }
    
    // If not found in cookies, check localStorage as fallback (crucial for private browsing)
    try {
      const localStorageAccess = localStorage.getItem(`preview_access_${projectId}`);
      const expiryStr = localStorage.getItem(`preview_access_expiry_${projectId}`);
      
      if (localStorageAccess === 'true' && expiryStr) {
        const expiry = new Date(expiryStr);
        const isValid = expiry > new Date();
        console.log(`Checking localStorage fallback: ${isValid ? 'Valid' : 'Expired'}`);
        return isValid;
      }
    } catch (e) {
      console.warn('Error checking localStorage fallback', e);
    }
    
    console.log(`No valid access found for project ${projectId}`);
    return false;
  } catch (error) {
    console.error('Error checking preview access cookie:', error);
    return false;
  }
};

/**
 * Sets a cookie storing the email used to access a preview, with improved private browsing support
 */
export const setPreviewEmailCookie = (projectId: string, email: string): void => {
  try {
    if (!projectId || !email) {
      console.error('Project ID and email are required to set preview email cookie');
      return;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14); // 14 days expiry
    
    // Build cookie with appropriate security settings based on protocol
    let cookieValue = `${email}; expires=${expiryDate.toUTCString()}; path=/`;
    
    const isSecure = isSecureContext();
    
    // In secure contexts, use SameSite=None with Secure flag
    if (isSecure) {
      cookieValue += '; Secure; SameSite=None';
    } else {
      // In non-secure contexts (HTTP), use SameSite=Lax
      cookieValue += '; SameSite=Lax';
    }
    
    document.cookie = `preview_email_${projectId}=${cookieValue}`;
    
    console.log(`Set preview email cookie for project: ${projectId}, email: ${email}`);
    
    // Also store as a reliable fallback in localStorage for incognito/private browsing
    try {
      localStorage.setItem(`preview_email_${projectId}`, email);
      localStorage.setItem(`preview_email_expiry_${projectId}`, expiryDate.toISOString());
    } catch (e) {
      console.warn('Could not set localStorage fallback for preview email', e);
    }
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
    
    // Check localStorage as fallback
    try {
      const value = localStorage.getItem(cookieName);
      const expiryStr = localStorage.getItem(`${cookieName}_expiry`);
      
      if (value && expiryStr) {
        const expiry = new Date(expiryStr);
        if (expiry > new Date()) {
          console.log(`Found value in localStorage for ${cookieName}`);
          return value;
        }
      }
    } catch (e) {
      console.warn('Error checking localStorage fallback', e);
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
  
  const cookieName = `preview_email_${projectId}`;
  const cookieValue = getAuthCookie(cookieName);
  
  if (!cookieValue) {
    // Check localStorage as fallback
    try {
      const email = localStorage.getItem(cookieName);
      const expiryStr = localStorage.getItem(`${cookieName}_expiry`);
      
      if (email && expiryStr) {
        const expiry = new Date(expiryStr);
        if (expiry > new Date()) {
          console.log(`Found email in localStorage for ${projectId}`);
          return email;
        }
      }
    } catch (e) {
      console.warn('Error checking localStorage fallback', e);
    }
  }
  
  return cookieValue;
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
    
    // Also clear localStorage fallbacks
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('preview_access_') || key.startsWith('preview_email_')) {
          localStorage.removeItem(key);
          clearedCount++;
        }
      });
    } catch (e) {
      console.warn('Error clearing localStorage fallbacks', e);
    }
    
    console.log(`Cleared ${clearedCount} preview cookies/storage items`);
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
  
  // Also log localStorage items related to preview access
  console.log('=== Preview LocalStorage Items ===');
  try {
    let foundItems = 0;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('preview_access_') || key.startsWith('preview_email_')) {
        console.log(`${key}: ${localStorage.getItem(key)}`);
        foundItems++;
      }
    });
    if (foundItems === 0) {
      console.log('No preview items in localStorage');
    }
  } catch (e) {
    console.log('Error reading localStorage:', e);
  }
  console.log('=====================');
};
