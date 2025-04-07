
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { testSupabaseConnection, validateConfiguration } from '../connectionTest';
import { supabase, getSupabaseUrl } from '../client';

// Mock the supabase client and getSupabaseUrl function
vi.mock('../client', () => {
  return {
    supabase: {
      rpc: vi.fn(),
      from: vi.fn(),
    },
    getSupabaseUrl: vi.fn(),
  };
});

// Mock the fetch function
global.fetch = vi.fn();

describe('validateConfiguration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return valid configuration when URL is properly set', () => {
    vi.mocked(getSupabaseUrl).mockReturnValue('https://valid-url.supabase.co');
    
    const result = validateConfiguration();
    
    expect(result.isValid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('should return invalid configuration when URL is missing', () => {
    vi.mocked(getSupabaseUrl).mockReturnValue('');
    
    const result = validateConfiguration();
    
    expect(result.isValid).toBe(false);
    expect(result.issues).toContain('URL do Supabase inválida ou não configurada');
  });

  it('should return invalid configuration when URL is not HTTPS', () => {
    vi.mocked(getSupabaseUrl).mockReturnValue('http://invalid-url.supabase.co');
    
    const result = validateConfiguration();
    
    expect(result.isValid).toBe(false);
    expect(result.issues).toContain('URL do Supabase inválida ou não configurada');
  });
});

describe('testSupabaseConnection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
    vi.mocked(getSupabaseUrl).mockReturnValue('https://valid-url.supabase.co');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return offline status when no internet connection', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false });
    
    const result = await testSupabaseConnection();
    
    expect(result.connected).toBe(false);
    expect(result.error).toContain('Sem conexão com a internet');
    expect(result.networkStatus).toBe('offline');
  });

  it('should return error when configuration is invalid', async () => {
    vi.mocked(getSupabaseUrl).mockReturnValue('');
    
    const result = await testSupabaseConnection();
    
    expect(result.connected).toBe(false);
    expect(result.configStatus).toBe('invalid');
  });

  it('should return error when endpoint is unreachable', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Failed to fetch'));
    
    const result = await testSupabaseConnection();
    
    expect(result.connected).toBe(false);
    expect(result.endpointStatus).toBe('unreachable');
  });

  it('should return success with RPC when RPC test passes', async () => {
    // Mock successful fetch request
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);
    
    // Mock successful RPC call
    vi.mocked(supabase.rpc).mockReturnValueOnce({
      data: { version: '1.0.0' },
      error: null,
    });
    
    const result = await testSupabaseConnection();
    
    expect(result.connected).toBe(true);
    expect(result.method).toBe('rpc');
    expect(result.data).toEqual({ version: '1.0.0' });
  });

  it('should fall back to table test when RPC test fails', async () => {
    // Mock successful fetch request
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);
    
    // Mock failed RPC call
    vi.mocked(supabase.rpc).mockReturnValueOnce({
      data: null,
      error: { message: 'RPC error', code: 'ERROR' },
    });
    
    // Mock successful table call
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        data: { count: 5 },
        error: null,
      }),
    });
    
    const result = await testSupabaseConnection();
    
    expect(result.connected).toBe(true);
    expect(result.method).toBe('table');
    expect(result.data).toEqual({ count: 5 });
  });

  it('should return error when both RPC and table tests fail', async () => {
    // Mock successful fetch request
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);
    
    // Mock failed RPC call
    vi.mocked(supabase.rpc).mockReturnValueOnce({
      data: null,
      error: { message: 'RPC error', code: 'ERROR' },
    });
    
    // Mock failed table call
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        data: null,
        error: { message: 'Table error', code: 'ERROR' },
      }),
    });
    
    const result = await testSupabaseConnection();
    
    expect(result.connected).toBe(false);
    expect(result.error).toContain('Falha em ambos os métodos');
    expect(result.methods.rpc).toBeDefined();
    expect(result.methods.table).toBeDefined();
  });

  it('should handle exception during connection test', async () => {
    // Mock a general exception
    vi.mocked(fetch).mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    
    const result = await testSupabaseConnection();
    
    expect(result.connected).toBe(false);
    expect(result.error).toContain('Unexpected error');
    expect(result.timestamp).toBeDefined();
  });
});
