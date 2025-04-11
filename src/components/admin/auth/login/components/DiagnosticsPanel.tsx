
import React from 'react';
import { motion } from 'framer-motion';
import DiagnosticsPanel from '../DiagnosticsPanel';

interface DiagnosticsPanelWrapperProps {
  showConnectionStatus: boolean;
  diagnosticInfo: any;
}

const DiagnosticsPanelWrapper: React.FC<DiagnosticsPanelWrapperProps> = ({ 
  showConnectionStatus, 
  diagnosticInfo 
}) => {
  if (!showConnectionStatus) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 overflow-hidden"
    >
      <DiagnosticsPanel diagnosticInfo={diagnosticInfo} />
    </motion.div>
  );
};

export default DiagnosticsPanelWrapper;
