
import { useState, useCallback } from 'react';
import { DiagnosticInfo } from '@/components/admin/auth/login/DiagnosticsPanel';

export function useDiagnostics() {
  const [debugInfo, setDebugInfo] = useState<DiagnosticInfo>({
    environment: 'development',
    supportsIndexedDB: typeof indexedDB !== 'undefined',
    supportsFetch: typeof fetch !== 'undefined',
    supportsWebSockets: typeof WebSocket !== 'undefined',
    browserName: getBrowserName(),
    browserVersion: getBrowserVersion(),
    operatingSystem: getOS(),
    cookiesEnabled: navigator.cookieEnabled,
    localStorageAvailable: isLocalStorageAvailable(),
    sessionStorageAvailable: isSessionStorageAvailable(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    storageInfo: {
      localStorageSize: getStorageEstimate('localStorage'),
      sessionStorageSize: getStorageEstimate('sessionStorage')
    },
    connectionDetails: getConnectionDetails(),
    authSettings: JSON.stringify({
      hasToken: !!localStorage.getItem('harmonia-admin-auth-token'),
      hasUser: !!localStorage.getItem('harmonia-admin-auth-user'),
      offlineMode: sessionStorage.getItem('offline-admin-mode') === 'true'
    }, null, 2),
    supabaseUrl: 'api.example.com (modo offline)'
  });

  const loadDebugInfo = useCallback(async () => {
    try {
      // Verify storage accessibility
      let storageAccessible = false;
      try {
        localStorage.setItem('storage-test', 'test');
        localStorage.removeItem('storage-test');
        storageAccessible = true;
      } catch (e) {
        console.error('Error accessing localStorage:', e);
      }

      const authToken = localStorage.getItem('harmonia-admin-auth-token');
      const authUser = localStorage.getItem('harmonia-admin-auth-user');
      
      // Update the diagnostic info
      setDebugInfo({
        ...debugInfo,
        storageInfo: {
          localStorageSize: getStorageEstimate('localStorage'),
          sessionStorageSize: getStorageEstimate('sessionStorage')
        },
        authSettings: JSON.stringify({
          hasToken: !!authToken,
          hasUser: !!authUser,
          offlineMode: sessionStorage.getItem('offline-admin-mode') === 'true'
        }, null, 2),
        connectionDetails: getConnectionDetails()
      });
    } catch (error) {
      console.error('Error loading diagnostic information:', error);
    }
  }, [debugInfo]);

  const runDiagnostics = useCallback(async () => {
    try {
      await loadDebugInfo();
      return true;
    } catch (error) {
      console.error('Error running diagnostics:', error);
      return false;
    }
  }, [loadDebugInfo]);

  return {
    diagnosticInfo: debugInfo,
    loadDebugInfo,
    runDiagnostics
  };
}

// Helper functions
function getBrowserName() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) return "Opera";
  if (userAgent.indexOf("Edge") > -1) return "Edge";
  if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  return "Unknown";
}

function getBrowserVersion() {
  const userAgent = navigator.userAgent;
  let offset, version;
  
  if ((offset = userAgent.indexOf("Firefox")) !== -1) {
    version = userAgent.substring(offset + 8);
  } else if ((offset = userAgent.indexOf("Chrome")) !== -1) {
    version = userAgent.substring(offset + 7);
  } else if ((offset = userAgent.indexOf("Safari")) !== -1) {
    version = userAgent.substring(offset + 7);
  } else {
    version = "Unknown";
  }
  
  if ((offset = version.indexOf(";")) !== -1 || (offset = version.indexOf(" ")) !== -1) {
    version = version.substring(0, offset);
  }
  
  return version;
}

function getOS() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Win") !== -1) return "Windows";
  if (userAgent.indexOf("Mac") !== -1) return "MacOS";
  if (userAgent.indexOf("Linux") !== -1) return "Linux";
  if (userAgent.indexOf("Android") !== -1) return "Android";
  if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) return "iOS";
  return "Unknown";
}

function isLocalStorageAvailable() {
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return true;
  } catch (e) {
    return false;
  }
}

function isSessionStorageAvailable() {
  try {
    sessionStorage.setItem("test", "test");
    sessionStorage.removeItem("test");
    return true;
  } catch (e) {
    return false;
  }
}

function getStorageEstimate(type: 'localStorage' | 'sessionStorage') {
  try {
    let used = 0;
    const storage = type === 'localStorage' ? localStorage : sessionStorage;
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i) || "";
      const value = storage.getItem(key) || "";
      used += key.length + value.length;
    }
    return `${Math.round(used / 1024 * 100) / 100} KB`;
  } catch (e) {
    return "Não disponível";
  }
}

function getConnectionDetails() {
  const connection = navigator.connection as any;
  if (!connection) return {
    rtt: undefined,
    downlink: undefined,
    effectiveType: undefined,
    saveData: undefined
  };
  
  return {
    rtt: connection.rtt,
    downlink: connection.downlink,
    effectiveType: connection.effectiveType,
    saveData: connection.saveData
  };
}
