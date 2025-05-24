
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Music, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin-j28s7d1k/dashboard' },
    { icon: Users, label: 'Clientes', path: '/admin-j28s7d1k/clients' },
    { icon: Music, label: 'Projetos', path: '/admin-j28s7d1k/projects' },
    { icon: FileText, label: 'Briefings', path: '/admin-j28s7d1k/briefings' },
    { icon: BarChart3, label: 'Estatísticas', path: '/admin-j28s7d1k/statistics' },
    { icon: Settings, label: 'Configurações', path: '/admin-j28s7d1k/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 h-screen sticky top-0">
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">harmonIA Admin</h1>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Logout */}
          <div className="mt-8 pt-4 border-t border-gray-700">
            <Link
              to="/admin-j28s7d1k/login"
              className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Link>
          </div>
        </nav>
      </aside>
      
      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
