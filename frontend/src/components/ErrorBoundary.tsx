import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';
import type { ErrorBoundaryState } from '@/types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (import.meta.env.VITE_ENVIRONMENT === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to an error tracking service
    // like Sentry, LogRocket, or Bugsnag
    try {
      // Example: Send to external service
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch((fetchError) => {
        console.error('Failed to log error to service:', fetchError);
      });
    } catch (logError) {
      console.error('Error logging failed:', logError);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Alert variant="danger" className="text-center">
                <Alert.Heading className="h4 mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Oops! Something went wrong
                </Alert.Heading>
                
                <p className="mb-4">
                  We're sorry, but something unexpected happened. This error has been 
                  automatically reported to our team.
                </p>

                {import.meta.env.VITE_DEBUG === 'true' && this.state.error && (
                  <details className="mb-4 text-start">
                    <summary className="mb-2 cursor-pointer">
                      <strong>Error Details (Development Only)</strong>
                    </summary>
                    <pre className="bg-dark text-light p-3 rounded small overflow-auto">
                      <strong>Error:</strong> {this.state.error.message}
                      {this.state.error.stack && (
                        <>
                          {'\n\n'}
                          <strong>Stack Trace:</strong>
                          {'\n'}
                          {this.state.error.stack}
                        </>
                      )}
                      {this.state.errorInfo?.componentStack && (
                        <>
                          {'\n\n'}
                          <strong>Component Stack:</strong>
                          {'\n'}
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </details>
                )}

                <div className="d-flex gap-3 justify-content-center">
                  <Button 
                    variant="primary" 
                    onClick={this.handleRetry}
                    className="d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                    Try Again
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={this.handleReload}
                    className="d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                    Reload Page
                  </Button>
                </div>

                <hr className="my-4" />
                
                <p className="mb-0 small text-muted">
                  If this problem persists, please{' '}
                  <a 
                    href="mailto:sourav.mondal@email.com" 
                    className="text-decoration-none"
                  >
                    contact support
                  </a>
                </p>
              </Alert>
            </Col>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
