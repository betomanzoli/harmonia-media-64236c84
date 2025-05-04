
import { v4 as uuidv4 } from 'uuid';

// Store generated links to ensure they remain persistent
const linkCache: Record<string, string> = {};

/**
 * Generates an encoded preview link with a UUID prefix for a project
 * @param projectId - The project ID to encode
 * @returns The encoded preview ID string
 */
export const generatePreviewLink = (projectId: string): string => {
  // Check if we already have a generated link for this project
  if (linkCache[projectId]) {
    return linkCache[projectId];
  }
  
  // Try to retrieve from localStorage first for persistence
  try {
    const storedLinks = localStorage.getItem('harmonIA_preview_links');
    if (storedLinks) {
      const links = JSON.parse(storedLinks);
      if (links[projectId]) {
        linkCache[projectId] = links[projectId];
        return links[projectId];
      }
    }
  } catch (error) {
    console.error('Error retrieving stored preview links:', error);
  }
  
  // Generate a random UUID and combine it with the projectId
  const uuid = uuidv4().slice(0, 8);
  const encodedLink = `${uuid}-${projectId}`;
  
  // Save to cache
  linkCache[projectId] = encodedLink;
  
  // Save to localStorage for persistence
  try {
    const storedLinks = localStorage.getItem('harmonIA_preview_links') || '{}';
    const links = JSON.parse(storedLinks);
    links[projectId] = encodedLink;
    localStorage.setItem('harmonIA_preview_links', JSON.stringify(links));
  } catch (error) {
    console.error('Error storing preview link:', error);
  }
  
  return encodedLink;
};

/**
 * Decodes a preview link to extract the original project ID
 * @param encodedId - The encoded preview ID from the URL
 * @returns The original project ID or null if invalid
 */
export const getProjectIdFromPreviewLink = (encodedId: string): string | null => {
  console.log("Attempting to decode:", encodedId);
  
  // Basic validation
  if (!encodedId || !encodedId.includes('-')) {
    console.log("Invalid encoded ID format (no dash):", encodedId);
    return null;
  }
  
  // Extract the project ID part (after the UUID)
  const parts = encodedId.split('-');
  if (parts.length < 2) {
    console.log("Invalid encoded ID format (split failed):", encodedId);
    return null;
  }
  
  // The project ID is everything after the first dash
  // This handles project IDs that might contain dashes themselves
  const projectId = parts.slice(1).join('-');
  console.log("Decoded project ID:", projectId);
  
  return projectId;
};
