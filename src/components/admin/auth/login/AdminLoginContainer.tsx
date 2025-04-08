
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from './LoginForm';
import LoginError from './LoginError';
import ConnectionAlert from './ConnectionAlert';
import DiagnosticsPanel from './DiagnosticsPanel';
import PasswordResetDialog from './PasswordResetDialog';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionCard = motion(Card);

interface AdminLoginContainerProps {
  onAuthenticate?: (email: string, password: string) => boolean;
}

const AdminLoginContainer: React.FC<AdminLoginContainerProps> = ({ onAuthenticate }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleLogin = (email: string, password: string) => {
    // Use the provided authentication function if available
    if (onAuthenticate) {
      const success = onAuthenticate(email, password);
      if (success) {
        // Navigate after successful login
        navigate('/admin-j28s7d1k/dashboard');
        return true;
      } else {
        setLoginErrorMessage('Credenciais inválidas. Por favor, verifique seu email e senha.');
        return false;
      }
    }
    
    // Fallback authentication logic
    if (email === 'contato@harmonia.media' && password === 'i9!_b!ThA;2H6/bt') {
      // Store authentication information
      localStorage.setItem('harmonia-admin-auth-token', 'admin-token-for-development');
      localStorage.setItem('harmonia-admin-auth-user', JSON.stringify({ email, role: 'admin' }));
      
      // Navigate to dashboard
      navigate('/admin-j28s7d1k/dashboard');
      return true;
    } else {
      setLoginErrorMessage('Credenciais inválidas. Por favor, verifique seu email e senha.');
      return false;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <MotionCard 
        className="w-full max-w-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Painel harmonIA</h1>
          <p className="text-gray-500 text-sm">Área administrativa restrita</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-1 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            {loginErrorMessage && (
              <LoginError 
                message={loginErrorMessage} 
                onClose={() => setLoginErrorMessage(null)}
              />
            )}
            
            <LoginForm 
              onSubmit={handleLogin}
              onForgotPassword={() => setIsPasswordResetOpen(true)}
            />
            
            {showConnectionStatus && (
              <div className="mt-6">
                <ConnectionAlert />
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <button 
            className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
            onClick={() => setShowConnectionStatus(!showConnectionStatus)}
          >
            {showConnectionStatus ? "Ocultar diagnóstico" : "Verificar conexão"}
          </button>
        </div>
        
        {showConnectionStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <DiagnosticsPanel />
          </motion.div>
        )}
      </MotionCard>
      
      <PasswordResetDialog 
        open={isPasswordResetOpen}
        onOpenChange={setIsPasswordResetOpen}
      />
    </div>
  );
};

export default AdminLoginContainer;
