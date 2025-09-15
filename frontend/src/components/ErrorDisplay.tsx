import React from 'react';
import { Alert, Button, Container, Row, Col } from 'react-bootstrap';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'danger' | 'warning';
  showRetry?: boolean;
  className?: string;
  title?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  variant = 'danger',
  showRetry = true,
  className = '',
  title = 'An error occurred',
}) => {
  return (
    <Container className={className}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Alert variant={variant} dismissible={!!onDismiss} onClose={onDismiss}>
            <Alert.Heading className="h5">
              <i className={`bi bi-exclamation-triangle me-2`}></i>
              {title}
            </Alert.Heading>
            
            <p className="mb-3">{error}</p>

            {showRetry && onRetry && (
              <div className="d-flex gap-2">
                <Button 
                  variant={`outline-${variant}`} 
                  size="sm"
                  onClick={onRetry}
                  className="d-flex align-items-center gap-1"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                  Try Again
                </Button>
              </div>
            )}
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorDisplay;
