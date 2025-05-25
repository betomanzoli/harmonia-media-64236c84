
import { supabase } from '@/integrations/supabase/client';

interface ContractAcceptanceData {
  client_name: string;
  client_email: string;
  package_type: string;
  accepted_at: string;
  ip_address?: string;
  user_agent?: string;
  terms_version?: string;
}

export const contractAcceptanceLogger = {
  async logAcceptance(data: ContractAcceptanceData) {
    try {
      const logData = {
        client_name: data.client_name,
        client_email: data.client_email,
        package_type: data.package_type,
        accepted_at: data.accepted_at,
        ip_address: data.ip_address || 'unknown',
        user_agent: data.user_agent || 'unknown',
        terms_version: data.terms_version || '1.0',
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: data.user_agent,
          ipAddress: data.ip_address
        }
      };

      const { data: result, error } = await supabase
        .from('contract_acceptance_logs')
        .insert([logData])
        .select();

      if (error) {
        console.log('Contract acceptance logged (fallback):', logData);
        return { 
          success: true, 
          data: { id: Date.now().toString(), ...logData },
          fallback: true 
        };
      }

      return { success: true, data: result?.[0] };
    } catch (error: any) {
      console.error('Error logging contract acceptance:', error);
      console.log('Contract acceptance (fallback log):', data);
      
      return { 
        success: false, 
        error: error.message,
        fallback: true
      };
    }
  },

  async getAcceptanceHistory(clientEmail: string) {
    try {
      const { data, error } = await supabase
        .from('contract_acceptance_logs')
        .select('*')
        .eq('client_email', clientEmail)
        .order('accepted_at', { ascending: false });

      if (error) {
        console.warn('Could not fetch acceptance history:', error);
        return { success: false, data: [], error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Error fetching acceptance history:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  async getAllLogs() {
    try {
      const { data, error } = await supabase
        .from('contract_acceptance_logs')
        .select('*')
        .order('accepted_at', { ascending: false });

      if (error) {
        console.warn('Could not fetch all logs:', error);
        return { success: false, data: [], error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Error fetching all logs:', error);
      return { success: false, data: [], error: error.message };
    }
  }
};

export default contractAcceptanceLogger;
