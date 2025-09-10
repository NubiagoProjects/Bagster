import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  id?: string;
  level: LogLevel;
  message: string;
  service: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  timestamp: Date;
  environment: string;
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  service: string;
  action?: string;
  metadata?: Record<string, any>;
}

class LoggingService {
  private environment: string;
  private sessionId: string;
  private enableConsoleOutput: boolean;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.sessionId = this.generateSessionId();
    this.enableConsoleOutput = this.environment === 'development';
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Core logging method
  private async log(
    level: LogLevel,
    message: string,
    context: ErrorContext,
    error?: Error
  ): Promise<void> {
    try {
      const logEntry: LogEntry = {
        level,
        message,
        service: context.service,
        userId: context.userId,
        sessionId: context.sessionId || this.sessionId,
        requestId: context.requestId || this.generateRequestId(),
        metadata: context.metadata,
        timestamp: new Date(),
        environment: this.environment
      };

      // Add error details if provided
      if (error) {
        logEntry.error = {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: (error as any).code
        };
      }

      // Console output for development
      if (this.enableConsoleOutput) {
        this.outputToConsole(logEntry);
      }

      // Save to Firebase
      await addDoc(collection(db, 'logs'), {
        ...logEntry,
        timestamp: serverTimestamp()
      });

      // Send critical errors to external monitoring (in production)
      if (level === 'error' || level === 'fatal') {
        await this.sendToExternalMonitoring(logEntry);
      }
    } catch (loggingError) {
      // Fallback to console if logging fails
      console.error('Logging service failed:', loggingError);
      console.error('Original log entry:', { level, message, context, error });
    }
  }

  private outputToConsole(logEntry: LogEntry): void {
    const timestamp = logEntry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${logEntry.level.toUpperCase()}] [${logEntry.service}]`;
    
    switch (logEntry.level) {
      case 'debug':
        console.debug(prefix, logEntry.message, logEntry.metadata);
        break;
      case 'info':
        console.info(prefix, logEntry.message, logEntry.metadata);
        break;
      case 'warn':
        console.warn(prefix, logEntry.message, logEntry.metadata);
        break;
      case 'error':
      case 'fatal':
        console.error(prefix, logEntry.message, logEntry.error, logEntry.metadata);
        break;
    }
  }

  private async sendToExternalMonitoring(logEntry: LogEntry): Promise<void> {
    try {
      // In production, integrate with services like Sentry, DataDog, etc.
      if (this.environment === 'production') {
        // Example: Sentry integration
        // Sentry.captureException(logEntry.error, {
        //   level: logEntry.level,
        //   tags: {
        //     service: logEntry.service,
        //     environment: logEntry.environment
        //   },
        //   extra: logEntry.metadata
        // });
        
        console.log('Would send to external monitoring:', logEntry);
      }
    } catch (error) {
      console.error('Failed to send to external monitoring:', error);
    }
  }

  // Public logging methods
  public async debug(message: string, context: ErrorContext): Promise<void> {
    await this.log('debug', message, context);
  }

  public async info(message: string, context: ErrorContext): Promise<void> {
    await this.log('info', message, context);
  }

  public async warn(message: string, context: ErrorContext, error?: Error): Promise<void> {
    await this.log('warn', message, context, error);
  }

  public async error(message: string, context: ErrorContext, error?: Error): Promise<void> {
    await this.log('error', message, context, error);
  }

  public async fatal(message: string, context: ErrorContext, error?: Error): Promise<void> {
    await this.log('fatal', message, context, error);
  }

  // Structured logging for specific events
  public async logApiRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context: ErrorContext
  ): Promise<void> {
    await this.info(`API ${method} ${path} - ${statusCode} (${duration}ms)`, {
      ...context,
      metadata: {
        ...context.metadata,
        method,
        path,
        statusCode,
        duration
      }
    });
  }

  public async logDatabaseOperation(
    operation: string,
    collection: string,
    duration: number,
    context: ErrorContext,
    error?: Error
  ): Promise<void> {
    const message = `DB ${operation} on ${collection} (${duration}ms)`;
    
    if (error) {
      await this.error(message, {
        ...context,
        metadata: {
          ...context.metadata,
          operation,
          collection,
          duration
        }
      }, error);
    } else {
      await this.debug(message, {
        ...context,
        metadata: {
          ...context.metadata,
          operation,
          collection,
          duration
        }
      });
    }
  }

  public async logPaymentEvent(
    event: string,
    paymentId: string,
    amount: number,
    currency: string,
    context: ErrorContext,
    error?: Error
  ): Promise<void> {
    const message = `Payment ${event}: ${paymentId} - ${amount} ${currency}`;
    
    if (error) {
      await this.error(message, {
        ...context,
        metadata: {
          ...context.metadata,
          event,
          paymentId,
          amount,
          currency
        }
      }, error);
    } else {
      await this.info(message, {
        ...context,
        metadata: {
          ...context.metadata,
          event,
          paymentId,
          amount,
          currency
        }
      });
    }
  }

  public async logShipmentEvent(
    event: string,
    shipmentId: string,
    trackingNumber: string,
    context: ErrorContext,
    error?: Error
  ): Promise<void> {
    const message = `Shipment ${event}: ${trackingNumber} (${shipmentId})`;
    
    if (error) {
      await this.error(message, {
        ...context,
        metadata: {
          ...context.metadata,
          event,
          shipmentId,
          trackingNumber
        }
      }, error);
    } else {
      await this.info(message, {
        ...context,
        metadata: {
          ...context.metadata,
          event,
          shipmentId,
          trackingNumber
        }
      });
    }
  }

  public async logNotificationEvent(
    event: string,
    notificationId: string,
    channel: string,
    recipient: string,
    context: ErrorContext,
    error?: Error
  ): Promise<void> {
    const message = `Notification ${event}: ${notificationId} via ${channel} to ${recipient}`;
    
    if (error) {
      await this.error(message, {
        ...context,
        metadata: {
          ...context.metadata,
          event,
          notificationId,
          channel,
          recipient
        }
      }, error);
    } else {
      await this.info(message, {
        ...context,
        metadata: {
          ...context.metadata,
          event,
          notificationId,
          channel,
          recipient
        }
      });
    }
  }

  // Query logs
  public async getLogs(
    filters: {
      level?: LogLevel;
      service?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    } = {}
  ): Promise<LogEntry[]> {
    try {
      let logsQuery = query(collection(db, 'logs'));

      // Apply filters
      if (filters.level) {
        logsQuery = query(logsQuery, where('level', '==', filters.level));
      }
      if (filters.service) {
        logsQuery = query(logsQuery, where('service', '==', filters.service));
      }
      if (filters.userId) {
        logsQuery = query(logsQuery, where('userId', '==', filters.userId));
      }

      // Order by timestamp (most recent first)
      logsQuery = query(logsQuery, orderBy('timestamp', 'desc'));

      // Apply limit
      if (filters.limit) {
        logsQuery = query(logsQuery, limit(filters.limit));
      }

      const snapshot = await getDocs(logsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LogEntry));
    } catch (error) {
      console.error('Failed to query logs:', error);
      return [];
    }
  }

  // Get error statistics
  public async getErrorStats(
    timeRange: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): Promise<{
    totalErrors: number;
    errorsByService: Record<string, number>;
    errorsByLevel: Record<LogLevel, number>;
    topErrors: Array<{ message: string; count: number }>;
  }> {
    try {
      const now = new Date();
      const timeRanges = {
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000
      };

      const startTime = new Date(now.getTime() - timeRanges[timeRange]);

      const errorQuery = query(
        collection(db, 'logs'),
        where('level', 'in', ['error', 'fatal']),
        where('timestamp', '>=', startTime),
        orderBy('timestamp', 'desc'),
        limit(1000)
      );

      const snapshot = await getDocs(errorQuery);
      const logs = snapshot.docs.map(doc => doc.data() as LogEntry);

      const stats = {
        totalErrors: logs.length,
        errorsByService: {} as Record<string, number>,
        errorsByLevel: {} as Record<LogLevel, number>,
        topErrors: [] as Array<{ message: string; count: number }>
      };

      // Count errors by service
      logs.forEach(log => {
        stats.errorsByService[log.service] = (stats.errorsByService[log.service] || 0) + 1;
        stats.errorsByLevel[log.level] = (stats.errorsByLevel[log.level] || 0) + 1;
      });

      // Count top error messages
      const errorMessages: Record<string, number> = {};
      logs.forEach(log => {
        errorMessages[log.message] = (errorMessages[log.message] || 0) + 1;
      });

      stats.topErrors = Object.entries(errorMessages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([message, count]) => ({ message, count }));

      return stats;
    } catch (error) {
      console.error('Failed to get error stats:', error);
      return {
        totalErrors: 0,
        errorsByService: {},
        errorsByLevel: {} as Record<LogLevel, number>,
        topErrors: []
      };
    }
  }

  // Health check
  public async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
    lastError?: LogEntry;
  }> {
    try {
      const checks = {
        firebase: true,
        logging: true
      };

      // Check for recent critical errors
      const recentErrorsQuery = query(
        collection(db, 'logs'),
        where('level', '==', 'fatal'),
        where('timestamp', '>=', new Date(Date.now() - 5 * 60 * 1000)), // Last 5 minutes
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const recentErrors = await getDocs(recentErrorsQuery);
      const hasRecentFatalError = !recentErrors.empty;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      let lastError: LogEntry | undefined;

      if (hasRecentFatalError) {
        status = 'unhealthy';
        lastError = recentErrors.docs[0].data() as LogEntry;
      }

      return {
        status,
        checks,
        lastError
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        checks: {
          firebase: false,
          logging: false
        }
      };
    }
  }
}

export const loggingService = new LoggingService();
export default loggingService;
