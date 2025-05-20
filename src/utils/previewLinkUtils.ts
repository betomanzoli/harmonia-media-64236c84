
import { v4 as uuidv4 } from 'uuid';
import { setPreviewAccessCookie, checkPreviewAccessCookie, setPreviewEmailCookie, getAuthCookie } from './authCookies';
import { supabase } from '@/integrations/supabase/client';

// Create a more secure mapping between encoded IDs and project IDs
const previewLinksMap = new Map<string, string>();

// Helper functions to work with cookies
const setCookie = (name: string, value: string, days = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
  
  // Also store in localStorage as a fallback for browsers with strict cookie policies
  try {
    localStorage.setItem(name, value);
  } catch (e) {
    console.error("Failed to store in localStorage:", e);
  }
};

const getCookie = (name: string): string | null => {
  // Try cookies first
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  
  // Try localStorage as fallback
  try {
    return localStorage.getItem(name);
  } catch (e) {
    console.error("Failed to get from localStorage:", e);
  }
  
  return null;
};

// Generate a preview link with a unique encoded ID
export const generatePreviewLink = async (projectId: string): Promise<string> => {
  try {
    // Generate a unique encoded ID that's harder to guess
    const encodedId = uuidv4().replace(/-/g, ''); 
    
    // Update the project record with the preview code
    const { error } = await supabase
      .from('projects')
      .update({ 
        preview_code: encodedId,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);
      
    if (error) {
      console.error('Failed to update preview code:', error);
      throw error;
    }
    
    // Store the mapping locally as a fallback
    previewLinksMap.set(encodedId, projectId);
    
    // Store in cookie and localStorage for better compatibility
    const mappings = JSON.parse(getCookie('previewLinksMappings') || '{}');
    mappings[encodedId] = projectId;
    setCookie('previewLinksMappings', JSON.stringify(mappings));
    
    // Also store in localStorage
    try {
      localStorage.setItem(`preview_link_${encodedId}`, projectId);
    } catch (e) {
      console.error("Failed to store in localStorage:", e);
    }
    
    return encodedId;
  } catch (error) {
    console.error('Error generating preview link:', error);
    return '';
  }
};

// Get project ID from preview link (encoded ID)
export const getProjectIdFromPreviewLink = async (encodedId: string): Promise<string | null> => {
  try {
    // Try to get project ID from database first
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('preview_code', encodedId)
      .single();
      
    if (data && data.id) {
      return data.id;
    }
    
    if (error) {
      console.warn('Error getting project from database:', error);
    }
    
    // Fall back to in-memory map
    let projectId = previewLinksMap.get(encodedId);
    
    // If not found in memory, check in cookies
    if (!projectId) {
      // Try in cookies
      const storedMappings = JSON.parse(getCookie('previewLinksMappings') || '{}');
      projectId = storedMappings[encodedId] || null;
      
      // If not found in cookies, check localStorage directly
      if (!projectId) {
        try {
          projectId = localStorage.getItem(`preview_link_${encodedId}`);
        } catch (e) {
          console.error("Failed to get from localStorage:", e);
        }
      }
      
      // Add to in-memory map if found
      if (projectId) {
        previewLinksMap.set(encodedId, projectId);
      }
    }
    
    return projectId;
  } catch (error) {
    console.error('Error getting project ID from preview link:', error);
    return null;
  }
};

// Authorize access to a project preview
export const authorizeEmailForProject = (email: string, projectId: string): void => {
  try {
    // Store authorization in cookie
    setPreviewAccessCookie(projectId);
    
    // Also store email in cookie for validation
    setPreviewEmailCookie(projectId, email);
    
    // Store in localStorage as well for better browser compatibility
    try {
      localStorage.setItem(`preview_access_${projectId}`, 'authorized');
      localStorage.setItem(`preview_email_${projectId}`, email);
    } catch (e) {
      console.error("Failed to store in localStorage:", e);
    }
  } catch (error) {
    console.error('Error authorizing email for project:', error);
  }
};

// Check if an email is authorized for a project
export const isEmailAuthorizedForProject = (email: string, projectId: string): boolean => {
  try {
    // First check if project is authorized
    if (checkPreviewAccessCookie(projectId)) {
      // Then validate if the email matches
      const storedEmail = getCookie(`preview_email_${projectId}`);
      
      // If not found in cookies, try localStorage
      if (!storedEmail) {
        try {
          const localEmail = localStorage.getItem(`preview_email_${projectId}`);
          return localEmail === email;
        } catch (e) {
          console.error("Failed to get from localStorage:", e);
        }
      }
      
      return storedEmail === email;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking email authorization for project:', error);
    return false;
  }
};

// Load stored mappings from cookies when the module loads
const loadStoredData = () => {
  try {
    // Load from cookies
    const storedMappings = JSON.parse(getCookie('previewLinksMappings') || '{}');
    Object.entries(storedMappings).forEach(([encodedId, projectId]) => {
      previewLinksMap.set(encodedId, projectId as string);
    });
    
    // Also try to load from localStorage for each item
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('preview_link_')) {
          const encodedId = key.replace('preview_link_', '');
          const projectId = localStorage.getItem(key);
          if (projectId) {
            previewLinksMap.set(encodedId, projectId);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load from localStorage:", e);
    }
  } catch (error) {
    console.error('Error loading stored preview data:', error);
  }
};

loadStoredData();
