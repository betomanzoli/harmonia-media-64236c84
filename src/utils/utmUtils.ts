
export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export const extractUtmParams = (queryString: string): UtmParams => {
  const urlParams = new URLSearchParams(queryString);
  
  return {
    source: urlParams.get('utm_source') || undefined,
    medium: urlParams.get('utm_medium') || undefined,
    campaign: urlParams.get('utm_campaign') || undefined,
    content: urlParams.get('utm_content') || undefined,
    term: urlParams.get('utm_term') || undefined,
  };
};

export const storeUtmParams = (params: UtmParams) => {
  // Store UTM params in localStorage for 30 days
  if (Object.values(params).some(val => val !== undefined)) {
    const utmData = {
      ...params,
      timestamp: new Date().getTime(),
      expiresAt: new Date().getTime() + (30 * 24 * 60 * 60 * 1000), // 30 days
    };
    
    localStorage.setItem('harmonia_utm_data', JSON.stringify(utmData));
  }
};

export const retrieveUtmParams = (): UtmParams => {
  try {
    const storedData = localStorage.getItem('harmonia_utm_data');
    if (!storedData) return {};
    
    const parsedData = JSON.parse(storedData);
    
    // Check if expired
    if (parsedData.expiresAt && parsedData.expiresAt < new Date().getTime()) {
      localStorage.removeItem('harmonia_utm_data');
      return {};
    }
    
    return {
      source: parsedData.source,
      medium: parsedData.medium,
      campaign: parsedData.campaign,
      content: parsedData.content,
      term: parsedData.term,
    };
  } catch (error) {
    console.error('Error retrieving UTM params:', error);
    return {};
  }
};
