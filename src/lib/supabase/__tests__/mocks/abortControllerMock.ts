
// Mock implementation for AbortController with timeout method
global.AbortSignal = {
  ...global.AbortSignal,
  timeout: function(ms: number) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  }
};
