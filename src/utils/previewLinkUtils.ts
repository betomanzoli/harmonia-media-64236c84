/**
 * Functions for managing and validating preview links
 */

/**
 * Generates a preview link from a project ID
 * @param projectId The project ID
 * @returns The encoded preview link
 */
export const generatePreviewLink = (projectId: string, previewCode?: string): string => {
  // If a preview code is provided, use it directly
  if (previewCode) {
    return previewCode;
  }
  
  // Otherwise, encode the project ID
  try {
    const payload = {
      id: projectId,
      ts: Date.now()
    };
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
    return !!data.id; // Return true if it has an id property
  } catch (err) {
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
    
    // Check if the link has expired (optional)
    if (data.exp && Date.now() > data.exp) {
      console.error('Preview link has expired');
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error('Error decoding preview link:', err);
    return null;
  }
};
