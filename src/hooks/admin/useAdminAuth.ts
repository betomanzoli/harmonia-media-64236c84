
import { useContext } from 'react';
import AdminAuthContext from '@/context/AdminAuthContext';

/**
 * Custom hook to access the admin authentication context
 * @returns The admin auth context
 * @throws Error if used outside of an AdminAuthProvider
 */
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAuth deve ser usado dentro de um AdminAuthProvider');
  }
  
  return context;
};

// For backward compatibility
export default useAdminAuth;
