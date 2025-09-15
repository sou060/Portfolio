import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';
import type { ErrorBoundaryState } from '@/types';

interface Props {
  children: ReactNode;
  pageName: string;
  onError?: (error: Error, errorInfo: ErrorInfo, pageName: string) => void;
}

class PageErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.error(`Page ErrorBoundary caught an error in ${this.props.pageName}:`, error, errorInfo);
    }

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.props.pageName);
    }

    // Log to external service in production
    if (import.meta.env.VITE_ENVIRONMENT === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          pageName: this.props.pageName,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch((fetchError) => {
        console.error('Failed to log page error to service:', fetchError);
      });
    } catch (logError) {
      console.error('Page error logging failed:', logError);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Alert variant="warning" className="text-center">
                <Alert.Heading className="h4 mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {this.props.pageName} Page Error
                </Alert.Heading>
                
                <p className="mb-4">
                  There was an error loading the {this.props.pageName.toLowerCase()} page. 
                  This has been reported to our team.
                </p>

                {import.meta.env.VITE_DEBUG === 'true' && this.state.error && (
                  <details className="mb-4 text-start">
                    <summary className="mb-2 cursor-pointer">
                      <strong>Error Details (Development Only)</strong>
                    </summary>
                    <pre className="bg-dark text-light p-3 rounded small overflow-auto">
                      <strong>Page:</strong> {this.props.pageName}
                      {'\n'}
                      <strong>Error:</strong> {this.state.error.message}
                      {this.state.error.stack && (
                        <>
                          {'\n\n'}
                          <strong>Stack Trace:</strong>
                          {'\n'}
                          {this.state.error.stack}
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
                    onClick={() => window.history.back()}
                    className="d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-arrow-left"></i>
                    Go Back
                  </Button>
                </div>
              </Alert>
            </Col>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
