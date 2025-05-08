
/**
 * Centralized logging utility for the application
 * Provides consistent logging patterns and can be extended for production usage
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  enabled: boolean;
  minLevel: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const defaultOptions: LoggerOptions = {
  enabled: process.env.NODE_ENV !== 'production',
  minLevel: 'debug'
};

class Logger {
  private options: LoggerOptions;

  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.options.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.options.minLevel];
  }

  private formatMessage(context: string, message: string): string {
    return `[${context.toUpperCase()}] ${message}`;
  }

  debug(context: string, message: string, data?: any): void {
    if (!this.shouldLog('debug')) return;
    
    if (data) {
      console.debug(this.formatMessage(context, message), data);
    } else {
      console.debug(this.formatMessage(context, message));
    }
  }

  info(context: string, message: string, data?: any): void {
    if (!this.shouldLog('info')) return;
    
    if (data) {
      console.info(this.formatMessage(context, message), data);
    } else {
      console.info(this.formatMessage(context, message));
    }
  }

  warn(context: string, message: string, data?: any): void {
    if (!this.shouldLog('warn')) return;
    
    if (data) {
      console.warn(this.formatMessage(context, message), data);
    } else {
      console.warn(this.formatMessage(context, message));
    }
  }

  error(context: string, message: string, error?: any): void {
    if (!this.shouldLog('error')) return;
    
    if (error) {
      console.error(this.formatMessage(context, message), error);
    } else {
      console.error(this.formatMessage(context, message));
    }
  }

  // Specialized logging functions
  api(action: string, data?: any): void {
    this.info('API', action, data);
  }

  auth(action: string, data?: any): void {
    this.info('AUTH', action, data);
  }

  db(action: string, data?: any): void {
    this.debug('DB', action, data);
  }

  ui(action: string, data?: any): void {
    this.debug('UI', action, data);
  }
}

// Export a singleton instance
export const logger = new Logger();

// Also export the class for creating custom loggers
export default Logger;
