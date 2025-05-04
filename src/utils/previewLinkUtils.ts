
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

/**
 * Generates an encoded preview link with a deterministic hash prefix for a project
 * @param projectId - The project ID to encode
 * @returns The encoded preview ID string
 */
export const generatePreviewLink = (projectId: string): string => {
  // Generate a deterministic hash based on the project ID
  // This ensures the same project always gets the same encoded link
  const hash = createHash('md5')
    .update(projectId + 'harmonIA-preview-salt')
    .digest('hex')
    .slice(0, 8);
  
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
  const expectedHash = createHash('md5')
    .update(projectId + 'harmonIA-preview-salt')
    .digest('hex')
    .slice(0, 8);
  
  // Return true if the hash matches what we expect for this project ID
  return hashPart === expectedHash;
};
