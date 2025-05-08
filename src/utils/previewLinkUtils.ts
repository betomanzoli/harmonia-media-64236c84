
import { logger } from '@/utils/logger';

/**
 * Generates a preview link for a given project and client
 * @param projectId The project ID
 * @param clientIdentifier The client name or email for added uniqueness
 * @returns Encoded preview link
 */
export const generatePreviewLink = (projectId: string, clientIdentifier: string): string => {
  if (!projectId) return '';
  
  // Basic encoding for the preview link
  try {
    // Create a string to encode
    const toEncode = `p:${projectId}:c:${clientIdentifier}:t:${Date.now()}`;
    
    // Use btoa for basic encoding
    const encoded = btoa(toEncode).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    logger.debug('PREVIEW', 'Generated preview link', { projectId, encoded });
    return encoded;
  } catch (error) {
    logger.error('PREVIEW', 'Error generating preview link', error);
    // Fallback to a simple encoded version
    return `prev-${projectId.substring(0, 8)}`;
  }
};

/**
 * Extracts project ID from an encoded preview link
 * @param encodedLink The encoded preview link
 * @returns The project ID or null if invalid
 */
export const getProjectIdFromPreviewLink = (encodedLink: string): string | null => {
  if (!encodedLink) return null;
  
  // For backward compatibility with preview_code stored in the database
  if (encodedLink.startsWith('P') && encodedLink.length <= 5) {
    logger.debug('PREVIEW', 'Legacy preview code detected', { code: encodedLink });
    return encodedLink;
  }
  
  try {
    // Convert from URL-safe base64
    const safeEncodedLink = encodedLink.replace(/-/g, '+').replace(/_/g, '/');
    
    // Try to decode the link
    const decoded = atob(safeEncodedLink);
    
    // Extract the project ID
    const matches = decoded.match(/p:([^:]+):/);
    if (matches && matches[1]) {
      logger.debug('PREVIEW', 'Extracted project ID from link', { 
        encoded: encodedLink, 
        projectId: matches[1] 
      });
      return matches[1];
    }
    
    logger.warn('PREVIEW', 'Failed to extract project ID from decoded link', { decoded });
    return null;
  } catch (error) {
    logger.error('PREVIEW', 'Error decoding preview link', { encodedLink, error });
    
    // If decoding fails, the link might be a direct project ID
    return encodedLink;
  }
};

/**
 * Checks if a string looks like a valid encoded preview link
 */
export const isValidEncodedPreviewLink = (link: string): boolean => {
  if (!link) return false;
  
  // Check if it's a legacy preview code
  if (link.startsWith('P') && link.length <= 5) {
    return true;
  }
  
  // Check if it looks like a base64 encoded string
  const base64Regex = /^[A-Za-z0-9\-_]+$/;
  return base64Regex.test(link) && link.length > 8;
};

/**
 * Attempts to decode a preview code from a URL path
 */
export const decodePreviewCode = (path: string): string | null => {
  if (!path) return null;
  
  // Extract the last segment of the path
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  
  const code = segments[segments.length - 1];
  logger.debug('PREVIEW', 'Decoded preview code from path', { path, code });
  
  return code;
};
