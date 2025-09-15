import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  className = '',
  animation = 'pulse',
}) => {
  const baseClasses = 'skeleton-loader bg-secondary opacity-25';
  const variantClasses = {
    text: 'skeleton-text',
    circular: 'skeleton-circular rounded-circle',
    rectangular: 'skeleton-rectangular',
  };
  const animationClasses = {
    pulse: 'skeleton-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  const skeletonClasses = [
    baseClasses,
    variantClasses[variant],
    animationClasses[animation],
    className,
  ].filter(Boolean).join(' ');

  const style: React.CSSProperties = {
    width,
    height,
  };

  return <div className={skeletonClasses} style={style} />;
};

// Predefined skeleton components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`card p-4 ${className}`}>
    <SkeletonLoader variant="rectangular" height="200px" className="mb-3" />
    <SkeletonLoader variant="text" width="80%" height="1.5rem" className="mb-2" />
    <SkeletonLoader variant="text" width="100%" height="1rem" className="mb-1" />
    <SkeletonLoader variant="text" width="60%" height="1rem" className="mb-3" />
    <div className="d-flex gap-2">
      <SkeletonLoader variant="rectangular" width="60px" height="30px" />
      <SkeletonLoader variant="rectangular" width="80px" height="30px" />
    </div>
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className = '' 
}) => (
  <div className={className}>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="d-flex align-items-center mb-3">
        <SkeletonLoader variant="circular" width="40px" height="40px" className="me-3" />
        <div className="flex-grow-1">
          <SkeletonLoader variant="text" width="70%" height="1rem" className="mb-1" />
          <SkeletonLoader variant="text" width="50%" height="0.8rem" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTable: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string 
}> = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => (
  <div className={`table-responsive ${className}`}>
    <table className="table">
      <thead>
        <tr>
          {Array.from({ length: columns }, (_, index) => (
            <th key={index}>
              <SkeletonLoader variant="text" width="80%" height="1rem" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }, (_, colIndex) => (
              <td key={colIndex}>
                <SkeletonLoader variant="text" width="90%" height="0.8rem" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SkeletonLoader;
