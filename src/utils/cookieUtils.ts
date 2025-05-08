
/**
 * Utility functions for handling cookies for preview access
 * This replaces localStorage usage for better compatibility with private/incognito modes
 */

/**
 * Set a cookie with the specified parameters
 */
export const setCookie = (name: string, value: string, options: Record<string, any> = {}): void => {
  const defaultOptions = {
    path: '/',
    secure: true,
    sameSite: 'None',
    maxAge: 86400 // 24 hours
  };
  
  const cookieOptions = { ...defaultOptions, ...options };
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  Object.entries(cookieOptions).forEach(([key, value]) => {
    if (key === 'maxAge') {
      cookieString += `; max-age=${value}`;
    } else if (value === true) {
      cookieString += `; ${key}`;
    } else if (value !== false && value != null) {
      cookieString += `; ${key}=${value}`;
    }
  });
  
  document.cookie = cookieString;
  console.log(`Cookie set: ${name} (expires in ${cookieOptions.maxAge} seconds)`);
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${encodeURIComponent(name)}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  
  return null;
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (name: string): void => {
  document.cookie = `${encodeURIComponent(name)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure`;
  console.log(`Cookie removed: ${name}`);
};

/**
 * Set a JSON object as cookie value
 */
export const setJsonCookie = (name: string, value: any, options: Record<string, any> = {}): void => {
  try {
    const jsonValue = JSON.stringify(value);
    setCookie(name, jsonValue, options);
  } catch (error) {
    console.error(`Error setting JSON cookie ${name}:`, error);
  }
};

/**
 * Get a JSON object from cookie value
 */
export const getJsonCookie = <T = any>(name: string): T | null => {
  try {
    const cookieValue = getCookie(name);
    if (!cookieValue) return null;
    return JSON.parse(cookieValue) as T;
  } catch (error) {
    console.error(`Error parsing JSON cookie ${name}:`, error);
    return null;
  }
};
