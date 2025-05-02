
import { v4 as uuidv4 } from 'uuid';

// Create a more secure mapping between encoded IDs and project IDs
const previewLinksMap = new Map<string, string>();

// Keep a record of which emails are authorized to access which project IDs
const authorizedEmails = new Map<string, string[]>();

export const generatePreviewLink = (projectId: string): string => {
  // Generate a unique encoded ID that's harder to guess
  const encodedId = uuidv4().replace(/-/g, '') + '-' + projectId; 
  
  // Store the mapping
  previewLinksMap.set(encodedId, projectId);
  
  // Store this in localStorage for persistence
  const storedMappings = JSON.parse(localStorage.getItem('previewLinksMappings') || '{}');
  storedMappings[encodedId] = projectId;
  localStorage.setItem('previewLinksMappings', JSON.stringify(storedMappings));
  
  return encodedId;
};

export const getProjectIdFromPreviewLink = (encodedId: string): string | null => {
  // First check in-memory map
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
  
  // Special case for encoded IDs that already contain the project ID (e.g. uuid-P0001)
  if (!projectId && encodedId.includes('-P')) {
    const potentialId = encodedId.split('-').pop();
    if (potentialId && potentialId.startsWith('P')) {
      return potentialId;
    }
  }
  
  return projectId;
};

export const authorizeEmailForProject = (email: string, projectId: string): void => {
  const projectEmails = authorizedEmails.get(projectId) || [];
  if (!projectEmails.includes(email)) {
    projectEmails.push(email);
    authorizedEmails.set(projectId, projectEmails);
    
    // Save to localStorage for persistence
    const storedAuthorizations = JSON.parse(localStorage.getItem('previewAuthorizedEmails') || '{}');
    if (!storedAuthorizations[projectId]) {
      storedAuthorizations[projectId] = [];
    }
    if (!storedAuthorizations[projectId].includes(email)) {
      storedAuthorizations[projectId].push(email);
    }
    localStorage.setItem('previewAuthorizedEmails', JSON.stringify(storedAuthorizations));
  }
};

export const isEmailAuthorizedForProject = (email: string, projectId: string): boolean => {
  // First check in-memory map
  const projectEmails = authorizedEmails.get(projectId);
  if (projectEmails && projectEmails.includes(email)) {
    return true;
  }
  
  // If not found in memory, check in localStorage
  const storedAuthorizations = JSON.parse(localStorage.getItem('previewAuthorizedEmails') || '{}');
  const storedEmails = storedAuthorizations[projectId] || [];
  
  // Add to in-memory map if found
  if (storedEmails.includes(email)) {
    if (!authorizedEmails.has(projectId)) {
      authorizedEmails.set(projectId, []);
    }
    authorizedEmails.get(projectId)?.push(email);
    return true;
  }
  
  return false;
};

// Load stored mappings and authorizations when the module loads
const loadStoredData = () => {
  try {
    const storedMappings = JSON.parse(localStorage.getItem('previewLinksMappings') || '{}');
    Object.entries(storedMappings).forEach(([encodedId, projectId]) => {
      previewLinksMap.set(encodedId, projectId as string);
    });
    
    const storedAuthorizations = JSON.parse(localStorage.getItem('previewAuthorizedEmails') || '{}');
    Object.entries(storedAuthorizations).forEach(([projectId, emails]) => {
      authorizedEmails.set(projectId, emails as string[]);
    });
  } catch (error) {
    console.error('Error loading stored preview data:', error);
  }
};

loadStoredData();
