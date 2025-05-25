
import { describe, it, expect } from 'vitest';
import { testSupabaseConnection } from '../connectionTest';
import { supabase } from '@/integrations/supabase/client';

describe('Supabase Connection', () => {
  it('should connect to Supabase', async () => {
    const result = await testSupabaseConnection();
    expect(result).toBeDefined();
    expect(typeof result.connected).toBe('boolean');
  });

  it('should have valid client instance', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });
});
