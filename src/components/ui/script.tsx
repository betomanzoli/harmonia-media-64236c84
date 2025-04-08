
import React, { useEffect, useRef } from 'react';

interface ScriptProps extends React.HTMLAttributes<HTMLScriptElement> {
  src: string;
  'data-preference-id'?: string;
  'data-source'?: string;
}

export const Script: React.FC<ScriptProps> = ({ src, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const script = document.createElement('script');
    script.src = src;
    
    // Add all props as attributes
    Object.entries(props).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        script.setAttribute(key, value.toString());
      }
    });
    
    containerRef.current.appendChild(script);
    
    return () => {
      if (containerRef.current && script.parentNode) {
        containerRef.current.removeChild(script);
      }
    };
  }, [src, props]);
  
  return <div ref={containerRef} className="mercadopago-button-container" />;
};
