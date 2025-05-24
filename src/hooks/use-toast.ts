import { useState, useCallback } from "react";

type ToastVariant = "default" | "destructive" | "success" | "warning";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastState {
  open: boolean;
  data: ToastProps | null;
  id: string | null;
}

export function useToast() {
  const [state, setState] = useState<ToastState>({
    open: false,
    data: null,
    id: null,
  });

  const toast = useCallback((props: ToastProps) => {
    const id = Math.random().toString(36);
    setState({ open: true, data: props, id });
    
    // Auto-hide after specified duration or 3 seconds
    const duration = props.duration || 3000;
    setTimeout(() => {
      setState((prev) => 
        prev.id === id ? { ...prev, open: false } : prev
      );
    }, duration);
  }, []);

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  // Success toast shorthand
  const success = useCallback((title: string, description?: string) => {
    toast({ title, description, variant: "success" });
  }, [toast]);

  // Error toast shorthand
  const error = useCallback((title: string, description?: string) => {
    toast({ title, description, variant: "destructive" });
  }, [toast]);

  // Warning toast shorthand
  const warning = useCallback((title: string, description?: string) => {
    toast({ title, description, variant: "warning" });
  }, [toast]);

  return {
    toast,
    dismiss,
    success,
    error,
    warning,
    ...state,
  };
}

export { type ToastProps };
