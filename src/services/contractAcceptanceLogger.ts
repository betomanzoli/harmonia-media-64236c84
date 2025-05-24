
/**
 * Service to log contract acceptance events
 */

import { supabase } from '@/lib/supabase';
import { PackageId } from '@/lib/payment/packageData';

interface ContractAcceptanceLog {
  packageId: PackageId;
  customerName: string;
  customerEmail: string;
  acceptanceDate: string;
  ipAddress?: string;
  userAgent?: string;
  contractVersion: string;
  source: string;
}

/**
 * Service for logging contract acceptance events
 */
const contractAcceptanceLogger = {
  /**
   * Log a contract acceptance event
   * @param data Contract acceptance data
   * @returns Result of the logging operation
   */
  logAcceptance: async (data: ContractAcceptanceLog): Promise<{ success: boolean; error?: any }> => {
    console.log('Logging contract acceptance:', data);
    
    try {
      // Try to save to Supabase if available
      const offlineMode = sessionStorage.getItem('offline-admin-mode') === 'true';
      
      if (!offlineMode) {
        try {
          const { error } = await supabase
            .from('contract_acceptance_logs')
            .insert([data]);
            
          if (error) {
            throw new Error(error.message);
          }
        } catch (error) {
          console.error('Error saving to database:', error);
          // Fall back to local storage
          saveToLocalStorage(data);
          return { success: true };
        }
      } else {
        // Save to local storage in offline mode
        saveToLocalStorage(data);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error logging contract acceptance:', error);
      return { success: false, error };
    }
  },
  
  /**
   * Get all contract acceptance logs
   * @returns Array of contract acceptance logs
   */
  getAllLogs: async (): Promise<ContractAcceptanceLog[]> => {
    try {
      // Try to get from Supabase if available
      const offlineMode = sessionStorage.getItem('offline-admin-mode') === 'true';
      
      if (!offlineMode) {
        try {
          const { data, error } = await supabase
            .from('contract_acceptance_logs')
            .select('*')
            .order('acceptanceDate', { ascending: false });
            
          if (error) {
            throw new Error(error.message);
          }
          
          return data || [];
        } catch (error) {
          console.error('Error fetching from database:', error);
          // Fall back to local storage
          return getFromLocalStorage();
        }
      } else {
        // Get from local storage in offline mode
        return getFromLocalStorage();
      }
    } catch (error) {
      console.error('Error getting contract acceptance logs:', error);
      return [];
    }
  }
};

/**
 * Save contract acceptance data to local storage
 * @param data Contract acceptance data
 */
const saveToLocalStorage = (data: ContractAcceptanceLog): void => {
  try {
    // Get existing logs
    const existingLogsJson = localStorage.getItem('contractAcceptanceLogs');
    const existingLogs: ContractAcceptanceLog[] = existingLogsJson ? JSON.parse(existingLogsJson) : [];
    
    // Add new log
    existingLogs.push(data);
    
    // Save back to local storage
    localStorage.setItem('contractAcceptanceLogs', JSON.stringify(existingLogs));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }
};

/**
 * Get contract acceptance logs from local storage
 * @returns Array of contract acceptance logs
 */
const getFromLocalStorage = (): ContractAcceptanceLog[] => {
  try {
    const logsJson = localStorage.getItem('contractAcceptanceLogs');
    return logsJson ? JSON.parse(logsJson) : [];
  } catch (error) {
    console.error('Error getting from local storage:', error);
    return [];
  }
};

export default contractAcceptanceLogger;
