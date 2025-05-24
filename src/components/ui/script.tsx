
import React, { useEffect, useState } from 'react';

interface ScriptProps {
  src: string;
  onLoad?: () => void;
  onError?: () => void;
  async?: boolean;
  defer?: boolean;
}

// Component to load external scripts dynamically
export const Script: React.FC<ScriptProps> = ({ 
  src, 
  onLoad, 
  onError,
  async = false,
  defer = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    
    if (existingScript) {
      setLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    
    // Event handlers
    script.onload = () => {
      setLoaded(true);
      if (onLoad) onLoad();
    };
    
    script.onerror = () => {
      setError(true);
      if (onError) onError();
    };
    
    // Add to document
    document.body.appendChild(script);
    
    // Cleanup
    return () => {
      // Only remove scripts we've added (not pre-existing ones)
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [src, async, defer, onLoad, onError]);

  return null; // This component doesn't render anything
};

export default Script;
