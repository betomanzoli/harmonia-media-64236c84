
// Utility functions for Bandcamp integration
export interface BandcampTrackInfo {
  albumId: string;
  trackId: string;
  embedUrl: string;
  directUrl: string;
}

export class BandcampUtils {
  private static readonly ALBUM_URL = 'https://harmonia-media.bandcamp.com/album/promocionais-harmonia-01';
  private static readonly EMBED_BASE = 'https://bandcamp.com/EmbeddedPlayer';

  /**
   * Extract album and track IDs from Bandcamp URL
   */
  static extractIds(url: string): { albumId: string; trackId: string } | null {
    try {
      // Pattern for URLs like: https://harmonia-media.bandcamp.com/album/promocionais-harmonia-01?t=10
      const trackMatch = url.match(/\?t=(\d+)/);
      
      // For now, we'll use a fixed album ID and extract track from URL
      const albumId = '4290875691'; // This would be obtained from Bandcamp API
      const trackId = trackMatch ? trackMatch[1] : '1';
      
      return { albumId, trackId };
    } catch (error) {
      console.error('Error extracting Bandcamp IDs:', error);
      return null;
    }
  }

  /**
   * Generate embed URL for a specific track
   */
  static generateEmbedUrl(albumId: string, trackId: string): string {
    return `${this.EMBED_BASE}/album=${albumId}/track=${trackId}/`;
  }

  /**
   * Generate direct Bandcamp URL for a track
   */
  static generateDirectUrl(trackNumber: number): string {
    return `${this.ALBUM_URL}?t=${trackNumber}`;
  }

  /**
   * Create complete track info for a project version
   */
  static createTrackInfo(trackNumber: number): BandcampTrackInfo {
    const albumId = '4290875691'; // Fixed for now
    const trackId = trackNumber.toString();
    
    return {
      albumId,
      trackId,
      embedUrl: this.generateEmbedUrl(albumId, trackId),
      directUrl: this.generateDirectUrl(trackNumber)
    };
  }

  /**
   * Validate Bandcamp URL format
   */
  static isValidBandcampUrl(url: string): boolean {
    const bandcampPattern = /^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/album\/[a-zA-Z0-9-]+(\?t=\d+)?$/;
    return bandcampPattern.test(url);
  }

  /**
   * Generate embed HTML for React component
   */
  static generateEmbedHtml(albumId: string, trackId: string, width = '100%', height = '120'): string {
    const embedUrl = this.generateEmbedUrl(albumId, trackId);
    return `<iframe 
      style="border: 0; width: ${width}; height: ${height}px;" 
      src="${embedUrl}" 
      seamless>
    </iframe>`;
  }
}

export default BandcampUtils;
