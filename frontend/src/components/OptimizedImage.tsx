import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  placeholder?: string;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  quality?: number;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  lazy = true,
  onLoad,
  onError,
  quality = 75,
  sizes = '100vw',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image URL (you can integrate with services like Cloudinary, ImageKit, etc.)
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    // For now, return original src. In production, you might want to:
    // - Use a CDN like Cloudinary or ImageKit
    // - Generate different sizes for responsive images
    // - Add WebP format support
    return originalSrc;
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
        threshold: 0.1,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
    onError?.();
  }, [onError]);

  const imageStyle: React.CSSProperties = {
    width,
    height,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };

  const placeholderStyle: React.CSSProperties = {
    width,
    height,
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
  };

  if (hasError) {
    return (
      <div
        style={{ width, height, ...placeholderStyle }}
        className={`bg-light border d-flex align-items-center justify-content-center ${className}`}
      >
        <div className="text-center text-muted">
          <i className="bi bi-image fs-1 mb-2"></i>
          <div>Failed to load image</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      style={{ width, height, position: 'relative' }}
      className={className}
    >
      {/* Placeholder */}
      <div style={placeholderStyle}>
        {placeholder ? (
          <img
            src={placeholder}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Spinner animation="border" variant="secondary" size="sm" />
        )}
      </div>

      {/* Actual image */}
      {isInView && (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          sizes={sizes}
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedImage;
