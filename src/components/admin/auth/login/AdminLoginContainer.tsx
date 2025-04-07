
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { useAdminLoginForm } from '@/hooks/admin/useAdminLoginForm';
import LoginForm from '@/components/admin/auth/login/LoginForm';
import PasswordResetDialog from '@/components/admin/auth/login/PasswordResetDialog';
import ConnectionAlert from '@/components/admin/auth/login/ConnectionAlert';
import LoginError from '@/components/admin/auth/login/LoginError';
import DiagnosticsPanel from '@/components/admin/auth/login/DiagnosticsPanel';
import { AlertTriangle } from 'lucide-react';

const AdminLoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { testConnection } = useAdminAuth();
  const [offlineMode, setOfflineMode] = useState(false);
  
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
    loadDebugInfo
  } = useAdminLoginForm();

  // Effect to redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin-j28s7d1k/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Effect to test connection when component mounts
  useEffect(() => {
    const checkConnection = async () => {
      console.log('AdminLogin: Verificando conexão...');
      if (!connectionStatus.tested) {
        await testConnection();
      }
    };
    
    checkConnection();
  }, [connectionStatus.tested, testConnection]);

  // Separate effect for loading debug info (prevents loops)
  useEffect(() => {
    loadDebugInfo();
  }, [loadDebugInfo]);

  const enterOfflineMode = () => {
    setOfflineMode(true);
    // Simulate authentication for demonstration purposes (not secure)
    sessionStorage.setItem('offline-admin-mode', 'true');
    navigate('/admin-j28s7d1k/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
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
          
          {!offlineMode && connectionStatus.tested && !connectionStatus.connected && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900">Modo demonstrativo disponível</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Você pode continuar no modo offline para demonstração com funcionalidades limitadas.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 bg-amber-100 border-amber-300 hover:bg-amber-200"
                    onClick={enterOfflineMode}
                  >
                    Continuar no modo offline
                  </Button>
                </div>
              </div>
            </div>
          )}
          
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
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-muted-foreground text-center">
            Área restrita para administradores do harmonIA.
          </p>
        </CardFooter>
      </Card>
      
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
