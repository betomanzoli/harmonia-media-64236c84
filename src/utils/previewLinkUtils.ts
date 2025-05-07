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
    console.log(`[previewLinkUtils] Using direct preview code: ${projectId}`);
    return projectId;
  }
  
  // Generate a token unique to this project but stable across sessions
  try {
    const payload = {
      id: projectId,
      // Use clientId if provided, otherwise use projectId as fallback
      clientId: clientId || projectId,
      // Use only date part for stability (not time)
      date: new Date().toISOString().split('T')[0]
    };
    
    console.log("[previewLinkUtils] Generating token with payload:", JSON.stringify(payload));
    
    const encoded = btoa(JSON.stringify(payload));
    const finalToken = encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    console.log(`[previewLinkUtils] Generated token: ${finalToken}`);
    return finalToken;
  } catch (err) {
    console.error('[previewLinkUtils] Error generating preview link:', err);
    return projectId; // Fallback to using the ID directly
  }
};

/**
 * Validates if a string is an encoded preview link
 * @param link The link to validate
 * @returns True if it's a valid encoded link
 */
export const isValidEncodedPreviewLink = (link: string): boolean => {
  console.log(`[previewLinkUtils] Validating link: ${link}`);
  
  // If it's a UUID format, it's not an encoded link
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(link)) {
    console.log('[previewLinkUtils] Link is a UUID, not encoded');
    return false;
  }
  
  // Simple preview code format check (e.g., P1234, PREV-1234)
  if (/^P\d{4,}$/i.test(link) || /^PREV-\d{4,}$/i.test(link)) {
    console.log('[previewLinkUtils] Link is a direct preview code format');
    return true;
  }
  
  // Try to decode it as a base64 string
  try {
    // Ensure proper padding for base64 decoding
    let normalized = link.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed (important for compatibility)
    const padLength = 4 - (normalized.length % 4);
    if (padLength < 4) {
      normalized += '='.repeat(padLength);
    }
    
    console.log('[previewLinkUtils] Normalized token for decoding:', normalized);
    const decoded = atob(normalized);
    const data = JSON.parse(decoded);
    
    console.log("[previewLinkUtils] Successfully decoded token:", data);
    
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
  // Ensure we're working with a decoded URL
  const decodedLink = decodeURIComponent(link);
  console.log(`[previewLinkUtils] Getting project ID from link. Original: ${link}, Decoded: ${decodedLink}`);
  
  // If it's a preview code format (e.g., P1234), use it directly to look up the project
  if (/^P\d{4,}$/i.test(decodedLink) || /^PREV-\d{4,}$/i.test(decodedLink)) {
    console.log(`[previewLinkUtils] Using preview code directly: ${decodedLink}`);
    return decodedLink;
  }
  
  // If it's a UUID, assume it's a direct project ID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedLink)) {
    console.log(`[previewLinkUtils] Using UUID directly: ${decodedLink}`);
    return decodedLink;
  }
  
  // Otherwise try to decode it
  try {
    // Ensure proper padding for base64 decoding
    let normalized = decodedLink.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed (important for compatibility)
    const padLength = 4 - (normalized.length % 4);
    if (padLength < 4) {
      normalized += '='.repeat(padLength);
    }
    
    console.log('[previewLinkUtils] Normalized token for decoding:', normalized);
    const decoded = atob(normalized);
    const data = JSON.parse(decoded);
    
    console.log('[previewLinkUtils] Token decoded successfully:', data);
    
    return data.id;
  } catch (err) {
    console.error('[previewLinkUtils] Error decoding preview link:', err);
    return null;
  }
};
