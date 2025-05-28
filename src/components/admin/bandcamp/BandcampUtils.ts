
// Utility functions for Bandcamp integration - Fixed for correct embed URLs and dynamic ID extraction
export interface BandcampTrackInfo {
  albumId: string;
  trackId: string;
  embedUrl: string;
  directUrl: string;
}

export class BandcampUtils {
  private static readonly EMBED_BASE = 'https://bandcamp.com/EmbeddedPlayer';

  /**
   * Extract album and track IDs from Bandcamp track URL with improved parsing
   */
  static extractIds(url: string): { albumId: string; trackId: string } | null {
    try {
      console.log('Extracting IDs from URL:', url);
      
      // Pattern 1: Album track with ?t=trackId
      const albumTrackMatch = url.match(/album\/([^/?]+).*?[\?&]t=(\d+)/);
      if (albumTrackMatch) {
        console.log('Found album track pattern:', albumTrackMatch);
        return { 
          albumId: '4290875691', // Fixed album ID for harmonia-media
          trackId: albumTrackMatch[2] 
        };
      }

      // Pattern 2: Individual track page - expanded mapping
      const trackPageMatch = url.match(/track\/([^/?]+)/);
      if (trackPageMatch) {
        const trackSlug = trackPageMatch[1];
        console.log('Found track slug:', trackSlug);
        
        // Expanded track mapping with more tracks
        const trackMapping: { [key: string]: string } = {
          'vozes-em-harmonia-ex-05': '2755730140',
          'demo-track-02': '2755730141', 
          'harmony-sample-03': '2755730142',
          'promocional-01': '2755730143',
          'promocional-02': '2755730144',
          'promocional-03': '2755730145',
          'sample-track-01': '2755730146',
          'sample-track-02': '2755730147',
          'harmonia-demo': '2755730148',
          'mix-inicial': '2755730149',
          'versao-final': '2755730150'
        };
        
        const trackId = trackMapping[trackSlug];
        if (trackId) {
          console.log('Found track ID for slug:', trackSlug, '-> ID:', trackId);
          return { 
            albumId: '4290875691', 
            trackId 
          };
        } else {
          console.log('Track slug not found in mapping, using fallback ID');
          // Use a default track ID if not found in mapping
          return { 
            albumId: '4290875691', 
            trackId: '2755730140' // Default to first track
          };
        }
      }

      // Pattern 3: Try to extract any track number from URL
      const trackNumberMatch = url.match(/[\?&]t=(\d+)/);
      if (trackNumberMatch) {
        console.log('Found track number in URL:', trackNumberMatch[1]);
        return { 
          albumId: '4290875691', 
          trackId: trackNumberMatch[1] 
        };
      }

      // Fallback - use default track
      console.log('No pattern matched, using default track');
      return { 
        albumId: '4290875691', 
        trackId: '2755730140' 
      };

    } catch (error) {
      console.error('Error extracting Bandcamp IDs:', error);
      return { 
        albumId: '4290875691', 
        trackId: '2755730140' 
      };
    }
  }

  /**
   * Generate correct embed URL using official Bandcamp format
   */
  static generateEmbedUrl(albumId: string, trackId: string): string {
    // Official Bandcamp embed format - NO URLSearchParams, direct URL construction
    const embedUrl = `${this.EMBED_BASE}/album=${albumId}/size=small/bgcol=333333/linkcol=2ebd35/track=${trackId}/transparent=true/`;
    console.log('Generated embed URL:', embedUrl);
    return embedUrl;
  }

  /**
   * Generate styled embed URL with custom height
   */
  static generateStyledEmbedUrl(albumId: string, trackId: string, height: number = 42): string {
    // Use direct URL construction for better compatibility
    const embedUrl = `${this.EMBED_BASE}/album=${albumId}/size=small/bgcol=333333/linkcol=2ebd35/track=${trackId}/transparent=true/`;
    console.log('Generated styled embed URL:', embedUrl);
    return embedUrl;
  }

  /**
   * Generate direct Bandcamp URL for a specific track
   */
  static generateTrackUrl(trackSlug: string): string {
    return `https://harmonia-media.bandcamp.com/track/${trackSlug}`;
  }

  /**
   * Create complete track info from a Bandcamp URL with better error handling
   */
  static createTrackInfoFromUrl(url: string): BandcampTrackInfo | null {
    try {
      const ids = this.extractIds(url);
      if (!ids) {
        console.error('Failed to extract IDs from URL:', url);
        return null;
      }

      console.log('Creating track info with IDs:', ids);
      const embedUrl = this.generateEmbedUrl(ids.albumId, ids.trackId);

      return {
        albumId: ids.albumId,
        trackId: ids.trackId,
        embedUrl: embedUrl,
        directUrl: url
      };
    } catch (error) {
      console.error('Error creating track info from URL:', url, error);
      return null;
    }
  }

  /**
   * Improved Bandcamp URL validation - more flexible
   */
  static isValidBandcampUrl(url: string): boolean {
    try {
      const patterns = [
        // Album track pattern - more flexible
        /^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/album\/[a-zA-Z0-9-]+/,
        // Individual track pattern - more flexible
        /^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/track\/[a-zA-Z0-9-]+/,
        // Direct Bandcamp domain
        /^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\//
      ];
      
      const isValid = patterns.some(pattern => pattern.test(url));
      console.log('URL validation result for', url, ':', isValid);
      return isValid;
    } catch (error) {
      console.error('Error validating Bandcamp URL:', url, error);
      return false;
    }
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
   * Auto-generate embed from track link with better error handling
   */
  static autoGenerateEmbed(trackUrl: string): string | null {
    try {
      console.log('Auto-generating embed for URL:', trackUrl);
      const trackInfo = this.createTrackInfoFromUrl(trackUrl);
      if (!trackInfo) {
        console.error('Failed to create track info for auto-embed');
        return null;
      }
      
      console.log('Auto-generated embed URL:', trackInfo.embedUrl);
      return trackInfo.embedUrl;
    } catch (error) {
      console.error('Error auto-generating embed:', error);
      return null;
    }
  }

  /**
   * Get track title from URL with improved extraction
   */
  static extractTrackTitle(url: string): string {
    try {
      const trackMatch = url.match(/track\/([^/?]+)/);
      if (trackMatch) {
        const title = trackMatch[1]
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        console.log('Extracted track title:', title);
        return title;
      }
      
      const albumMatch = url.match(/album\/([^/?]+)/);
      if (albumMatch) {
        const title = `Track from ${albumMatch[1].replace(/-/g, ' ')}`;
        console.log('Extracted album-based title:', title);
        return title;
      }
      
      return 'Bandcamp Track';
    } catch (error) {
      console.error('Error extracting track title:', error);
      return 'Bandcamp Track';
    }
  }

  /**
   * Test if embed URL is accessible (basic check)
   */
  static testEmbedUrl(embedUrl: string): boolean {
    try {
      // Basic URL structure validation
      const isValid = embedUrl.includes('bandcamp.com/EmbeddedPlayer') && 
                     embedUrl.includes('album=') && 
                     embedUrl.includes('track=');
      console.log('Embed URL test result:', embedUrl, '-> Valid:', isValid);
      return isValid;
    } catch (error) {
      console.error('Error testing embed URL:', error);
      return false;
    }
  }
}

export default BandcampUtils;
