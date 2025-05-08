
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
  // If a preview code is provided in format P#### (e.g., P0001), prioritize it
  if (projectId && /^P\d{4,}$/.test(projectId)) {
    console.log(`[previewLinkUtils] Using direct preview code: ${projectId}`);
    return projectId;
  }
  
  // If not in the right format, generate a new preview code
  try {
    // Create a simple format P#### where #### is between 1000-9999
    const randomNum = 1000 + Math.floor(Math.random() * 9000);
    const previewCode = `P${randomNum}`;
    
    console.log(`[previewLinkUtils] Generated preview code: ${previewCode}`);
    return previewCode;
  } catch (err) {
    console.error('[previewLinkUtils] Error generating preview link:', err);
    // Fallback: Use a simple P prefix + project ID
    return `P${projectId.replace(/[^a-zA-Z0-9]/g, '')}`;
  }
};

/**
 * Validates if a string is an encoded preview link
 * @param link The link to validate
 * @returns True if it's a valid encoded link
 */
export const isValidEncodedPreviewLink = (link: string): boolean => {
  if (!link) return false;
  
  // Ensure we're working with a decoded URL
  const decodedLink = decodeURIComponent(link);
  console.log(`[previewLinkUtils] Validating link. Original: ${link}, Decoded: ${decodedLink}`);
  
  // If it's a UUID format, it's not an encoded link
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedLink)) {
    console.log('[previewLinkUtils] Link is a UUID, not an encoded link');
    return false;
  }
  
  // Simple preview code format (e.g., P1234, PREV-1234)
  if (/^P\d{4,}$/i.test(decodedLink) || /^PREV-\d{4,}$/i.test(decodedLink)) {
    console.log('[previewLinkUtils] Link is a direct preview code format');
    return true;
  }
  
  // Try to decode it as base64
  try {
    // For backwards compatibility, check if it's a base64 encoded JSON
    if (decodedLink.length > 20) { // Arbitrary length to check if it's a longer encoded string
      // Ensure proper base64 padding
      let normalized = decodedLink.replace(/-/g, '+').replace(/_/g, '/');
      const padLength = 4 - (normalized.length % 4);
      if (padLength < 4) {
        normalized += '='.repeat(padLength);
      }
      
      const decoded = atob(normalized);
      try {
        // Check if it's valid JSON with an id property
        const data = JSON.parse(decoded);
        if (data && data.id) {
          console.log("[previewLinkUtils] Legacy encoded link valid:", data);
          return true;
        }
      } catch (jsonErr) {
        // Not valid JSON, could be another format
      }
    }
    
    // If it doesn't match any known format but has the right pattern
    // for a preview code, consider it valid
    return /^P\d+$/i.test(decodedLink) || /^PREV-\d+$/i.test(decodedLink);
  } catch (err) {
    console.error('[previewLinkUtils] Error validating link:', err);
    return false;
  }
};

/**
 * Gets the project ID from a preview link
 * @param link The encoded preview link
 * @returns The project ID
 */
export const getProjectIdFromPreviewLink = (link: string): string | null => {
  if (!link) return null;
  
  // Ensure we're working with a decoded URL
  const decodedLink = decodeURIComponent(link);
  console.log(`[previewLinkUtils] Getting project ID from link. Original: ${link}, Decoded: ${decodedLink}`);
  
  // For simple preview codes (P1234), we return the same code to look up in the database
  if (/^P\d{4,}$/i.test(decodedLink) || /^PREV-\d{4,}$/i.test(decodedLink)) {
    console.log(`[previewLinkUtils] Using preview code directly: ${decodedLink}`);
    return decodedLink;
  }
  
  // If it's a UUID, assume it's a direct project ID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decodedLink)) {
    console.log(`[previewLinkUtils] Using UUID directly: ${decodedLink}`);
    return decodedLink;
  }
  
  // Try to decode it as a base64 encoded JSON from legacy format
  try {
    if (decodedLink.length > 20) {
      // Ensure proper base64 padding
      let normalized = decodedLink.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      const padLength = 4 - (normalized.length % 4);
      if (padLength < 4) {
        normalized += '='.repeat(padLength);
      }
      
      const decoded = atob(normalized);
      try {
        const data = JSON.parse(decoded);
        console.log('[previewLinkUtils] Legacy token decoded:', data);
        if (data && data.id) {
          return data.id;
        }
      } catch (jsonErr) {
        // Not valid JSON
        console.warn('[previewLinkUtils] Not valid JSON in decoded token');
      }
    }
  } catch (err) {
    console.error('[previewLinkUtils] Error decoding preview link:', err);
  }
  
  // If all else fails, return the original link as the ID
  // This is a fallback that might work if the link is actually the ID
  return decodedLink;
};

/**
 * Decodes a preview code from a URL segment
 * @param url The URL segment containing the preview code
 * @returns The decoded preview code
 */
export const decodePreviewCode = (url: string): string | null => {
  if (!url) return null;
  
  // Extract code from URL pattern
  const parts = url.split('/preview/');
  if (parts.length < 2) return null;
  
  const code = decodeURIComponent(parts[1]);
  console.log(`[previewLinkUtils] Decoded preview code from URL: ${code}`);
  return code;
};

/**
 * Test Supabase preview code query in browser console
 * @param previewCode The preview code to test
 * @param supabaseUrl The Supabase URL
 * @param supabaseKey The Supabase anon key
 */
export const testPreviewCodeQuery = (previewCode: string, supabaseUrl: string, supabaseKey: string): void => {
  console.log(`[previewLinkUtils] Testing query for preview_code=${previewCode}`);
  
  const url = `${supabaseUrl}/rest/v1/projects?preview_code=eq.${encodeURIComponent(previewCode)}`;
  console.log(`[previewLinkUtils] Query URL: ${url}`);
  
  fetch(url, {
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  })
  .then(response => {
    console.log(`[previewLinkUtils] Response status: ${response.status}`);
    console.log(`[previewLinkUtils] Response headers:`, response.headers);
    return response.json();
  })
  .then(data => {
    console.log(`[previewLinkUtils] Query result:`, data);
  })
  .catch(error => {
    console.error(`[previewLinkUtils] Query error:`, error);
  });
};
