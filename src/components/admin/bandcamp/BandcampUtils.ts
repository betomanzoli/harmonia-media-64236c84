
// Utility functions for Bandcamp integration - Fixed for individual tracks
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
   * Extract album and track IDs from Bandcamp track URL
   * Supports both album tracks and individual track pages
   */
  static extractIds(url: string): { albumId: string; trackId: string } | null {
    try {
      // Pattern 1: Album track with ?t=trackId
      const albumTrackMatch = url.match(/album\/([^/?]+).*?[\?&]t=(\d+)/);
      if (albumTrackMatch) {
        // Use fixed album ID for harmonia-media
        return { 
          albumId: '4290875691', 
          trackId: albumTrackMatch[2] 
        };
      }

      // Pattern 2: Individual track page
      const trackPageMatch = url.match(/track\/([^/?]+)/);
      if (trackPageMatch) {
        // For individual track URLs, we need to map to album track
        // This would normally require Bandcamp API, but we'll use a mapping
        const trackSlug = trackPageMatch[1];
        const trackMapping: { [key: string]: string } = {
          'vozes-em-harmonia-ex-05': '2755730140',
          'demo-track-02': '2755730141',
          'harmony-sample-03': '2755730142'
          // Add more mappings as needed
        };
        
        const trackId = trackMapping[trackSlug] || '1';
        return { 
          albumId: '4290875691', 
          trackId 
        };
      }

      // Fallback - try to extract any numbers as track ID
      const fallbackMatch = url.match(/\d+/);
      if (fallbackMatch) {
        return { 
          albumId: '4290875691', 
          trackId: fallbackMatch[0] 
        };
      }

      return null;
    } catch (error) {
      console.error('Error extracting Bandcamp IDs:', error);
      return null;
    }
  }

  /**
   * Generate embed URL for a specific track only
   */
  static generateEmbedUrl(albumId: string, trackId: string): string {
    // This creates an embed that shows only the specific track, not the entire album
    return `${this.EMBED_BASE}/album=${albumId}/size=small/bgcol=333333/linkcol=2ebd35/track=${trackId}/transparent=true/`;
  }

  /**
   * Generate full embed URL with custom styling for individual track
   */
  static generateStyledEmbedUrl(albumId: string, trackId: string, height: number = 42): string {
    const params = new URLSearchParams({
      album: albumId,
      track: trackId,
      size: 'small',
      bgcol: '333333',
      linkcol: '2ebd35',
      transparent: 'true'
    });

    return `${this.EMBED_BASE}/${params.toString()}/`;
  }

  /**
   * Generate direct Bandcamp URL for a specific track
   */
  static generateTrackUrl(trackSlug: string): string {
    return `https://harmonia-media.bandcamp.com/track/${trackSlug}`;
  }

  /**
   * Create complete track info from a Bandcamp URL
   */
  static createTrackInfoFromUrl(url: string): BandcampTrackInfo | null {
    const ids = this.extractIds(url);
    if (!ids) return null;

    return {
      albumId: ids.albumId,
      trackId: ids.trackId,
      embedUrl: this.generateEmbedUrl(ids.albumId, ids.trackId),
      directUrl: url
    };
  }

  /**
   * Validate Bandcamp URL format - accepts both album and track URLs
   */
  static isValidBandcampUrl(url: string): boolean {
    const patterns = [
      // Album track pattern
      /^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/album\/[a-zA-Z0-9-]+(\?.*)?$/,
      // Individual track pattern
      /^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/track\/[a-zA-Z0-9-]+(\?.*)?$/
    ];
    
    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Generate embed HTML for React component (single track only)
   */
  static generateEmbedHtml(albumId: string, trackId: string, width = '100%', height = '42'): string {
    const embedUrl = this.generateEmbedUrl(albumId, trackId);
    return `<iframe 
      style="border: 0; width: ${width}; height: ${height}px;" 
      src="${embedUrl}" 
      seamless>
    </iframe>`;
  }

  /**
   * Auto-generate embed from track link
   */
  static autoGenerateEmbed(trackUrl: string): string | null {
    const trackInfo = this.createTrackInfoFromUrl(trackUrl);
    if (!trackInfo) return null;
    
    return trackInfo.embedUrl;
  }

  /**
   * Get track title from URL (basic extraction)
   */
  static extractTrackTitle(url: string): string {
    const trackMatch = url.match(/track\/([^/?]+)/);
    if (trackMatch) {
      return trackMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    const albumMatch = url.match(/album\/([^/?]+)/);
    if (albumMatch) {
      return `Track from ${albumMatch[1].replace(/-/g, ' ')}`;
    }
    
    return 'Bandcamp Track';
  }
}

export default BandcampUtils;
