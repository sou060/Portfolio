import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size,
  variant = 'primary',
  className = '',
  text = 'Loading...',
}) => {
  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <Spinner
        animation="border"
        variant={variant}
        size={size}
        className="me-2"
      />
      <span className="text-muted">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
