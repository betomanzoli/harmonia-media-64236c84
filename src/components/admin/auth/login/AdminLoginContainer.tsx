import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { useAdminLoginForm from '@/hooks/admin/useAdminLoginForm';
import LoginForm from '@/components/admin/auth/login/LoginForm';
import PasswordResetDialog from '@/components/admin/auth/login/PasswordResetDialog';
import ConnectionAlert from '@/components/admin/auth/login/ConnectionAlert';
import LoginError from '@/components/admin/auth/login/LoginError';
import DiagnosticsPanel from '@/components/admin/auth/login/DiagnosticsPanel';
import { AlertCircle } from 'lucide-react';

const AdminLoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { testConnection } = useAdminAuth();
  
  const {
    isLoading,
    loginError,
    showPasswordReset,
    setShowPasswordReset,
    detailedErrorInfo,
    debugInfo,
    connectionStatus,
    isAuthenticated,
    handleSubmit,
    handleRetryConnection,
    runDiagnostics,
    handlePasswordReset,
    loadDebugInfo,
    enableOfflineMode
  } = useAdminLoginForm();

  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Effect to check if offline mode is active
  useEffect(() => {
    const offlineMode = sessionStorage.getItem('offline-admin-mode');
    setIsOfflineMode(offlineMode === 'true');
    
    if (offlineMode === 'true') {
      console.log('Modo offline ativo no login');
    }
  }, []);

  // Effect to redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated || isOfflineMode) {
      navigate('/admin-j28s7d1k/dashboard');
    }
  }, [isAuthenticated, navigate, isOfflineMode]);

  // Effect to test connection when component mounts
  useEffect(() => {
    const checkConnection = async () => {
      console.log('AdminLogin: Verificando conexão...');
      if (!connectionStatus.tested && !isOfflineMode) {
        await testConnection();
      }
    };
    
    checkConnection();
  }, [connectionStatus.tested, testConnection, isOfflineMode]);

  // Separate effect for loading debug info (prevents loops)
  useEffect(() => {
    if (!isOfflineMode) {
      loadDebugInfo();
    }
  }, [loadDebugInfo, isOfflineMode]);

  // Handle enabling offline mode - now using the fixed function
  const handleEnableOfflineMode = async () => {
    await enableOfflineMode();
    navigate('/admin-j28s7d1k/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {isOfflineMode ? (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Redirecionando...</CardTitle>
            <CardDescription>
              Entrando no modo de demonstração
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-harmonia-green mb-4"></div>
              <p>Inicializando o modo offline...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">harmonIA</CardTitle>
            <CardDescription>
              Área Administrativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectionAlert 
              connectionStatus={connectionStatus}
              onRetry={handleRetryConnection}
              isLoading={isLoading}
            />
            
            <LoginError 
              error={loginError} 
              detailedError={detailedErrorInfo}
            />

            <LoginForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
              connectionStatus={connectionStatus}
              onPasswordReset={() => setShowPasswordReset(true)}
            />

            <DiagnosticsPanel 
              diagnosticInfo={debugInfo}
              connectionStatus={connectionStatus}
              onRunDiagnostics={runDiagnostics}
              isLoading={isLoading}
            />
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-start">
                <AlertCircle className="text-amber-500 h-5 w-5 mr-2 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-amber-700">Problemas para acessar?</p>
                  <p className="mt-1">
                    Se estiver enfrentando problemas de conexão, você pode usar o modo de demonstração para explorar as funcionalidades administrativas.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleEnableOfflineMode}
                  >
                    Acessar modo de demonstração
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-sm text-muted-foreground text-center">
              Área restrita para administradores do harmonIA.
            </p>
          </CardFooter>
        </Card>
      )}
      
      <PasswordResetDialog
        open={showPasswordReset}
        onOpenChange={setShowPasswordReset}
        onSubmit={handlePasswordReset}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminLoginContainer;
