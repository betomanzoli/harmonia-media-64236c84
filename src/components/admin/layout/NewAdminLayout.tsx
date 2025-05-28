
import React from 'react';
import { Button } from '@/components/ui/button';
import { Music, LogOut, Home, FolderOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NewAdminLayoutProps {
  children: React.ReactNode;
}

const NewAdminLayout: React.FC<NewAdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    window.location.href = '/admin';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-harmonia-green" />
              <span className="text-xl font-bold">harmonIA Admin</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1 ml-8">
              <Button 
                asChild 
                variant={isActive('/admin') ? 'default' : 'ghost'}
                className={isActive('/admin') ? 'bg-harmonia-green hover:bg-harmonia-green/90' : ''}
              >
                <Link to="/admin">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Projetos
                </Link>
              </Button>
              <Button 
                asChild 
                variant={isActive('/admin/dashboard') ? 'default' : 'ghost'}
                className={isActive('/admin/dashboard') ? 'bg-harmonia-green hover:bg-harmonia-green/90' : ''}
              >
                <Link to="/admin/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/" target="_blank">
                Ver Site Público
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default NewAdminLayout;
