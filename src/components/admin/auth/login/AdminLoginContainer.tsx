
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { useAdminLoginForm } from '@/hooks/admin/useAdminLoginForm';
import LoginForm from '@/components/admin/auth/login/LoginForm';
import PasswordResetDialog from '@/components/admin/auth/login/PasswordResetDialog';
import ConnectionAlert from '@/components/admin/auth/login/ConnectionAlert';
import LoginError from '@/components/admin/auth/login/LoginError';
import DiagnosticsPanel from '@/components/admin/auth/login/DiagnosticsPanel';

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
    loadDebugInfo
  } = useAdminLoginForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin-j28s7d1k/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const checkConnection = async () => {
      console.log('AdminLogin: Verificando conexão...');
      if (!connectionStatus.tested) {
        await testConnection();
      }
      
      loadDebugInfo();
    };
    
    checkConnection();
  }, [connectionStatus.tested, testConnection, loadDebugInfo]);

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
