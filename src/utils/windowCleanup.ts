
// Enhanced window object cleanup for MetaMask/Web3 conflicts
export const cleanupWindowEthereum = () => {
  if (typeof window === 'undefined') return;

  try {
    // List of ethereum-related properties to remove
    const ethereumProps = [
      'ethereum',
      'web3',
      'MetaMask',
      '__METAMASK_STREAM__',
      'mist',
      'web3_currentProvider',
      '__ethereum_provider__'
    ];

    ethereumProps.forEach(prop => {
      if (prop in window) {
        try {
          delete (window as any)[prop];
        } catch (e) {
          // If deletion fails, set to undefined
          (window as any)[prop] = undefined;
        }
      }
    });

    // Prevent MetaMask injection by defining non-configurable properties
    Object.defineProperty(window, 'ethereum', {
      value: undefined,
      writable: false,
      configurable: false
    });

    Object.defineProperty(window, 'web3', {
      value: undefined,
      writable: false,
      configurable: false
    });

    // Block common injection points
    if ('document' in window && window.document) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT') {
                const script = element as HTMLScriptElement;
                if (script.src && (
                  script.src.includes('metamask') ||
                  script.src.includes('web3') ||
                  script.src.includes('ethereum')
                )) {
                  console.warn('Blocked ethereum-related script:', script.src);
                  script.remove();
                }
              }
            }
          });
        });
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }

    console.log('Window ethereum cleanup completed');
  } catch (error) {
    console.warn('Error during window cleanup:', error);
  }
};

// Global error handling setup
export const setupGlobalErrorHandling = () => {
  if (typeof window === 'undefined') return;

  // Handle uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error caught:', {
      message,
      source,
      lineno,
      colno,
      error
    });
    
    // Store error for debugging
    (window as any).__harmoniaGlobalError = {
      message,
      source,
      lineno,
      colno,
      error,
      timestamp: new Date().toISOString()
    };

    // Don't prevent default error handling
    return false;
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Store error for debugging
    (window as any).__harmoniaUnhandledRejection = {
      reason: event.reason,
      timestamp: new Date().toISOString()
    };
  });

  // Handle resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      console.error('Resource loading error:', {
        target: event.target,
        message: event.message,
        filename: event.filename
      });
    }
  }, true);

  console.log('Global error handling setup completed');
};
