
// Extend global interface for window properties
declare global {
  interface Window {
    __domPatchesApplied?: boolean;
    __ethereum?: any;
  }
}

function applyDOMPatches() {
  if (typeof window === 'undefined' || window.__domPatchesApplied) {
    return;
  }

  // Patch for Element.scrollIntoView to support smooth scrolling in older browsers
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function(options?: ScrollIntoViewOptions | boolean) {
      if (typeof options === 'boolean') {
        // Legacy behavior: boolean indicates alignToTop
        const alignToTop = options;
        const rect = this.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetTop = rect.top + scrollTop - (alignToTop ? 0 : window.innerHeight);
        window.scrollTo(0, targetTop);
      } else {
        // Modern behavior with options
        const rect = this.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetTop = rect.top + scrollTop;
        
        if (options?.behavior === 'smooth') {
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        } else {
          window.scrollTo(0, targetTop);
        }
      }
    };
  }

  // Patch for ResizeObserver in older browsers
  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      private callback: ResizeObserverCallback;
      private elements: Set<Element> = new Set();

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe(element: Element) {
        this.elements.add(element);
        // Simulate resize observation with a simple interval check
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          this.callback([{
            target: element,
            contentRect: rect,
            borderBoxSize: [{ blockSize: rect.height, inlineSize: rect.width }],
            contentBoxSize: [{ blockSize: rect.height, inlineSize: rect.width }],
            devicePixelContentBoxSize: [{ blockSize: rect.height, inlineSize: rect.width }]
          }], this);
        }, 100);
      }

      unobserve(element: Element) {
        this.elements.delete(element);
      }

      disconnect() {
        this.elements.clear();
      }
    };
  }

  // Prevent Web3 wallet injection conflicts
  if (window.__ethereum) {
    delete window.__ethereum;
  }

  // Patch for potential string/event type conflicts
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(
    type: string,
    listener: EventListener | EventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ) {
    // Ensure type is always a string
    const eventType = typeof type === 'string' ? type : String(type);
    return originalAddEventListener.call(this, eventType, listener, options);
  };

  // Handle potential event type issues
  const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
  EventTarget.prototype.dispatchEvent = function(event: Event) {
    // Additional type checking for events
    if (!(event instanceof Event)) {
      console.warn('Invalid event dispatched:', event);
      return false;
    }
    return originalDispatchEvent.call(this, event);
  };

  // Mark patches as applied
  window.__domPatchesApplied = true;
}

// Apply patches immediately
applyDOMPatches();

// Export for explicit application if needed
export default applyDOMPatches;
