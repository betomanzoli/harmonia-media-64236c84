
import { v4 as uuidv4 } from 'uuid';

// Map to store the mapping between encoded IDs and project IDs
const previewLinksMap = new Map<string, string>();

export const generatePreviewLink = (projectId: string): string => {
  // Generate a unique encoded ID using UUID
  const encodedId = uuidv4().replace(/-/g, ''); // Remove hyphens from UUID
  
  // Store the mapping
  previewLinksMap.set(encodedId, projectId);
  
  // Return the encoded ID
  return encodedId;
};

export const getProjectIdFromPreviewLink = (encodedId: string): string | null => {
  return previewLinksMap.get(encodedId) || null;
};
