
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAdminLoginForm } from '@/hooks/admin/useAdminLoginForm';
import LoginForm from './LoginForm';
import LoginError from './LoginError';
import ConnectionAlert from './ConnectionAlert';
import DiagnosticsPanel from './DiagnosticsPanel';
import PasswordResetDialog from './PasswordResetDialog';

const MotionCard = motion(Card);

interface AdminLoginContainerProps {
  onAuthenticate?: (email: string, password: string) => boolean;
}

const AdminLoginContainer: React.FC<AdminLoginContainerProps> = ({ onAuthenticate }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
  const [showDetailedError, setShowDetailedError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Simulated connection status and diagnostics data
  const connectionStatus = navigator.onLine ? 'online' : 'offline';
  
  // Safe access to navigator.connection properties using a helper function
  const getConnectionInfo = () => {
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    return connection ? {
      rtt: connection.rtt,
      downlink: connection.downlink,
      effectiveType: connection.effectiveType,
      saveData: connection.saveData
    } : {
      rtt: undefined,
      downlink: undefined,
      effectiveType: undefined,
      saveData: undefined
    };
  };
  
  const diagnosticInfo = {
    environment: "production",
    supportsIndexedDB: typeof window !== 'undefined' && 'indexedDB' in window,
    supportsFetch: typeof fetch !== 'undefined',
    supportsWebSockets: typeof WebSocket !== 'undefined',
    browserName: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                 navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                 navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown',
    browserVersion: navigator.userAgent.match(/Chrome\/([0-9.]+)/) 
                    ? navigator.userAgent.match(/Chrome\/([0-9.]+)/)![1] 
                    : 'Unknown',
    operatingSystem: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    localStorageAvailable: typeof localStorage !== 'undefined',
    sessionStorageAvailable: typeof sessionStorage !== 'undefined',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    storageInfo: {
      localStorageSize: "N/A",
      sessionStorageSize: "N/A",
    },
    connectionDetails: getConnectionInfo(),
    authSettings: "Modo de desenvolvimento",
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'não configurado',
  };
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Use the provided authentication function if available
    if (onAuthenticate) {
      const success = onAuthenticate(email, password);
      if (success) {
        // Navigate after successful login
        toast({
          title: "Login bem-sucedido",
          description: "Você está sendo redirecionado para o painel administrativo.",
        });
        navigate('/admin-j28s7d1k/dashboard');
        return;
      } else {
        setLoginErrorMessage('Credenciais inválidas. Por favor, verifique seu email e senha.');
        setIsLoading(false);
        return;
      }
    }
    
    // Fallback authentication logic
    if (email === 'contato@harmonia.media' && password === 'i9!_b!ThA;2H6/bt') {
      // Store authentication information
      localStorage.setItem('harmonia-admin-auth-token', 'admin-token-for-development');
      localStorage.setItem('harmonia-admin-auth-user', JSON.stringify({ email, role: 'admin' }));
      
      toast({
        title: "Login bem-sucedido",
        description: "Você está sendo redirecionado para o painel administrativo.",
      });
      
      // Navigate to dashboard
      navigate('/admin-j28s7d1k/dashboard');
    } else {
      setLoginErrorMessage('Credenciais inválidas. Por favor, verifique seu email e senha.');
      setIsLoading(false);
    }
  };
  
  // Functions for ConnectionAlert component
  const retryConnection = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };
  
  // Toggle diagnostic panel
  const toggleDiagnostics = () => {
    setShowConnectionStatus(!showConnectionStatus);
  };
  
  // Handle password reset request
  const handlePasswordReset = async (email: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Email enviado",
      description: "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha.",
    });
    setIsPasswordResetOpen(false);
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
                error={loginErrorMessage} 
                detailedError={showDetailedError ? "Erro de autenticação: credenciais inválidas" : undefined}
                toggleDiagnostics={toggleDiagnostics}
              />
            )}
            
            <LoginForm 
              email=""
              password=""
              loading={isLoading}
              success={false}
              onEmailChange={() => {}}
              onPasswordChange={() => {}}
              onSubmit={handleLogin}
              onResetPasswordClick={() => setIsPasswordResetOpen(true)}
            />
            
            {showConnectionStatus && (
              <div className="mt-6">
                <ConnectionAlert 
                  connectionStatus={connectionStatus}
                  retryConnection={retryConnection}
                  toggleDiagnostics={toggleDiagnostics}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center">
          <button 
            className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
            onClick={toggleDiagnostics}
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
            <DiagnosticsPanel diagnosticInfo={diagnosticInfo} />
          </motion.div>
        )}
      </MotionCard>
      
      <PasswordResetDialog 
        open={isPasswordResetOpen}
        onOpenChange={setIsPasswordResetOpen}
        onSubmit={handlePasswordReset}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminLoginContainer;
