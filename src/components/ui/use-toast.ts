
import { useToast, toast } from "@/hooks/use-toast";

// Add better styling for admin toasts
toast.custom = (message: string) => {
  toast({
    title: "Notificação",
    description: message,
    className: "bg-gray-800 text-white border border-gray-700",
  });
};

export { useToast, toast };
