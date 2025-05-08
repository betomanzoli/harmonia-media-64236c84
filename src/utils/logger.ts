
/**
 * Centralized logger for the application
 * Provides consistent logging with context and can be extended with remote logging
 */
export const logger = {
  /**
   * Log debug messages (only visible in development)
   */
  debug: (context: string, message: string, data?: any): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${context}] ${message}`, data !== undefined ? data : '');
    }
  },
  
  /**
   * Log informational messages
   */
  info: (context: string, message: string, data?: any): void => {
    console.log(`[${context}] ${message}`, data !== undefined ? data : '');
  },
  
  /**
   * Log warning messages
   */
  warn: (context: string, message: string, data?: any): void => {
    console.warn(`[${context}] ${message}`, data !== undefined ? data : '');
  },
  
  /**
   * Log error messages
   */
  error: (context: string, message: string, error?: any): void => {
    console.error(`[${context}] ${message}`, error !== undefined ? error : '');
    
    // Here we could send errors to a remote logging service
    // if (error && process.env.NODE_ENV === 'production') {
    //   sendToRemoteLogging(context, message, error);
    // }
  },
  
  /**
   * Log API interaction messages
   */
  api: (method: string, endpoint: string, data?: any): void => {
    console.log(`[API] ${method} ${endpoint}`, data !== undefined ? data : '');
  }
};

export default logger;
