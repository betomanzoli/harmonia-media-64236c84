
import { useToast, toast } from "@/hooks/use-toast";

// Create a custom toast function instead of trying to extend the toast object
const customToast = (message: string) => {
  toast({
    title: "Notificação",
    description: message,
    className: "bg-gray-800 text-white border border-gray-700",
  });
};

export { useToast, toast, customToast };
