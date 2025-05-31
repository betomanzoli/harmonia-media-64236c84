
export class BandcampUtils {
  
  static extractAlbumAndTrackIds(bandcampUrl: string): { albumId?: string; trackId?: string } {
    if (!bandcampUrl) return {};
    
    try {
      const url = new URL(bandcampUrl);
      
      // Para URLs como: https://harmonia-media.bandcamp.com/track/pop-bai-o-pop-mainstream-bai-o
      if (url.pathname.includes('/track/')) {
        const trackName = url.pathname.split('/track/')[1];
        const trackId = this.generateIdFromName(trackName);
        
        // Para tracks individuais, precisamos também do album ID
        const albumId = this.generateIdFromName('portfolio-mix-de-estilos'); // ID do álbum padrão
        return { albumId, trackId };
      }
      
      // Para URLs de album: https://harmonia-media.bandcamp.com/album/album-name
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
    // Usar IDs específicos conhecidos para o Bandcamp da harmonIA
    const knownIds: { [key: string]: string } = {
      'pop-bai-o-pop-mainstream-bai-o': '3655073869',
      'portfolio-mix-de-estilos': '3897753197',
      'portif-lio-mix-de-estilos': '3897753197'
    };
    
    if (knownIds[name]) {
      return knownIds[name];
    }
    
    // Fallback para gerar ID baseado no nome
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
      
      let embedUrl = 'https://bandcamp.com/EmbeddedPlayer/';
      
      if (albumId && trackId) {
        // Para tracks específicos dentro de um álbum
        embedUrl += `album=${albumId}/size=small/bgcol=ffffff/linkcol=2ebd35/track=${trackId}/transparent=true/`;
      } else if (albumId) {
        // Para álbum completo
        embedUrl += `album=${albumId}/size=small/bgcol=ffffff/linkcol=2ebd35/transparent=true/`;
      } else if (trackId) {
        // Para track individual
        embedUrl += `track=${trackId}/size=small/bgcol=ffffff/linkcol=2ebd35/transparent=true/`;
      } else {
        return '';
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
        albumId: '3897753197', 
        embedUrl: 'https://bandcamp.com/EmbeddedPlayer/album=3897753197/size=small/bgcol=ffffff/linkcol=2ebd35/transparent=true/',
        directUrl: 'https://harmonia-media.bandcamp.com/album/portif-lio-mix-de-estilos'
      }
    ];
  }
}
