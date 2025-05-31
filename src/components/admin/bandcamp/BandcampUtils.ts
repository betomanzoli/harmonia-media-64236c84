
export class BandcampUtils {
  
  static extractAlbumAndTrackIds(bandcampUrl: string): { albumId?: string; trackId?: string } {
    if (!bandcampUrl) return {};
    
    try {
      const url = new URL(bandcampUrl);
      
      // Padrão para track: https://artist.bandcamp.com/track/song-name
      if (url.pathname.includes('/track/')) {
        const trackName = url.pathname.split('/track/')[1];
        // Simular ID baseado no nome da track para demonstração
        const trackId = this.generateIdFromName(trackName);
        return { trackId };
      }
      
      // Padrão para album: https://artist.bandcamp.com/album/album-name
      if (url.pathname.includes('/album/')) {
        const albumName = url.pathname.split('/album/')[1];
        const albumId = this.generateIdFromName(albumName);
        return { albumId };
      }
      
      return {};
    } catch (error) {
      console.error('Error parsing Bandcamp URL:', error);
      return {};
    }
  }
  
  private static generateIdFromName(name: string): string {
    // Gerar um ID único baseado no nome para demonstração
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString();
  }
  
  static generateEmbedUrl(bandcampUrl: string): string {
    if (!bandcampUrl) return '';
    
    try {
      const url = new URL(bandcampUrl);
      const { albumId, trackId } = this.extractAlbumAndTrackIds(bandcampUrl);
      
      let embedUrl = 'https://bandcamp.com/EmbeddedPlayer/';
      
      if (albumId && trackId) {
        embedUrl += `album=${albumId}/size=small/bgcol=333333/linkcol=2ebd35/track=${trackId}/transparent=true/`;
      } else if (albumId) {
        embedUrl += `album=${albumId}/size=small/bgcol=333333/linkcol=2ebd35/transparent=true/`;
      } else if (trackId) {
        embedUrl += `track=${trackId}/size=small/bgcol=333333/linkcol=2ebd35/transparent=true/`;
      } else {
        // Fallback: gerar embed básico
        const pathHash = this.generateIdFromName(url.pathname);
        embedUrl += `album=${pathHash}/size=small/bgcol=333333/linkcol=2ebd35/transparent=true/`;
      }
      
      return embedUrl;
    } catch (error) {
      console.error('Error generating embed URL:', error);
      return '';
    }
  }
  
  static autoGenerateEmbed(bandcampUrl: string): string {
    return this.generateEmbedUrl(bandcampUrl);
  }
  
  static validateBandcampUrl(url: string): boolean {
    if (!url) return false;
    
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.includes('bandcamp.com');
    } catch {
      return false;
    }
  }
}
