
import { useState } from 'react';

export const useConnectionInfo = () => {
  // Safe access to navigator.connection properties using a helper function
  const getConnectionInfo = () => {
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    return connection ? {
      rtt: connection.rtt,
      downlink: connection.downlink,
      effectiveType: connection.effectiveType,
      saveData: connection.saveData
    } : {
      rtt: undefined,
      downlink: undefined,
      effectiveType: undefined,
      saveData: undefined
    };
  };
  
  // Simulated connection status
  const connectionStatus = navigator.onLine ? 'online' : 'offline';
  
  const diagnosticInfo = {
    environment: "production",
    supportsIndexedDB: typeof window !== 'undefined' && 'indexedDB' in window,
    supportsFetch: typeof fetch !== 'undefined',
    supportsWebSockets: typeof WebSocket !== 'undefined',
    browserName: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown',
    browserVersion: navigator.userAgent.match(/Chrome\/([0-9.]+)/) 
                  ? navigator.userAgent.match(/Chrome\/([0-9.]+)/)![1] 
                  : 'Unknown',
    operatingSystem: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    localStorageAvailable: typeof localStorage !== 'undefined',
    sessionStorageAvailable: typeof sessionStorage !== 'undefined',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    storageInfo: {
      localStorageSize: "N/A",
      sessionStorageSize: "N/A",
    },
    connectionDetails: getConnectionInfo(),
    authSettings: "Modo de desenvolvimento",
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'não configurado',
  };
  
  // Function to test connection
  const retryConnection = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };
  
  return {
    connectionStatus,
    diagnosticInfo,
    retryConnection
  };
};
