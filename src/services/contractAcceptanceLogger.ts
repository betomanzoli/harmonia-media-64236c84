
import { supabase } from '@/lib/supabase';

// Define PackageId type if missing
type PackageId = 'basic' | 'standard' | 'premium' | 'custom';

/**
 * Logs the acceptance of a contract for a given package purchase
 */
export async function logContractAcceptance(
  customerEmail: string,
  packageId: PackageId,
  ip?: string
) {
  try {
    const { data, error } = await supabase
      .from('contract_acceptances')
      .insert([
        {
          customer_email: customerEmail,
          package_id: packageId,
          accepted_at: new Date().toISOString(),
          ip_address: ip || 'not-available'
        }
      ]);
    
    if (error) {
      console.error('Error logging contract acceptance:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Exception logging contract acceptance:', error);
    return { success: false, error };
  }
}
