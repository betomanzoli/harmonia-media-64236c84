
import { useState } from "react";

type ToastVariant = "default" | "destructive" | "success";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastState {
  open: boolean;
  data: ToastProps | null;
}

export function useToast() {
  const [state, setState] = useState<ToastState>({
    open: false,
    data: null,
  });

  const toast = (props: ToastProps) => {
    setState({ open: true, data: props });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setState((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  const dismiss = () => {
    setState((prev) => ({ ...prev, open: false }));
  };

  return {
    toast,
    dismiss,
    ...state,
  };
}

export { type ToastProps };
