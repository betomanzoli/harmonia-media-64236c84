
import React, { useState, useEffect } from 'react';
import { useAdminLoginForm } from '@/hooks/admin/useAdminLoginForm';
import LoginForm from './LoginForm';
import PasswordResetDialog from './PasswordResetDialog';
import LoginError from './LoginError';
import ConnectionAlert from './ConnectionAlert';
import DiagnosticsPanel from './DiagnosticsPanel';
import { useConnectionTest } from '@/hooks/admin/useConnectionTest';
import { useDiagnostics } from '@/hooks/admin/useDiagnostics';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminLoginContainer: React.FC = () => {
  const { formState, formHandlers } = useAdminLoginForm();
  const { connectionStatus, errorDetails, testConnection } = useConnectionTest();
  const { diagnosticInfo, loadDebugInfo, runDiagnostics } = useDiagnostics();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [detailedErrorInfo, setDetailedErrorInfo] = useState('');
  
  // Generate diagnostic information on first load
  useEffect(() => {
    testConnection();
    loadDebugInfo();
  }, [testConnection, loadDebugInfo]);

  const toggleDiagnostics = () => {
    setShowDiagnostics(!showDiagnostics);
  };

  const handleRetryConnection = async () => {
    await testConnection();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950 to-indigo-900 z-0" />
      
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen w-full px-4">
        <div className="w-full max-w-md bg-card/90 backdrop-blur-sm shadow-xl rounded-xl p-8 border border-muted">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Administração</h1>
            <p className="text-muted-foreground">Entre com suas credenciais para acessar</p>
          </div>
          
          {connectionStatus === 'error' && (
            <ConnectionAlert 
              connectionStatus={errorDetails || 'Erro desconhecido'} 
              retryConnection={handleRetryConnection}
              toggleDiagnostics={toggleDiagnostics}
            />
          )}
          
          {formState.error && (
            <LoginError 
              error={formState.error}
              detailedError={detailedErrorInfo}
              toggleDiagnostics={toggleDiagnostics}
            />
          )}
          
          <LoginForm 
            email={formState.email}
            password={formState.password}
            loading={formState.loading}
            success={formState.success}
            onEmailChange={formHandlers.handleEmailChange}
            onPasswordChange={formHandlers.handlePasswordChange}
            onSubmit={formHandlers.handleSubmit}
            onResetPasswordClick={formHandlers.openResetDialog}
          />
          
          {connectionStatus !== 'error' && !formState.error && !formState.success && (
            <div className="mt-6">
              <Alert variant="default" className="bg-card border-muted">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <AlertTitle className="text-sm">Ambiente seguro</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                  Esta área é restrita a administradores autorizados. Todas as tentativas de acesso são registradas.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={toggleDiagnostics}
            >
              {showDiagnostics ? "Ocultar diagnósticos" : "Diagnósticos do sistema"}
            </Button>
          </div>
          
          {showDiagnostics && diagnosticInfo && (
            <DiagnosticsPanel diagnosticInfo={diagnosticInfo} />
          )}
        </div>
      </div>
      
      <PasswordResetDialog
        open={formState.showPasswordReset}
        onOpenChange={formHandlers.closeResetDialog}
        onSubmit={formHandlers.handleResetPassword}
        isLoading={formState.resetLoading}
      />
    </div>
  );
};

export default AdminLoginContainer;
