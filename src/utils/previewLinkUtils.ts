
import { v4 as uuidv4 } from 'uuid';
import { setPreviewAccessCookie, checkPreviewAccessCookie } from './authCookies';
import { supabase } from '@/integrations/supabase/client';

// Create a more secure mapping between encoded IDs and project IDs
const previewLinksMap = new Map<string, string>();

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
    
    // Store this in localStorage for persistence
    // This will be used as a fallback if the database query fails
    const storedMappings = JSON.parse(localStorage.getItem('previewLinksMappings') || '{}');
    storedMappings[encodedId] = projectId;
    localStorage.setItem('previewLinksMappings', JSON.stringify(storedMappings));
    
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
    
    // If not found in memory, check in localStorage
    if (!projectId) {
      const storedMappings = JSON.parse(localStorage.getItem('previewLinksMappings') || '{}');
      projectId = storedMappings[encodedId] || null;
      
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
    
    // Also store in localStorage as a fallback
    const storedAuthorizations = JSON.parse(localStorage.getItem('previewAuthorizedEmails') || '{}');
    if (!storedAuthorizations[projectId]) {
      storedAuthorizations[projectId] = [];
    }
    if (!storedAuthorizations[projectId].includes(email)) {
      storedAuthorizations[projectId].push(email);
    }
    localStorage.setItem('previewAuthorizedEmails', JSON.stringify(storedAuthorizations));
  } catch (error) {
    console.error('Error authorizing email for project:', error);
  }
};

// Check if an email is authorized for a project
export const isEmailAuthorizedForProject = (email: string, projectId: string): boolean => {
  try {
    // First check in cookie
    if (checkPreviewAccessCookie(projectId)) {
      return true;
    }
    
    // If not found in cookie, check in localStorage
    const storedAuthorizations = JSON.parse(localStorage.getItem('previewAuthorizedEmails') || '{}');
    const storedEmails = storedAuthorizations[projectId] || [];
    
    return storedEmails.includes(email);
  } catch (error) {
    console.error('Error checking email authorization for project:', error);
    return false;
  }
};

// Load stored mappings when the module loads
const loadStoredData = () => {
  try {
    const storedMappings = JSON.parse(localStorage.getItem('previewLinksMappings') || '{}');
    Object.entries(storedMappings).forEach(([encodedId, projectId]) => {
      previewLinksMap.set(encodedId, projectId as string);
    });
  } catch (error) {
    console.error('Error loading stored preview data:', error);
  }
};

loadStoredData();
