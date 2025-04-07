
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { testSupabaseConnection } from '../connectionTest';
import { supabase } from '../client';

// Mock the supabase client
vi.mock('../client', () => ({
  supabase: {
    rpc: vi.fn(),
    from: vi.fn(),
  },
  getSupabaseUrl: vi.fn().mockReturnValue('https://example.supabase.co'),
}));

// Mock the fetch API
global.fetch = vi.fn();

// Mock the AbortSignal
vi.mock('./mocks/abortControllerMock', () => ({
  AbortSignal: {
    timeout: vi.fn().mockReturnValue({}),
  },
}));

describe('testSupabaseConnection', () => {
  // Create a response factory for fetch mocks
  const createResponse = (ok: boolean, status = 200, json = {}) => {
    return {
      ok,
      status,
      json: () => Promise.resolve(json),
    };
  };

  // Helper to create PostgrestFilterBuilder mocks
  const createPostgrestMock = (response: any) => {
    // Create a mock object that has all the methods of PostgrestFilterBuilder
    const mock = {
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      contains: vi.fn().mockReturnThis(),
      containedBy: vi.fn().mockReturnThis(),
      rangeGt: vi.fn().mockReturnThis(),
      rangeGte: vi.fn().mockReturnThis(),
      rangeLt: vi.fn().mockReturnThis(),
      rangeLte: vi.fn().mockReturnThis(),
      rangeAdjacent: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      textSearch: vi.fn().mockReturnThis(),
      filter: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      and: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      // Add the then method to simulate the Promise-like behavior
      then: (callback: any) => Promise.resolve(callback(response)),
      catch: (callback: any) => Promise.resolve(callback(response)),
      finally: (callback: any) => Promise.resolve(callback()),
      // Other required methods
      throwOnError: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      abortSignal: vi.fn().mockReturnThis(),
      csv: vi.fn().mockReturnThis(),
      explain: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returns: vi.fn().mockReturnThis(),
      options: vi.fn().mockReturnThis(),
      headers: vi.fn().mockReturnThis(),
    };
    
    return mock;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should detect success via RPC method', async () => {
    // Mock successful RPC call
    (supabase.rpc as any) = vi.fn().mockImplementation(() => 
      createPostgrestMock({
        data: { version: '15.1.0' },
        error: null
      })
    );

    // Mock failed "from" call to ensure RPC is preferred
    (supabase.from as any) = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => 
        createPostgrestMock({
          data: null,
          error: { message: 'Table not found', code: '404' }
        })
      )
    }));

    // Mock successful fetch call
    (global.fetch as any).mockResolvedValueOnce(createResponse(true, 200, { version: '15.1.0' }));

    const result = await testSupabaseConnection();
    expect(result.connected).toBe(true);
    expect(result.method).toBe('rpc');
    expect(supabase.rpc).toHaveBeenCalledWith('get_pg_version');
  });

  it('should fall back to table method if RPC fails', async () => {
    // Mock failed RPC call
    (supabase.rpc as any) = vi.fn().mockImplementation(() =>
      createPostgrestMock({
        data: null,
        error: { message: 'RPC function not found', code: '404' }
      })
    );

    // Mock successful "from" call
    (supabase.from as any) = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() =>
        createPostgrestMock({
          data: [{ exists: true }],
          error: null
        })
      )
    }));

    // Mock successful fetch call
    (global.fetch as any).mockResolvedValueOnce(createResponse(true, 200, { status: 'ok' }));

    const result = await testSupabaseConnection();
    expect(result.connected).toBe(true);
    expect(result.method).toBe('table');
    expect(supabase.from).toHaveBeenCalledWith('_system_status');
  });

  it('should detect failure when all methods fail', async () => {
    // Mock failed RPC call
    (supabase.rpc as any) = vi.fn().mockImplementation(() =>
      createPostgrestMock({
        data: null,
        error: { message: 'RPC function not found', code: '404' }
      })
    );

    // Mock failed "from" call
    (supabase.from as any) = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() =>
        createPostgrestMock({
          data: null,
          error: { message: 'Table not found', code: '404' }
        })
      )
    }));

    // Mock failed fetch call
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const result = await testSupabaseConnection();
    expect(result.connected).toBe(false);
    expect(result.error).toBeDefined();
  });
});
