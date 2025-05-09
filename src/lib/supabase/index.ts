
// Re-export all supabase-related modules from a central file
export { supabase, getSupabaseUrl, emailService } from '../supabase';
export { testSupabaseConnection } from './connectionTest';
export { testAuthSettings } from './authTest';
export { securityService } from './securityConfig';
export { default as runMigrations } from './migrations';
export { default as applyAllSecurityConfigurations } from './applySecurityConfig';
