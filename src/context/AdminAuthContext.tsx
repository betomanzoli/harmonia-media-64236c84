
import React, { createContext } from 'react';
import { AdminAuthContextType } from '@/types/admin-auth';

// Create context with undefined as default value
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// For backward compatibility
export { useAdminAuth } from '@/hooks/admin/useAdminAuth';
export { useAdminAuth as useAuth } from '@/hooks/admin/useAdminAuth';

export default AdminAuthContext;
