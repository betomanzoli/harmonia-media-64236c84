
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from '../LoginForm';
import LoginError from '../LoginError';
import ConnectionAlert from '../ConnectionAlert';
import LoginHeader from './LoginHeader';
import DiagnosticsToggle from './DiagnosticsToggle';
import DiagnosticsPanelWrapper from './DiagnosticsPanel';

interface LoginContainerProps {
  loginErrorMessage: string | null;
  showDetailedError: boolean;
  isLoading: boolean;
  showConnectionStatus: boolean;
  diagnosticInfo: any;
  connectionStatus: string;
  email?: string;
  password?: string;
  handleEmailChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleDiagnostics: () => void;
  retryConnection: () => Promise<void>;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onResetPasswordClick: () => void;
}

const LoginContainer: React.FC<LoginContainerProps> = ({
  loginErrorMessage,
  showDetailedError,
  isLoading,
  showConnectionStatus,
  diagnosticInfo,
  connectionStatus,
  email = "",
  password = "",
  handleEmailChange = () => {},
  handlePasswordChange = () => {},
  toggleDiagnostics,
  retryConnection,
  handleLogin,
  onResetPasswordClick,
}) => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <>
      <LoginHeader />
      
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
            email={email}
            password={password}
            loading={isLoading}
            success={false}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onSubmit={handleLogin}
            onResetPasswordClick={onResetPasswordClick}
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
      
      <DiagnosticsToggle 
        showConnectionStatus={showConnectionStatus} 
        toggleDiagnostics={toggleDiagnostics} 
      />
      
      <DiagnosticsPanelWrapper 
        showConnectionStatus={showConnectionStatus}
        diagnosticInfo={diagnosticInfo}
      />
    </>
  );
};

export default LoginContainer;
