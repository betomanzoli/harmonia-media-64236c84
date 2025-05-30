
// Utility functions for Bandcamp integration - Updated to accept full embed codes
export interface BandcampTrackInfo {
  albumId: string;
  trackId: string;
  embedUrl: string;
  directUrl: string;
}

export class BandcampUtils {
  private static readonly EMBED_BASE = 'https://bandcamp.com/EmbeddedPlayer';
  
  /**
   * Extract embed URL from full Bandcamp embed code
   */
  static extractEmbedFromCode(embedCode: string): string | null {
    try {
      console.log('Extracting embed URL from code:', embedCode);
      
      // Pattern to find src attribute in iframe
      const srcMatch = embedCode.match(/src=["']([^"']+)["']/);
      if (srcMatch) {
        const embedUrl = srcMatch[1];
        console.log('Found embed URL:', embedUrl);
        return embedUrl;
      }

      // If it's already just a URL, validate and return
      if (embedCode.includes('bandcamp.com/EmbeddedPlayer')) {
        console.log('Input is already an embed URL');
        return embedCode.trim();
      }

      console.log('No valid embed URL found in code');
      return null;
    } catch (error) {
      console.error('Error extracting embed from code:', error);
      return null;
    }
  }

  /**
   * Extract track title from embed code or URL
   */
  static extractTrackTitle(input: string): string {
    try {
      // Try to extract from track parameter in embed URL
      const trackMatch = input.match(/track=(\d+)/);
      if (trackMatch) {
        return `Track ${trackMatch[1]}`;
      }

      // Try to extract from album parameter
      const albumMatch = input.match(/album=(\d+)/);
      if (albumMatch) {
        return `Album ${albumMatch[1]}`;
      }

      // Fallback to generic title
      return 'Bandcamp Track';
    } catch (error) {
      console.error('Error extracting track title:', error);
      return 'Bandcamp Track';
    }
  }

  /**
   * Validate if input contains valid Bandcamp embed
   */
  static isValidBandcampEmbed(input: string): boolean {
    try {
      // Check if it's an iframe with Bandcamp embed
      const iframeMatch = input.includes('<iframe') && input.includes('bandcamp.com/EmbeddedPlayer');
      
      // Check if it's a direct Bandcamp embed URL
      const urlMatch = input.includes('bandcamp.com/EmbeddedPlayer');
      
      return iframeMatch || urlMatch;
    } catch (error) {
      console.error('Error validating Bandcamp embed:', error);
      return false;
    }
  }

  /**
   * Process embed input and return clean embed URL
   */
  static processEmbedInput(input: string): string | null {
    try {
      console.log('Processing embed input:', input);
      
      if (!this.isValidBandcampEmbed(input)) {
        console.log('Invalid Bandcamp embed');
        return null;
      }

      const embedUrl = this.extractEmbedFromCode(input);
      if (!embedUrl) {
        console.log('Could not extract embed URL');
        return null;
      }

      console.log('Processed embed URL:', embedUrl);
      return embedUrl;
    } catch (error) {
      console.error('Error processing embed input:', error);
      return null;
    }
  }

  /**
   * Create track info from embed code
   */
  static createTrackInfoFromEmbed(embedCode: string): BandcampTrackInfo | null {
    try {
      const embedUrl = this.processEmbedInput(embedCode);
      if (!embedUrl) {
        return null;
      }

      // Extract IDs for reference (optional)
      const albumMatch = embedUrl.match(/album=(\d+)/);
      const trackMatch = embedUrl.match(/track=(\d+)/);

      return {
        albumId: albumMatch ? albumMatch[1] : 'unknown',
        trackId: trackMatch ? trackMatch[1] : 'unknown',
        embedUrl: embedUrl,
        directUrl: embedUrl // Could be enhanced to extract original Bandcamp URL
      };
    } catch (error) {
      console.error('Error creating track info from embed:', error);
      return null;
    }
  }

  /**
   * Generate working example embeds for testing
   */
  static getWorkingExamples(): BandcampTrackInfo[] {
    return [
      {
        albumId: '2774072802',
        trackId: '3016958351',
        embedUrl: 'https://bandcamp.com/EmbeddedPlayer/album=2774072802/size=small/bgcol=ffffff/linkcol=2ebd35/track=3016958351/transparent=true/',
        directUrl: 'https://harmonia-media.bandcamp.com/album/promocionais'
      },
      {
        albumId: '2774072802',
        trackId: '2283399235',
        embedUrl: 'https://bandcamp.com/EmbeddedPlayer/album=2774072802/size=small/bgcol=ffffff/linkcol=2ebd35/track=2283399235/transparent=true/',
        directUrl: 'https://harmonia-media.bandcamp.com/album/promocionais'
      }
    ];
  }
}

export default BandcampUtils;
