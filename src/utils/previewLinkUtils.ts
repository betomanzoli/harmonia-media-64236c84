
import { v4 as uuidv4 } from 'uuid';
import { setPreviewAccessCookie, checkPreviewAccessCookie, setPreviewEmailCookie, getAuthCookie } from './authCookies';
import { supabase } from '@/lib/supabase';

// Create a more secure mapping between encoded IDs and project IDs
const previewLinksMap = new Map<string, string>();

// Helper functions to work with cookies
const setCookie = (name: string, value: string, days = 30) => {
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

// Generate a preview link with a unique encoded ID
export const generatePreviewLink = async (projectId: string): Promise<string> => {
  try {
    // Generate a unique encoded ID that's harder to guess
    const encodedId = uuidv4().replace(/-/g, ''); 
    
    // First check if this project exists in the database
    const { data: existingProject, error: checkError } = await supabase
      .from('preview_projects')
      .select('id')
      .eq('id', projectId)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking if project exists:', checkError);
    }
    
    if (!existingProject) {
      // If project doesn't exist in Supabase, try to get from localStorage
      const storedProjects = localStorage.getItem('harmonIA_preview_projects');
      
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        const localProject = parsedProjects.find((p: any) => p.id === projectId);
        
        if (localProject) {
          // Create project in Supabase from local data
          const { error } = await supabase
            .from('preview_projects')
            .insert({
              id: projectId,
              client_name: localProject.clientName || 'Cliente',
              client_email: localProject.clientEmail || '',
              project_title: localProject.title || localProject.packageType || 'Música Personalizada',
              package_type: localProject.packageType || 'Música Personalizada',
              status: localProject.status || 'waiting',
              preview_code: encodedId,
              expiration_date: localProject.expirationDate ? new Date(localProject.expirationDate) : null,
              last_activity_date: localProject.lastActivityDate ? new Date(localProject.lastActivityDate) : new Date()
            });
            
          if (error) {
            console.error('Error creating project in Supabase:', error);
          }
          
          // Also insert versions if available
          if (localProject.versionsList && localProject.versionsList.length > 0) {
            for (const version of localProject.versionsList) {
              const { error: versionError } = await supabase
                .from('project_versions')
                .insert({
                  project_id: projectId,
                  version_id: version.id,
                  name: version.name,
                  description: version.description || '',
                  file_id: version.fileId,
                  audio_url: version.audioUrl,
                  recommended: version.recommended || false
                });
                
              if (versionError) {
                console.error(`Error saving version ${version.id} to Supabase:`, versionError);
              }
            }
          }
        }
      }
    } else {
      // Update the project record with the preview code
      const { error } = await supabase
        .from('preview_projects')
        .update({ 
          preview_code: encodedId,
          last_activity_date: new Date()
        })
        .eq('id', projectId);
        
      if (error) {
        console.error('Failed to update preview code:', error);
        throw error;
      }
    }
    
    // Also update in preview_codes table
    try {
      const { error } = await supabase
        .from('preview_codes')
        .insert({
          code: encodedId,
          project_id: projectId,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        
      if (error) {
        console.error('Failed to insert preview code:', error);
      }
    } catch (error) {
      console.error('Error inserting preview code:', error);
    }
    
    // Store the mapping locally as a fallback
    previewLinksMap.set(encodedId, projectId);
    
    // Store in cookie instead of localStorage
    const mappings = JSON.parse(getCookie('previewLinksMappings') || '{}');
    mappings[encodedId] = projectId;
    setCookie('previewLinksMappings', JSON.stringify(mappings));
    
    return encodedId;
  } catch (error) {
    console.error('Error generating preview link:', error);
    return '';
  }
};

// Get project ID from preview link (encoded ID)
export const getProjectIdFromPreviewLink = async (encodedId: string): Promise<string | null> => {
  try {
    // Try to get project ID from preview_codes table first
    const { data: codeData, error: codeError } = await supabase
      .from('preview_codes')
      .select('project_id')
      .eq('code', encodedId)
      .maybeSingle();
      
    if (codeData && codeData.project_id) {
      return codeData.project_id;
    }
    
    if (codeError) {
      console.warn('Error getting project from preview_codes:', codeError);
    }
    
    // Try to get project ID from database via preview_code column
    const { data, error } = await supabase
      .from('preview_projects')
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
      const storedMappings = JSON.parse(getCookie('previewLinksMappings') || '{}');
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
