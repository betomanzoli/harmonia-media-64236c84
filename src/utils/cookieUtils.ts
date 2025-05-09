
/**
 * Cookie utility functions for storing data in cookies rather than localStorage
 * to support private/anonymous browsing modes
 */

// Set a cookie with options
export const setCookie = (name: string, value: string, options: Record<string, string> = {}): void => {
  const defaultOptions = {
    path: '/',
    maxAge: '86400', // 1 day in seconds
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
  console.log(`Cookie set: ${name} with options:`, cookieOptions);
};

// Get a cookie by name
export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookieArray = document.cookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let c = cookieArray[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
};

// Remove a cookie
export const removeCookie = (name: string): void => {
  setCookie(name, '', { maxAge: '-1' });
};

// Set a JSON value in a cookie
export const setJsonCookie = <T>(name: string, value: T, options: Record<string, string> = {}): void => {
  try {
    const jsonValue = JSON.stringify(value);
    setCookie(name, jsonValue, options);
  } catch (error) {
    console.error(`Error setting JSON cookie ${name}:`, error);
  }
};

// Get a JSON value from a cookie
export const getJsonCookie = <T>(name: string): T | null => {
  const cookieValue = getCookie(name);
  if (!cookieValue) return null;
  
  try {
    return JSON.parse(cookieValue) as T;
  } catch (error) {
    console.error(`Error parsing JSON cookie ${name}:`, error);
    return null;
  }
};
