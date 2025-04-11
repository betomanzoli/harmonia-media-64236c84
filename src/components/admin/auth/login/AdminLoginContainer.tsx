
import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import PasswordResetDialog from './PasswordResetDialog';
import LoginContainer from './components/LoginContainer';
import { useLoginState } from './hooks/useLoginState';
import { useConnectionInfo } from './hooks/useConnectionInfo';

const MotionCard = motion(Card);

interface AdminLoginContainerProps {
  onAuthenticate?: (email: string, password: string) => boolean;
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
          toggleDiagnostics={toggleDiagnostics}
          retryConnection={retryConnection}
          handleLogin={handleLogin}
          onResetPasswordClick={() => setIsPasswordResetOpen(true)}
        />
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
