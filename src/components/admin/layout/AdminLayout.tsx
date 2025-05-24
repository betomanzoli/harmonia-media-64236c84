
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar placeholder */}
        <div className="w-64 bg-gray-900 text-white p-4 hidden md:block">
          <h1 className="text-xl font-bold mb-6">HarmonIA Admin</h1>
          <nav>
            <ul className="space-y-2">
              <li><a href="/admin-j28s7d1k/dashboard" className="block py-2 px-4 rounded hover:bg-gray-800">Dashboard</a></li>
              <li><a href="/admin-j28s7d1k/projects" className="block py-2 px-4 rounded hover:bg-gray-800">Projetos</a></li>
              <li><a href="/admin-j28s7d1k/previews" className="block py-2 px-4 rounded hover:bg-gray-800">Prévias</a></li>
              <li><a href="/admin-j28s7d1k/clients" className="block py-2 px-4 rounded hover:bg-gray-800">Clientes</a></li>
              <li><a href="/admin-j28s7d1k/integrations" className="block py-2 px-4 rounded hover:bg-gray-800">Integrações</a></li>
              <li><a href="/admin-j28s7d1k/settings" className="block py-2 px-4 rounded hover:bg-gray-800">Configurações</a></li>
            </ul>
          </nav>
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
