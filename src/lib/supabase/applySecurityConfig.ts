
import { securityService } from './securityConfig';

// Function to apply security configuration to a table
export const applySecurityConfig = async (
  tableName: string,
  enableRLS: boolean,
  policies?: { name: string; definition: string }[]
) => {
  const result = await securityService.configureRLS({
    tableName,
    enableRLS,
    policies
  });
  
  return result;
};

export const generateDefaultPolicies = (tableName: string) => {
  return [
    {
      name: `${tableName}_select_policy`,
      definition: `auth.uid() = client_id`
    },
    {
      name: `${tableName}_insert_policy`,
      definition: `auth.uid() = client_id`
    }
  ];
};
