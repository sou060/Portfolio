import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import { SkeletonCard, SkeletonList } from './SkeletonLoader';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'card' | 'list';
  message?: string;
  size?: 'sm' | 'lg';
  count?: number;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  message = 'Loading...',
  size,
  count = 3,
  className = '',
}) => {
  const renderLoadingContent = () => {
    switch (type) {
      case 'skeleton':
        return <SkeletonCard />;
      
      case 'card':
        return (
          <Row>
            {Array.from({ length: count }, (_, index) => (
              <Col key={index} md={6} lg={4} className="mb-4">
                <SkeletonCard />
              </Col>
            ))}
          </Row>
        );
      
      case 'list':
        return <SkeletonList count={count} />;
      
      case 'spinner':
      default:
        return (
          <LoadingSpinner 
            size={size} 
            text={message}
            className="py-5"
          />
        );
    }
  };

  return (
    <Container className={className}>
      {type === 'spinner' ? (
        <Row className="justify-content-center">
          <Col className="text-center">
            {renderLoadingContent()}
          </Col>
        </Row>
      ) : (
        renderLoadingContent()
      )}
    </Container>
  );
};

export default LoadingState;
