
import { v4 as uuidv4 } from 'uuid';

/**
 * Simple string hashing function that produces a deterministic hash
 * @param str - String to hash
 * @returns A deterministic hash string
 */
const simpleHash = (str: string): string => {
  let hash = 0;
  const salt = 'harmonIA-preview-salt';
  const input = str + salt;
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string with fixed length of 8 characters
  const hexHash = (hash >>> 0).toString(16).padStart(8, '0').slice(0, 8);
  return hexHash;
};

/**
 * Generates an encoded preview link with a deterministic hash prefix for a project
 * @param projectId - The project ID to encode
 * @returns The encoded preview ID string
 */
export const generatePreviewLink = (projectId: string): string => {
  // Generate a deterministic hash based on the project ID
  // This ensures the same project always gets the same encoded link
  const hash = simpleHash(projectId);
  
  return `${hash}-${projectId}`;
};

/**
 * Decodes a preview link to extract the original project ID
 * @param encodedId - The encoded preview ID from the URL
 * @returns The original project ID or null if invalid
 */
export const getProjectIdFromPreviewLink = (encodedId: string): string | null => {
  // Basic validation
  if (!encodedId || !encodedId.includes('-')) {
    console.log('PreviewLinkUtils: Invalid encoded ID format (no hyphen found):', encodedId);
    return null;
  }
  
  // Extract the project ID part (after the UUID/hash)
  const parts = encodedId.split('-');
  if (parts.length < 2) {
    console.log('PreviewLinkUtils: Invalid encoded ID format (not enough parts):', encodedId);
    return null;
  }
  
  // The project ID is everything after the first dash
  // This handles project IDs that might contain dashes themselves
  const projectId = parts.slice(1).join('-');
  console.log('PreviewLinkUtils: Decoded project ID:', projectId);
  
  return projectId;
};

/**
 * Validates if a given preview link is properly encoded
 * @param previewId - The preview ID to validate
 * @returns Boolean indicating if the preview ID is properly encoded
 */
export const isValidEncodedPreviewLink = (previewId: string): boolean => {
  if (!previewId || !previewId.includes('-')) {
    return false;
  }
  
  const parts = previewId.split('-');
  if (parts.length < 2) {
    return false;
  }
  
  // Check if the first part looks like a hash (8 characters, hex)
  const hashPart = parts[0];
  if (hashPart.length !== 8 || !/^[0-9a-f]+$/i.test(hashPart)) {
    return false;
  }
  
  // Extract project ID and verify the hash matches what we'd generate
  const projectId = parts.slice(1).join('-');
  const expectedHash = simpleHash(projectId);
  
  // Return true if the hash matches what we expect for this project ID
  return hashPart === expectedHash;
};
