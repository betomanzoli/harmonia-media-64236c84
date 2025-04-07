
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { testSupabaseConnection } from '../connectionTest';
import { supabase } from '../client';

// Mock para o cliente Supabase
vi.mock('../client', () => ({
  supabase: {
    rpc: vi.fn(),
    from: vi.fn(),
    auth: {
      getSession: vi.fn(),
    },
  },
}));

// Helpers para criar mock de resposta do PostgrestBuilder
function createPostgrestMock(response: { data: any; error: any }) {
  return {
    then: (callback: any) => Promise.resolve(callback(response)),
    data: response.data,
    error: response.error,
    throwOnError: vi.fn().mockReturnThis(),
  };
}

// Helper para criar uma resposta de fetch
function createResponse(ok: boolean, status: number, data: any) {
  return {
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

describe('testSupabaseConnection', () => {
  // Mock global fetch
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should detect Supabase connection when all methods succeed', async () => {
    // Mock for direct fetch
    (global.fetch as any).mockResolvedValueOnce(createResponse(true, 200, { version: '15.1.0' }));

    // Mock for RPC
    (supabase.rpc as any) = vi.fn().mockImplementation(() => 
      createPostgrestMock({
        data: { version: '15.1.0' },
        error: null
      })
    );

    // Mock for table access
    (supabase.from as any) = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => 
        createPostgrestMock({
          data: [{ exists: true }],
          error: null
        })
      )
    }));

    const result = await testSupabaseConnection();

    expect(result.connected).toBe(true);
    expect(result.endpointStatus).toBe('reachable');
    expect(result.error).toBeNull();
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
    expect(result.endpointStatus).toBe('reachable');
    expect(result.apiAccessMethod).toBe('rpc');
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
    expect(result.endpointStatus).toBe('reachable');
    expect(result.apiAccessMethod).toBe('table');
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
    expect(result.endpointStatus).toBe('unreachable');
    expect(result.error).not.toBeNull();
  });
});
