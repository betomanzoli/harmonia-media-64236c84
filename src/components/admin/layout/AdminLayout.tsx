
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
