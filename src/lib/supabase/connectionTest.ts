
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const getSupabaseUrl = () => {
  return 'https://ivueqxyuflxsiecqvmgt.supabase.co';
};

export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Connection test error:', error);
    return { success: false, error: error.message };
  }
};

export const checkDatabaseConnection = async () => {
  return await testConnection();
};

// Fixed export that the test is looking for
export const testSupabaseConnection = async () => {
  try {
    // Test direct fetch to Supabase endpoint
    const response = await fetch(`${getSupabaseUrl()}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWVxeHl1Zmx4c2llY3F2bWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MjY0MzEsImV4cCI6MjA2MjMwMjQzMX0.db1UVta6PSPGokJOZozwqZ7AAs2jBljfWCdUR3LjIdM'
      }
    });

    const endpointStatus = response.ok ? 'reachable' : 'unreachable';
    
    // Test RPC method
    const { data: rpcData, error: rpcError } = await supabase.rpc('version');
    
    // Test table access method
    const { data: tableData, error: tableError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    const connected = response.ok && (!rpcError || !tableError);
    
    return {
      connected,
      endpointStatus,
      error: !connected ? (rpcError?.message || tableError?.message || 'Connection failed') : null
    };
  } catch (error: any) {
    return {
      connected: false,
      endpointStatus: 'unreachable',
      error: error.message
    };
  }
};
