
import { v4 as uuidv4 } from 'uuid';
import { setPreviewAccessCookie, checkPreviewAccessCookie, setPreviewEmailCookie, getAuthCookie } from './authCookies';
import { supabase } from '@/lib/supabase';

// Create a more secure mapping between encoded IDs and project IDs
const previewLinksMap = new Map<string, string>();

// Helper functions to work with cookies
const setCookie = (name: string, value: string, days = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; Secure; SameSite=None`;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
};

// Generate a random token
const generateToken = () => {
  return Array(32)
    .fill(0)
    .map(() => Math.random().toString(36).charAt(2))
    .join('');
};

// Generate a preview link with a unique encoded ID and access token
export const generatePreviewLink = async (projectId: string): Promise<string> => {
  try {
    // Generate a unique encoded ID that's harder to guess
    const encodedId = uuidv4().replace(/-/g, ''); 
    
    // Generate a random access token
    const token = generateToken();
    
    // Set the expiration date (14 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14);
    
    // Store the token in the database
    const { error: tokenError } = await supabase
      .from('preview_tokens')
      .insert({
        preview_id: projectId,
        token: token,
        expires_at: expirationDate.toISOString()
      });
    
    if (tokenError) {
      console.error('Failed to store preview token:', tokenError);
      // Continue without token if there's an error
    }
    
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
    
    // Store in cookie instead of localStorage
    const mappings = JSON.parse(getCookie('previewLinksMappings') || '{}');
    mappings[encodedId] = projectId;
    setCookie('previewLinksMappings', JSON.stringify(mappings));
    
    // Return link with token
    return `${encodedId}?token=${token}`;
  } catch (error) {
    console.error('Error generating preview link:', error);
    return '';
  }
};

// Get project ID from preview link (encoded ID)
export const getProjectIdFromPreviewLink = async (encodedId: string): Promise<string | null> => {
  try {
    // Extract the project ID from the encoded ID (remove any query params)
    const cleanEncodedId = encodedId.split('?')[0];
    
    // Try to get project ID from database first
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('preview_code', cleanEncodedId)
      .single();
      
    if (data && data.id) {
      return data.id;
    }
    
    if (error) {
      console.warn('Error getting project from database:', error);
    }
    
    // Fall back to in-memory map
    let projectId = previewLinksMap.get(cleanEncodedId);
    
    // If not found in memory, check in cookies
    if (!projectId) {
      const storedMappings = JSON.parse(getCookie('previewLinksMappings') || '{}');
      projectId = storedMappings[cleanEncodedId] || null;
      
      // Add to in-memory map if found
      if (projectId) {
        previewLinksMap.set(cleanEncodedId, projectId);
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
    const storedMappings = JSON.parse(getCookie('previewLinksMappings') || '{}');
    Object.entries(storedMappings).forEach(([encodedId, projectId]) => {
      previewLinksMap.set(encodedId, projectId as string);
    });
  } catch (error) {
    console.error('Error loading stored preview data:', error);
  }
};

loadStoredData();
