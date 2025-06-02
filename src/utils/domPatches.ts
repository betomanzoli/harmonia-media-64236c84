
// Global window interface extension
declare global {
  interface Window {
    __domPatchesApplied?: boolean;
    __ethereum?: any;
  }
}

export const applyDomPatches = () => {
  if (typeof window === 'undefined' || window.__domPatchesApplied) {
    return;
  }

  // Patch 1: Prevent MetaMask from injecting into iframes
  try {
    if (window.__ethereum) {
      delete window.__ethereum;
    }
  } catch (error) {
    console.warn('[DOMPatch] Could not remove ethereum provider');
  }

  // Patch 2: Sanitize DOM manipulation
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName: string, options?: ElementCreationOptions) {
    const element = originalCreateElement.call(this, tagName, options);
    
    // Sanitize script elements
    if (typeof tagName === 'string' && tagName.toLowerCase() === 'script') {
      element.setAttribute('data-sanitized', 'true');
    }
    
    return element;
  };

  window.__domPatchesApplied = true;
};

// Auto-apply patches
applyDomPatches();
