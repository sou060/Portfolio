import React, { createContext, useContext, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ErrorContextType {
  reportError: (error: Error, context?: string) => void;
  clearError: () => void;
  hasError: boolean;
  error: Error | null;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
}

export const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  const reportError = useCallback((error: Error, context?: string) => {
    // Log error to console in development
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.error(`Error reported${context ? ` in ${context}` : ''}:`, error);
    }

    // Set error state
    setError(error);

    // Show user-friendly notification
    toast.error(
      context 
        ? `Something went wrong in ${context}. Please try again.`
        : 'Something went wrong. Please try again.',
      {
        duration: 5000,
        position: 'top-right',
      }
    );

    // Log to external service in production
    if (import.meta.env.VITE_ENVIRONMENT === 'production') {
      logErrorToService(error, context);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const logErrorToService = async (error: Error, context?: string) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  };

  const value: ErrorContextType = {
    reportError,
    clearError,
    hasError: !!error,
    error,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorBoundaryProvider');
  }
  return context;
};

export default ErrorBoundaryProvider;
