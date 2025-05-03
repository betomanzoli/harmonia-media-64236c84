
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates an encoded preview link with a UUID prefix for a project
 * @param projectId - The project ID to encode
 * @returns The encoded preview ID string
 */
export const generatePreviewLink = (projectId: string): string => {
  // Generate a random UUID and combine it with the projectId
  const uuid = uuidv4().slice(0, 8);
  return `${uuid}-${projectId}`;
};

/**
 * Decodes a preview link to extract the original project ID
 * @param encodedId - The encoded preview ID from the URL
 * @returns The original project ID or null if invalid
 */
export const getProjectIdFromPreviewLink = (encodedId: string): string | null => {
  // Basic validation
  if (!encodedId || !encodedId.includes('-')) {
    return null;
  }
  
  // Extract the project ID part (after the UUID)
  const parts = encodedId.split('-');
  if (parts.length < 2) {
    return null;
  }
  
  // The project ID is everything after the first dash
  // This handles project IDs that might contain dashes themselves
  return parts.slice(1).join('-');
};
