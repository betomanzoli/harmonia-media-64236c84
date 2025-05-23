
/**
 * Test suite for Supabase connection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import supabaseClient from '@/integrations/supabase/client';
import { testConnection } from '../connectionTest';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  default: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  },
}));

describe('Supabase Connection Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should successfully test connection when no errors', async () => {
    // Set up the mock to return success
    const mockSelect = vi.fn(() => ({
      limit: vi.fn(() => Promise.resolve({ data: [{ key: 'test' }], error: null })),
    }));
    
    const mockFrom = vi.fn(() => ({
      select: mockSelect,
    }));
    
    (supabaseClient.from as any) = mockFrom;
    
    const result = await testConnection();
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('Successfully connected');
    expect(mockFrom).toHaveBeenCalledWith('system_settings');
  });

  it('should handle connection errors', async () => {
    // Set up the mock to return an error
    const mockSelect = vi.fn(() => ({
      limit: vi.fn(() => 
        Promise.resolve({ 
          data: null, 
          error: { message: 'Database error', code: 'PGRST116' } 
        })
      ),
    }));
    
    const mockFrom = vi.fn(() => ({
      select: mockSelect,
    }));
    
    (supabaseClient.from as any) = mockFrom;
    
    const result = await testConnection();
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('Connection error');
    expect(result.status).toBe(403);
  });

  it('should handle unexpected errors', async () => {
    // Set up the mock to throw an error
    const mockFrom = vi.fn(() => {
      throw new Error('Unexpected failure');
    });
    
    (supabaseClient.from as any) = mockFrom;
    
    const result = await testConnection();
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('Unexpected error');
    expect(result.status).toBe(500);
  });
});
