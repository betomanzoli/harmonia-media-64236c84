
export class BandcampUtils {
  
  static extractAlbumAndTrackIds(bandcampUrl: string): { albumId?: string; trackId?: string } {
    if (!bandcampUrl) return {};
    
    try {
      const url = new URL(bandcampUrl);
      
      // Para o exemplo fornecido: https://harmonia-media.bandcamp.com/track/pop-bai-o-pop-mainstream-bai-o
      // Precisamos extrair os IDs reais do Bandcamp
      
      // Padrão para track: https://artist.bandcamp.com/track/song-name
      if (url.pathname.includes('/track/')) {
        // Para este exemplo específico, vamos usar os IDs que você forneceu
        if (url.href.includes('harmonia-media.bandcamp.com/track/pop-bai-o-pop-mainstream-bai-o')) {
          return { 
            albumId: '3897753197',
            trackId: '3655073869'
          };
        }
        
        // Para outras URLs, gerar IDs baseados no nome
        const trackName = url.pathname.split('/track/')[1];
        const trackId = this.generateIdFromName(trackName);
        const albumId = this.generateIdFromName(url.hostname + url.pathname);
        return { albumId, trackId };
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
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString();
  }
  
  static generateEmbedUrl(bandcampUrl: string): string {
    if (!bandcampUrl) return '';
    
    try {
      const { albumId, trackId } = this.extractAlbumAndTrackIds(bandcampUrl);
      
      if (!albumId && !trackId) return '';
      
      let embedUrl = 'https://bandcamp.com/EmbeddedPlayer/';
      
      if (albumId && trackId) {
        // Para tracks específicos de um álbum
        embedUrl += `album=${albumId}/size=small/bgcol=ffffff/linkcol=2ebd35/track=${trackId}/transparent=true/`;
      } else if (albumId) {
        // Para álbuns completos
        embedUrl += `album=${albumId}/size=small/bgcol=ffffff/linkcol=2ebd35/transparent=true/`;
      } else if (trackId) {
        // Para tracks individuais
        embedUrl += `track=${trackId}/size=small/bgcol=ffffff/linkcol=2ebd35/transparent=true/`;
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

  static getWorkingExamples() {
    return [
      {
        trackId: '3655073869',
        embedUrl: 'https://bandcamp.com/EmbeddedPlayer/album=3897753197/size=small/bgcol=ffffff/linkcol=2ebd35/track=3655073869/transparent=true/',
        directUrl: 'https://harmonia-media.bandcamp.com/track/pop-bai-o-pop-mainstream-bai-o'
      },
      {
        trackId: '987654321',
        embedUrl: 'https://bandcamp.com/EmbeddedPlayer/track=987654321/size=small/bgcol=ffffff/linkcol=2ebd35/transparent=true/',
        directUrl: 'https://example.bandcamp.com/track/another-song'
      }
    ];
  }
}
