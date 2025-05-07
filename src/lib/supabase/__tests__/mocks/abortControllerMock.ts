
// Mock AbortSignal.timeout for tests
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function timeout(ms: number) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}

// Mock localStorage for tests running in environments without it
if (typeof localStorage === 'undefined') {
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  };
}

export {};
