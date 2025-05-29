
import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import NewAdminSidebar from './NewAdminSidebar';

interface NewAdminLayoutProps {
  children: React.ReactNode;
}

const NewAdminLayout: React.FC<NewAdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <NewAdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center justify-between w-full">
                <div>
                  <h2 className="text-lg font-semibold">harmonIA Admin</h2>
                  <p className="text-sm text-gray-500">Gestão de Projetos Musicais</p>
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default NewAdminLayout;
