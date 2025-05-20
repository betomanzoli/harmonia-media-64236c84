
import React from 'react';
import { motion } from 'framer-motion';

interface FadeTransitionProps {
  children: React.ReactNode;
  duration?: number;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({ 
  children, 
  duration = 0.3 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};
