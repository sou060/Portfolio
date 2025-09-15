import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  timestamp: number;
}

interface UsePerformanceOptions {
  measureRender?: boolean;
  measureMemory?: boolean;
  logToConsole?: boolean;
  reportToService?: boolean;
  componentName?: string;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    measureRender = true,
    measureMemory = false,
    logToConsole = import.meta.env.VITE_DEBUG === 'true',
    reportToService = import.meta.env.VITE_ENVIRONMENT === 'production',
    componentName = 'Unknown',
  } = options;

  const renderStartTime = useRef<number>(0);
  const mountTime = useRef<number>(0);

  // Measure render time
  const startRenderMeasure = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderMeasure = useCallback((): PerformanceMetrics => {
    const renderTime = performance.now() - renderStartTime.current;
    const metrics: PerformanceMetrics = {
      renderTime,
      timestamp: Date.now(),
    };

    // Measure memory usage if available
    if (measureMemory && 'memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = memory.usedJSHeapSize;
    }

    // Log to console in development
    if (logToConsole) {
      console.log(`[Performance] ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        memoryUsage: metrics.memoryUsage ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A',
      });
    }

    // Report to service in production
    if (reportToService && renderTime > 100) { // Only report slow renders
      reportPerformanceMetrics(metrics, componentName);
    }

    return metrics;
  }, [measureMemory, logToConsole, reportToService, componentName]);

  // Measure component mount time
  useEffect(() => {
    if (measureRender) {
      mountTime.current = performance.now();
      startRenderMeasure();
    }

    return () => {
      if (measureRender) {
        endRenderMeasure();
      }
    };
  }, [measureRender, startRenderMeasure, endRenderMeasure]);

  // Measure specific operations
  const measureOperation = useCallback((operationName: string, operation: () => void | Promise<void>) => {
    const startTime = performance.now();
    
    const result = operation();
    
    if (result instanceof Promise) {
      return result.then(() => {
        const duration = performance.now() - startTime;
        
        if (logToConsole) {
          console.log(`[Performance] ${componentName} - ${operationName}:`, `${duration.toFixed(2)}ms`);
        }
        
        if (reportToService && duration > 1000) { // Report slow operations
          reportPerformanceMetrics({
            renderTime: duration,
            timestamp: Date.now(),
          }, `${componentName} - ${operationName}`);
        }
        
        return duration;
      });
    } else {
      const duration = performance.now() - startTime;
      
      if (logToConsole) {
        console.log(`[Performance] ${componentName} - ${operationName}:`, `${duration.toFixed(2)}ms`);
      }
      
      return Promise.resolve(duration);
    }
  }, [logToConsole, reportToService, componentName]);

  return {
    startRenderMeasure,
    endRenderMeasure,
    measureOperation,
    mountTime: mountTime.current,
  };
}

// Report performance metrics to external service
async function reportPerformanceMetrics(metrics: PerformanceMetrics, componentName: string) {
  try {
    await fetch('/api/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...metrics,
        componentName,
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    });
  } catch (error) {
    console.error('Failed to report performance metrics:', error);
  }
}

// Hook for measuring API call performance
export function useApiPerformance() {
  const measureApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<{ data: T; duration: number }> => {
    const startTime = performance.now();
    
    try {
      const data = await apiCall();
      const duration = performance.now() - startTime;
      
      if (import.meta.env.VITE_DEBUG === 'true') {
        console.log(`[API Performance] ${endpoint}:`, `${duration.toFixed(2)}ms`);
      }
      
      // Report slow API calls
      if (duration > 2000) {
        await fetch('/api/performance/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint,
            duration,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
          }),
        });
      }
      
      return { data, duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[API Performance] ${endpoint} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }, []);

  return { measureApiCall };
}

// Hook for measuring bundle size and loading performance
export function useBundlePerformance() {
  useEffect(() => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      // Log bundle information
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      
      console.log('[Bundle Performance] Scripts:', scripts.length);
      console.log('[Bundle Performance] Stylesheets:', stylesheets.length);
      
      // Measure page load performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          console.log('[Bundle Performance] Page Load:', {
            domContentLoaded: `${(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart).toFixed(2)}ms`,
            loadComplete: `${(navigation.loadEventEnd - navigation.loadEventStart).toFixed(2)}ms`,
            totalLoadTime: `${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`,
          });
        }, 0);
      });
    }
  }, []);
}

export default usePerformance;
