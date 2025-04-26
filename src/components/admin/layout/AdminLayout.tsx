
import React, { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from './AdminSidebar';
import { useLocation } from 'react-router-dom';
import webhookService from '@/services/webhookService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [hasWebhookConfig, setHasWebhookConfig] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    // Check if webhook is configured
    const checkWebhook = async () => {
      const url = await webhookService.getWebhookUrl();
      setHasWebhookConfig(!!url);
    };
    
    checkWebhook();
    
    // Listen for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.includes('webhook')) {
        checkWebhook();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-gray-900 to-black">
        {hasWebhookConfig && (
          <div className="bg-harmonia-green/20 border-b border-harmonia-green/30 py-2 px-4 text-white text-sm fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-center gap-2">
              <span>✓</span>
              <span>Integração configurada com armazenamento externo</span>
            </div>
          </div>
        )}
        <div className="flex flex-1 w-full">
          <div className="sticky top-0 h-screen">
            <AdminSidebar />
          </div>
          <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-900 to-black pt-8 ml-[240px]">
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
