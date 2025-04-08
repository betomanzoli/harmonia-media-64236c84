
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
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [webhookUrls, setWebhookUrls] = useState<Record<string, string>>({});
  const location = useLocation();

  useEffect(() => {
    const offlineMode = sessionStorage.getItem('offline-admin-mode');
    setIsOfflineMode(offlineMode === 'true');
    
    // Get all webhook URLs for the status display
    setWebhookUrls(manageWebhookUrls.getAll());
    
    // Set up for future changes too
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'offline-admin-mode') {
        setIsOfflineMode(event.newValue === 'true');
      } else if (event.key?.endsWith('_webhookUrl')) {
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
      <div className="flex min-h-screen w-full bg-gradient-to-b from-white to-harmonia-light-green/10 flex-col">
        {isOfflineMode && (
          <div className="bg-amber-100 border-b border-amber-300 py-2 px-4 text-amber-900 text-sm">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Modo de demonstração ativo - Funcionalidades de API estão limitadas.</span>
            </div>
          </div>
        )}
        {configuredWebhooks > 0 && (
          <div className="bg-green-100 border-b border-green-300 py-2 px-4 text-green-900 text-sm">
            <div className="flex items-center justify-center gap-2">
              <span>✓</span>
              <span>{configuredWebhooks} {configuredWebhooks === 1 ? 'integração configurada' : 'integrações configuradas'} com armazenamento externo</span>
            </div>
          </div>
        )}
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <div className="flex-1 overflow-auto">
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
