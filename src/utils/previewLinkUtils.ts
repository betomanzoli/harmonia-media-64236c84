
import { v5 as uuidv5 } from 'uuid';

// Define a consistent namespace UUID for generating preview codes
// Using a UUID v5 namespace to ensure deterministic results
const PREVIEW_NAMESPACE = '9f9b2a8c-5c6d-4e7f-8f9a-1c2d3e4f5a6b';

/**
 * Generates a deterministic preview link code based on project ID and optional identifier
 * 
 * @param projectId - The project ID to encode
 * @param uniqueIdentifier - Optional additional identifier (like email) to make the link unique
 * @returns The encoded preview link code (can be used in URLs)
 */
export const generatePreviewLink = (
  projectId: string,
  uniqueIdentifier?: string
): string => {
  // Combine project ID with unique identifier if provided
  const input = uniqueIdentifier 
    ? `${projectId}:${uniqueIdentifier}`
    : projectId;

  try {
    // Generate a deterministic UUID v5 based on input and namespace
    const uuid = uuidv5(input, PREVIEW_NAMESPACE);
    
    // Create a shorter, URL-friendly version by taking part of the UUID
    // and encoding it to base64, then removing unwanted chars
    const base64Encoded = Buffer.from(uuid.replace(/-/g, '').substring(0, 16), 'hex')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
      
    // Add a prefix for a more user-friendly format
    const encodedPreview = `P${base64Encoded}`;
    
    return encodedPreview;
  } catch (error) {
    console.error('Error generating preview link:', error);
    
    // Fallback to a simpler encoding if UUID v5 fails
    const fallbackEncoding = Buffer.from(projectId).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
      
    return `P${fallbackEncoding.substring(0, 10)}`;
  }
};

/**
 * Checks if a given string is a valid encoded preview link
 * 
 * @param code - The code to validate
 * @returns boolean indicating if this is an encoded preview link
 */
export const isValidEncodedPreviewLink = (code: string): boolean => {
  // Preview links should start with P and be followed by base64 characters
  const previewLinkRegex = /^P[A-Za-z0-9\-_]+$/;
  return previewLinkRegex.test(code);
};

/**
 * Attempts to decode a preview link back to a project ID
 * 
 * @param encodedPreviewLink - The encoded preview link
 * @returns The project ID if successful, null otherwise
 */
export const getProjectIdFromPreviewLink = (
  encodedPreviewLink: string
): string | null => {
  try {
    // For new format links, we'll actually query the database 
    // using the preview_code field
    return encodedPreviewLink;
  } catch (error) {
    console.error('Error decoding preview link:', error);
    return null;
  }
};
