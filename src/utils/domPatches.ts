// src/utils/domPatches.ts
export function applyDOMPatches() {
  if (typeof window === 'undefined') return;
  
  // ✅ CONFORME RESULTADO [5] - PATCH PARA GOOGLE TRANSLATE:
  if (!window.__domPatchesApplied) {
    const originalRemoveChild = Node.prototype.removeChild;
    const originalInsertBefore = Node.prototype.insertBefore;
    const originalAppendChild = Node.prototype.appendChild;

    // Patch removeChild
    Node.prototype.removeChild = function (child) {
      try {
        if (this.contains && !this.contains(child)) {
          console.warn('[DOM Patch] Tentativa de remover child inexistente ignorada');
          return child;
        }
        return originalRemoveChild.call(this, child);
      } catch (error) {
        console.warn('[DOM Patch] removeChild error ignorado:', error.message);
        return child;
      }
    };

    // Patch insertBefore
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode);
      } catch (error) {
        console.warn('[DOM Patch] insertBefore error, usando appendChild:', error.message);
        try {
          return this.appendChild(newNode);
        } catch (appendError) {
          console.warn('[DOM Patch] appendChild também falhou:', appendError.message);
          return newNode;
        }
      }
    };

    // Patch appendChild
    Node.prototype.appendChild = function (child) {
      try {
        return originalAppendChild.call(this, child);
      } catch (error) {
        console.warn('[DOM Patch] appendChild error ignorado:', error.message);
        return child;
      }
    };

    // ✅ CONFORME RESULTADO [15] - PATCH PARA ETHEREUM:
    try {
      Object.defineProperty(window, 'ethereum', {
        get() {
          return window.__ethereum || undefined;
        },
        set(value) {
          window.__ethereum = value;
        },
        configurable: true
      });
    } catch (error) {
      console.warn('[DOM Patch] Ethereum patch falhou:', error.message);
    }

    // Patch para erros globais
    const originalErrorHandler = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      const ignorableErrors = [
        'ethereum',
        'removeChild',
        'insertBefore',
        'WebAssembly',
        'Content Security Policy',
        'Cannot set property'
      ];

      const shouldIgnore = ignorableErrors.some(keyword => 
        message?.toLowerCase().includes(keyword.toLowerCase())
      );

      if (shouldIgnore) {
        console.warn('[DOM Patch] Erro global ignorado:', message);
        return true; // Previne o erro
      }

      if (originalErrorHandler) {
        return originalErrorHandler.call(this, message, source, lineno, colno, error);
      }
      return false;
    };

    window.__domPatchesApplied = true;
    console.log('[DOM Patch] Patches aplicados com sucesso');
  }
}
