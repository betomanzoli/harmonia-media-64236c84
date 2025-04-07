
import React, { useEffect, useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from './AdminSidebar';
import { AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const offlineMode = sessionStorage.getItem('offline-admin-mode');
    setIsOfflineMode(offlineMode === 'true');
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50 flex-col">
        {isOfflineMode && (
          <div className="bg-amber-100 border-b border-amber-300 py-2 px-4 text-amber-900 text-sm">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Modo de demonstração ativo - Funcionalidades de API estão limitadas.</span>
            </div>
          </div>
        )}
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
