
/**
 * Functions for managing and validating preview links
 */

/**
 * Generates a preview link from a project ID
 * @param projectId The project ID
 * @param clientId Optional client ID for additional uniqueness
 * @returns The encoded preview link
 */
export const generatePreviewLink = (projectId: string, clientId?: string): string => {
  // If a preview code is provided, prioritize it
  if (projectId && projectId.startsWith('P')) {
    return projectId;
  }
  
  // Generate a token unique to this project
  try {
    const payload = {
      id: projectId,
      // Use clientId if provided, otherwise use projectId as fallback
      clientId: clientId || projectId,
      // Use only date part for stability (not time)
      date: new Date().toISOString().split('T')[0]
    };
    
    console.log("[previewLinkUtils] Generating token with payload:", payload);
    
    const encoded = btoa(JSON.stringify(payload));
    return encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  } catch (err) {
    console.error('Error generating preview link:', err);
    return projectId; // Fallback to using the ID directly
  }
};

/**
 * Validates if a string is an encoded preview link
 * @param link The link to validate
 * @returns True if it's a valid encoded link
 */
export const isValidEncodedPreviewLink = (link: string): boolean => {
  // If it's a UUID format, it's not an encoded link
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(link)) {
    return false;
  }
  
  // Simple preview code format check (e.g., P1234, PREV-1234)
  if (/^P\d{4,}$/i.test(link) || /^PREV-\d{4,}$/i.test(link)) {
    return true;
  }
  
  // Try to decode it as a base64 string
  try {
    const normalized = link.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    const data = JSON.parse(decoded);
    
    console.log("[previewLinkUtils] Decoded token:", data);
    
    // Valid if it has necessary properties
    return !!data.id; 
  } catch (err) {
    console.error('[previewLinkUtils] Error decoding link:', err);
    return false; // Not a valid encoded link
  }
};

/**
 * Gets the project ID from a preview link
 * @param link The encoded preview link
 * @returns The project ID
 */
export const getProjectIdFromPreviewLink = (link: string): string | null => {
  // If it's a preview code format (e.g., P1234), use it directly to look up the project
  if (/^P\d{4,}$/i.test(link) || /^PREV-\d{4,}$/i.test(link)) {
    console.log('[previewLinkUtils] Using preview code directly:', link);
    return link;
  }
  
  // If it's a UUID, assume it's a direct project ID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(link)) {
    console.log('[previewLinkUtils] Using UUID directly:', link);
    return link;
  }
  
  // Otherwise try to decode it
  try {
    const normalized = link.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    const data = JSON.parse(decoded);
    
    console.log('[previewLinkUtils] Token decoded successfully:', data);
    
    return data.id;
  } catch (err) {
    console.error('[previewLinkUtils] Error decoding preview link:', err);
    return null;
  }
};
