
import { useAdminAuth as useAuthFromContext } from '@/context/AdminAuthContext';

// This file is a re-export to ensure consistent imports
export const useAdminAuth = useAuthFromContext;

// For backward compatibility
export default useAdminAuth;
