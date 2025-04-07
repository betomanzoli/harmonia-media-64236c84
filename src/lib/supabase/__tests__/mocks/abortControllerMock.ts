
// Mock AbortSignal.timeout for tests
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function timeout(ms: number) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}

export {};
