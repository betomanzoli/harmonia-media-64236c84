
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Implementação do logout aqui
    navigate('/admin-j28s7d1k/login');
  };

  return (
    <header className="bg-white shadow-sm border-b py-4 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">harmonIA Admin</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>Admin</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-1" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
