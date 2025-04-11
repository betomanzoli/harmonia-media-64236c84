
import React, { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from './AdminSidebar';
import { AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { manageWebhookUrls } from '@/services/googleDriveService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [webhookUrls, setWebhookUrls] = useState<Record<string, string>>({});
  const location = useLocation();

  useEffect(() => {
    // Get all webhook URLs for the status display
    setWebhookUrls(manageWebhookUrls.getAll());
    
    // Set up for future changes too
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.endsWith('_webhookUrl')) {
        // Update webhook URLs if any changes
        setWebhookUrls(manageWebhookUrls.getAll());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  // Count configured webhooks
  const configuredWebhooks = Object.keys(webhookUrls).length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-gray-900 to-black">
        {configuredWebhooks > 0 && (
          <div className="bg-harmonia-green/20 border-b border-harmonia-green/30 py-2 px-4 text-white text-sm fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center justify-center gap-2">
              <span>✓</span>
              <span>{configuredWebhooks} {configuredWebhooks === 1 ? 'integração configurada' : 'integrações configuradas'} com armazenamento externo</span>
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
