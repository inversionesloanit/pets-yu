import fs from 'fs';
import path from 'path';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
}

class Logger {
  private logDir: string;
  private maxFileSize: number;
  private maxFiles: number;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.maxFiles = 5;

    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatLogEntry(level: LogLevel, message: string, data?: any, req?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userId: req?.user?.id,
      ip: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get('User-Agent'),
      url: req?.url,
      method: req?.method,
    };
  }

  private writeToFile(filename: string, entry: LogEntry): void {
    const logFile = path.join(this.logDir, filename);
    const logLine = JSON.stringify(entry) + '\n';

    try {
      fs.appendFileSync(logFile, logLine);
      this.rotateLogFile(logFile);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private rotateLogFile(logFile: string): void {
    try {
      const stats = fs.statSync(logFile);
      if (stats.size > this.maxFileSize) {
        // Rotate files
        for (let i = this.maxFiles - 1; i > 0; i--) {
          const oldFile = `${logFile}.${i}`;
          const newFile = `${logFile}.${i + 1}`;
          
          if (fs.existsSync(oldFile)) {
            if (i === this.maxFiles - 1) {
              fs.unlinkSync(oldFile); // Delete oldest file
            } else {
              fs.renameSync(oldFile, newFile);
            }
          }
        }
        
        // Move current file to .1
        fs.renameSync(logFile, `${logFile}.1`);
      }
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  private log(level: LogLevel, message: string, data?: any, req?: any): void {
    const entry = this.formatLogEntry(level, message, data, req);
    
    // Console output
    const consoleMessage = `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`;
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(consoleMessage, data ? JSON.stringify(data, null, 2) : '');
        break;
      case LogLevel.WARN:
        console.warn(consoleMessage, data ? JSON.stringify(data, null, 2) : '');
        break;
      case LogLevel.INFO:
        console.info(consoleMessage, data ? JSON.stringify(data, null, 2) : '');
        break;
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV === 'development') {
          console.debug(consoleMessage, data ? JSON.stringify(data, null, 2) : '');
        }
        break;
    }

    // File output
    this.writeToFile(`${level}.log`, entry);
    
    // Also write errors to combined log
    if (level === LogLevel.ERROR) {
      this.writeToFile('combined.log', entry);
    }
  }

  error(message: string, data?: any, req?: any): void {
    this.log(LogLevel.ERROR, message, data, req);
  }

  warn(message: string, data?: any, req?: any): void {
    this.log(LogLevel.WARN, message, data, req);
  }

  info(message: string, data?: any, req?: any): void {
    this.log(LogLevel.INFO, message, data, req);
  }

  debug(message: string, data?: any, req?: any): void {
    this.log(LogLevel.DEBUG, message, data, req);
  }

  // Performance logging
  performance(message: string, duration: number, data?: any, req?: any): void {
    const perfData = {
      duration,
      ...data,
    };
    this.log(LogLevel.INFO, `PERFORMANCE: ${message}`, perfData, req);
  }

  // Security logging
  security(message: string, data?: any, req?: any): void {
    const securityData = {
      type: 'security',
      ...data,
    };
    this.log(LogLevel.WARN, `SECURITY: ${message}`, securityData, req);
  }

  // API request logging
  apiRequest(req: any, res: any, duration?: number): void {
    const data = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
    };

    if (res.statusCode >= 400) {
      this.log(LogLevel.ERROR, 'API Request Error', data, req);
    } else {
      this.log(LogLevel.INFO, 'API Request', data, req);
    }
  }
}

// Global logger instance
export const logger = new Logger();

// Request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.apiRequest(req, res, duration);
  });

  next();
};

// Performance monitoring middleware
export const performanceLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 1000) { // Log slow requests (>1s)
      logger.performance('Slow request detected', duration, {
        url: req.url,
        method: req.method,
        statusCode: res.statusCode,
      }, req);
    }
  });

  next();
};

export default logger;
