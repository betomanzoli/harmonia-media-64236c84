
/**
 * Sets a cookie with the given name, value and options
 * 
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options (path, max-age, etc.)
 */
export const setCookie = (name: string, value: string, options: Record<string, string> = {}): void => {
  const defaultOptions = {
    path: '/',
    maxAge: '86400', // 1 day
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:',
  };
  
  const cookieOptions = { ...defaultOptions, ...options };
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  Object.entries(cookieOptions).forEach(([key, val]) => {
    const formattedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cookieString += `; ${formattedKey}=${val}`;
  });
  
  document.cookie = cookieString;
  console.log(`[Cookie] Set: ${name}`);
};

/**
 * Gets a cookie by name
 * 
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookieArray = document.cookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let c = cookieArray[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  
  return null;
};

/**
 * Deletes a cookie by name
 * 
 * @param name - Cookie name
 * @param path - Cookie path (defaults to '/')
 */
export const deleteCookie = (name: string, path = '/'): void => {
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  console.log(`[Cookie] Deleted: ${name}`);
};

/**
 * Alias for deleteCookie to maintain compatibility with existing code
 */
export const removeCookie = deleteCookie;

/**
 * Sets a JSON object as a cookie
 * 
 * @param name - Cookie name
 * @param value - Object to stringify and store
 * @param options - Cookie options
 */
export const setJsonCookie = (name: string, value: any, options: Record<string, string> = {}): void => {
  try {
    const jsonValue = JSON.stringify(value);
    setCookie(name, jsonValue, options);
  } catch (error) {
    console.error('[Cookie] Error setting JSON cookie:', error);
  }
};

/**
 * Gets a JSON cookie by name
 * 
 * @param name - Cookie name
 * @returns Parsed object or null if not found or invalid JSON
 */
export const getJsonCookie = <T = any>(name: string): T | null => {
  const cookieValue = getCookie(name);
  
  if (!cookieValue) return null;
  
  try {
    return JSON.parse(cookieValue) as T;
  } catch (error) {
    console.error('[Cookie] Error parsing JSON cookie:', error);
    return null;
  }
};
