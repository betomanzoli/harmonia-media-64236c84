
// Mock implementation for AbortController with timeout method
global.AbortSignal = {
  ...global.AbortSignal,
  timeout: (ms: number) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  },
};
