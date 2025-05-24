
// Re-export the useAdminAuth hook from the context file
import { useAdminAuth } from '@/context/AdminAuthContext';

export { useAdminAuth };

// For backward compatibility
export default useAdminAuth;
