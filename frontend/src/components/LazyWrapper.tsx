import React, { Suspense, ComponentType } from 'react';
import LoadingState from './LoadingState';

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  type?: 'spinner' | 'skeleton' | 'card' | 'list';
  count?: number;
}

// Higher-order component for lazy loading with loading states
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  options: LazyWrapperProps = {}
) {
  const { fallback, type = 'skeleton', count = 3 } = options;

  const LazyComponent = (props: P) => (
    <Suspense
      fallback={
        fallback || <LoadingState type={type} count={count} className="py-5" />
      }
    >
      <Component {...props} />
    </Suspense>
  );

  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;

  return LazyComponent;
}

// Lazy wrapper component for direct use
const LazyWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  type?: 'spinner' | 'skeleton' | 'card' | 'list';
  count?: number;
}> = ({ children, fallback, type = 'spinner', count = 1 }) => {
  return (
    <Suspense
      fallback={
        fallback || <LoadingState type={type} count={count} className="py-5" />
      }
    >
      {children}
    </Suspense>
  );
};

export default LazyWrapper;
