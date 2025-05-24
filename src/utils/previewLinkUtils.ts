
import { v4 as uuidv4 } from 'uuid';

// Generate a unique preview link
export function generatePreviewLink(projectId: string) {
  const token = uuidv4();
  return `/preview/${projectId}?token=${token}`;
}

// Validate a preview token
export function validatePreviewToken(token: string) {
  // In a real implementation, this would validate against stored tokens in a database
  return token && token.length > 10;
}

// Generate a shareable preview link with expiration
export function generateShareableLink(projectId: string, expiresInHours = 48) {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);
  
  // In a real implementation, store the token with expiration in a database
  return {
    url: `/preview/share/${projectId}?token=${token}`,
    expiresAt: expiresAt.toISOString()
  };
}
