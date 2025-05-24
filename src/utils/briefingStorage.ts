
export interface BriefingData {
  id: string;
  packageType: 'essencial' | 'profissional' | 'premium';
  clientName: string;
  email: string;
  phone?: string;
  company?: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  musicStyle?: string;
  emotionalTone?: string;
  references?: string[];
  additionalInfo?: string;
  createdAt: string;
  contractAccepted?: boolean;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentId?: string;
}

class BriefingStorage {
  private isIncognitoMode(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return false;
    } catch (e) {
      return true;
    }
  }

  saveBriefingData(briefingId: string, data: Partial<BriefingData>): void {
    const key = `briefing_${briefingId}`;
    const dataString = JSON.stringify(data);
    
    try {
      if (this.isIncognitoMode()) {
        // Usar sessionStorage em modo incógnito
        sessionStorage.setItem(key, dataString);
        // Também tentar salvar em cookies como fallback
        document.cookie = `${key}=${encodeURIComponent(dataString)}; path=/; SameSite=Lax`;
      } else {
        // Usar localStorage normalmente
        localStorage.setItem(key, dataString);
        // Backup em sessionStorage
        sessionStorage.setItem(key, dataString);
      }
    } catch (error) {
      console.warn('Failed to save briefing data:', error);
      // Fallback final para sessionStorage
      try {
        sessionStorage.setItem(key, dataString);
      } catch (sessionError) {
        console.error('Failed to save to sessionStorage:', sessionError);
      }
    }
  }

  getBriefingData(briefingId: string): BriefingData | null {
    const key = `briefing_${briefingId}`;
    
    try {
      // Tentar localStorage primeiro
      let dataString = localStorage.getItem(key);
      
      // Se não encontrar, tentar sessionStorage
      if (!dataString) {
        dataString = sessionStorage.getItem(key);
      }
      
      // Se ainda não encontrar, tentar cookies
      if (!dataString) {
        const cookie = document.cookie
          .split(';')
          .find(c => c.trim().startsWith(`${key}=`));
        if (cookie) {
          dataString = decodeURIComponent(cookie.split('=')[1]);
        }
      }
      
      return dataString ? JSON.parse(dataString) : null;
    } catch (error) {
      console.warn('Failed to retrieve briefing data:', error);
      return null;
    }
  }

  updateBriefingData(briefingId: string, updates: Partial<BriefingData>): void {
    const existing = this.getBriefingData(briefingId) || {} as BriefingData;
    const updated = { ...existing, ...updates };
    this.saveBriefingData(briefingId, updated);
  }

  clearBriefingData(briefingId: string): void {
    const key = `briefing_${briefingId}`;
    
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
      // Remover cookie
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } catch (error) {
      console.warn('Failed to clear briefing data:', error);
    }
  }

  generateBriefingId(): string {
    return `brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const briefingStorage = new BriefingStorage();
