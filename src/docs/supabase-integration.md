
# Supabase Integration Documentation

## Overview

This document provides a comprehensive guide to the Supabase integration in the harmonIA application. The integration is organized into several modules, each responsible for specific functionality. This modular approach allows for better code organization, maintainability, and testing.

## Table of Contents

1. [Client Module](#client-module)
2. [Connection Testing](#connection-testing)
3. [Authentication Testing](#authentication-testing)
4. [Email Service](#email-service)
5. [Security Configuration](#security-configuration)
6. [Database Migrations](#database-migrations)
7. [Security Application](#security-application)

---

## Client Module

**File Path:** `src/lib/supabase/client.ts`

The client module is responsible for initializing and configuring the Supabase client that will be used throughout the application.

### Functions and Variables

- `supabase`: The main Supabase client instance used for all database and authentication operations.
- `getSupabaseUrl()`: Returns the configured Supabase URL.

### Usage Example

```typescript
import { supabase, getSupabaseUrl } from '@/lib/supabase';

// Using the client for database operations
const { data, error } = await supabase
  .from('table_name')
  .select('*');

// Getting the URL
const url = getSupabaseUrl();
```

---

## Connection Testing

**File Path:** `src/lib/supabase/connectionTest.ts`

This module provides utilities for testing the connection to the Supabase backend. It's especially useful for diagnosing connectivity issues.

### Functions

- `validateConfiguration()`: Checks if the Supabase configuration is valid.
- `testSupabaseConnection()`: Performs a comprehensive connection test using multiple methods.

### Usage Example

```typescript
import { testSupabaseConnection, validateConfiguration } from '@/lib/supabase';

// Validate configuration
const config = validateConfiguration();
if (!config.isValid) {
  console.error('Invalid configuration:', config.issues);
}

// Test connection
const connectionResult = await testSupabaseConnection();
if (connectionResult.connected) {
  console.log('Successfully connected to Supabase!');
} else {
  console.error('Connection failed:', connectionResult.error);
}
```

### Return Values

The `testSupabaseConnection()` function returns an object with the following properties:

- `connected`: Boolean indicating if the connection was successful.
- `error`: Error message if the connection failed.
- `method`: The method used for successful connection ('rpc' or 'table').
- `data`: Data returned from the successful connection test.
- Various status properties for detailed diagnostics.

---

## Authentication Testing

**File Path:** `src/lib/supabase/authTest.ts`

This module provides functionality for testing and verifying the authentication service.

### Functions

- `testAuthSettings()`: Tests the authentication configuration and returns the status.

### Usage Example

```typescript
import { testAuthSettings } from '@/lib/supabase';

// Test authentication settings
const authResult = await testAuthSettings();
if (authResult.success) {
  console.log('Authentication service is working correctly!');
} else {
  console.error('Authentication service issue:', authResult.error);
}
```

### Return Values

The `testAuthSettings()` function returns an object with:

- `success`: Boolean indicating if the auth service is working correctly.
- `message`: Success message if applicable.
- `error`: Error message if there was a problem.
- `user`: User information if already authenticated.

---

## Email Service

**File Path:** `src/lib/supabase/emailService.ts`

This module handles sending emails through Supabase Edge Functions.

### Functions

- `sendBriefingConfirmation(email, name)`: Sends a confirmation email after receiving a briefing.
- `sendPreviewNotification(email, name, previewUrl)`: Notifies users when new previews are available.
- `sendPaymentConfirmation(email, name, packageName)`: Confirms a payment for a specific package.

### Usage Example

```typescript
import { emailService } from '@/lib/supabase';

// Send a briefing confirmation
const result = await emailService.sendBriefingConfirmation(
  'user@example.com',
  'João Silva'
);

if (result.success) {
  console.log('Email sent successfully!');
} else {
  console.error('Failed to send email:', result.error);
}
```

---

## Security Configuration

**File Path:** `src/lib/supabase/securityConfig.ts`

This module provides functions for configuring and managing security settings in Supabase.

### Functions

- `applyRLSPolicies()`: Applies Row Level Security policies to database tables.
- `enhancePasswordSecurity()`: Configures stronger password requirements.
- `configureMFA()`: Sets up Multi-Factor Authentication options.
- `validateSecurity()`: Validates current security settings.

### Usage Example

```typescript
import { securityService } from '@/lib/supabase';

// Apply RLS policies
const rlsResult = await securityService.applyRLSPolicies();
if (rlsResult.success) {
  console.log('RLS policies applied successfully!');
}

// Check security status
const securityStatus = await securityService.validateSecurity();
console.log('Security status:', securityStatus);
```

---

## Database Migrations

**File Path:** `src/lib/supabase/migrations.ts`

This module handles database migrations and schema updates.

### Functions

- `createTableRLSPolicies(tableName)`: Creates RLS policies for a specific table.
- `runMigrations()`: Executes all necessary migrations to set up or update the database.

### Usage Example

```typescript
import { runMigrations } from '@/lib/supabase';

// Run all migrations
const result = await runMigrations();
if (result.success) {
  console.log('All migrations completed successfully!');
} else {
  console.error('Migration failed:', result.error);
}
```

---

## Security Application

**File Path:** `src/lib/supabase/applySecurityConfig.ts`

This module provides functionality for applying all security configurations at once.

### Functions

- `applyAllSecurityConfigurations()`: Applies all security configurations, including RLS policies, password security, and MFA.

### Usage Example

```typescript
import { applyAllSecurityConfigurations } from '@/lib/supabase';

// Apply all security configurations
const result = await applyAllSecurityConfigurations();
if (result.success) {
  console.log('All security configurations applied successfully!');
} else {
  console.error('Failed to apply security configurations:', result.error);
}
```

---

## Troubleshooting

If you encounter issues with the Supabase integration, follow these steps:

1. **Check your internet connection** - Many issues are simply due to network connectivity problems.
2. **Verify Supabase URL and key** - Ensure your Supabase URL and anonymous key are correct.
3. **Run connection diagnostics** - Use the `testSupabaseConnection()` function to diagnose connectivity issues.
4. **Check console for errors** - Browser console logs may contain more detailed error information.
5. **Verify RLS policies** - Row Level Security issues can cause unexpected authentication or data access problems.

---

## Best Practices

- Always handle errors from Supabase operations.
- Use the provided security service to apply proper RLS policies.
- Implement proper authentication checks before accessing protected data.
- Use the connection testing utilities during application initialization to detect issues early.
- Consider implementing offline fallbacks for critical functionality.

---

## References

- [Supabase Documentation](https://supabase.io/docs)
- [Supabase JavaScript Client](https://github.com/supabase/supabase-js)
- [Row Level Security Guide](https://supabase.io/docs/guides/auth/row-level-security)
