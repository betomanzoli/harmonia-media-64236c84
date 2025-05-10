
import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import PasswordResetDialog from './PasswordResetDialog';
import LoginContainer from './components/LoginContainer';
import { useLoginState } from './hooks/useLoginState';
import { useConnectionInfo } from './hooks/useConnectionInfo';

const MotionCard = motion(Card);

interface AdminLoginContainerProps {
  onAuthenticate?: (email: string, password: string) => Promise<boolean>;
}

const AdminLoginContainer: React.FC<AdminLoginContainerProps> = ({ onAuthenticate }) => {
  // Custom hooks for state management
  const { 
    isPasswordResetOpen, 
    setIsPasswordResetOpen,
    loginErrorMessage,
    showDetailedError,
    isLoading,
    showConnectionStatus,
    email,
    password,
    handleEmailChange,
    handlePasswordChange,
    toggleDiagnostics,
    handleLogin,
    handlePasswordReset
  } = useLoginState(onAuthenticate);
  
  // Connection information hook
  const { connectionStatus, diagnosticInfo, retryConnection } = useConnectionInfo();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <MotionCard 
        className="w-full max-w-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginContainer 
          loginErrorMessage={loginErrorMessage}
          showDetailedError={showDetailedError}
          isLoading={isLoading}
          showConnectionStatus={showConnectionStatus}
          diagnosticInfo={diagnosticInfo}
          connectionStatus={connectionStatus}
          email={email}
          password={password}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
          toggleDiagnostics={toggleDiagnostics}
          retryConnection={retryConnection}
          handleLogin={handleLogin}
          onResetPasswordClick={() => setIsPasswordResetOpen(true)}
        />
      </MotionCard>
      
      <div className="mt-4 text-white text-sm">
        <p>Usuário de admin: <strong>admin@harmonia.com</strong> / Senha: <strong>admin123456</strong></p>
        <p>Ou: <strong>contato@harmonia.media</strong> / Senha: <strong>harmonia2023</strong></p>
      </div>
      
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
