import React, { memo, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { useTheme } from '@/contexts';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'centered' | 'bottom' | 'fullscreen';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footer?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

const Modal: React.FC<ModalProps> = memo(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footer,
  loading = false,
  disabled = false,
}) => {
  const { state: themeState } = useTheme();

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !disabled) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose, disabled]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick && !disabled) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose, disabled]);

  // Get size classes
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'modal-sm';
      case 'md': return 'modal-md';
      case 'lg': return 'modal-lg';
      case 'xl': return 'modal-xl';
      case 'full': return 'modal-full';
      default: return 'modal-md';
    }
  };

  // Get variant classes
  const getVariantClass = () => {
    switch (variant) {
      case 'centered': return 'modal-centered';
      case 'bottom': return 'modal-bottom';
      case 'fullscreen': return 'modal-fullscreen';
      default: return 'modal-default';
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: variant === 'bottom' ? '100%' : variant === 'fullscreen' ? '100%' : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: variant === 'bottom' ? '100%' : variant === 'fullscreen' ? '100%' : 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={`modal-overlay ${overlayClassName}`}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1050,
            display: 'flex',
            alignItems: variant === 'bottom' ? 'flex-end' : 'center',
            justifyContent: 'center',
            padding: variant === 'fullscreen' ? 0 : '1rem',
          }}
        >
          <motion.div
            className={`modal-container ${getSizeClass()} ${getVariantClass()} ${className}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: themeState.resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
              borderRadius: variant === 'fullscreen' ? 0 : '1rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              maxHeight: variant === 'fullscreen' ? '100vh' : '90vh',
              width: variant === 'fullscreen' ? '100vw' : 'auto',
              maxWidth: variant === 'fullscreen' ? 'none' : '500px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            {(title || showCloseButton) && (
              <div className={`modal-header ${headerClassName}`} style={{
                padding: '1.5rem 1.5rem 0 1.5rem',
                borderBottom: `1px solid ${themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                {title && (
                  <h3 className="modal-title" style={{
                    margin: 0,
                    color: themeState.resolvedTheme === 'dark' ? '#f1f5f9' : '#1e293b',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                  }}>
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    disabled={disabled}
                    className="modal-close-btn"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: themeState.resolvedTheme === 'dark' ? '#94a3b8' : '#64748b',
                      fontSize: '1.5rem',
                      padding: '0.25rem',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.5rem',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = themeState.resolvedTheme === 'dark' ? '#334155' : '#f1f5f9';
                      e.currentTarget.style.color = themeState.resolvedTheme === 'dark' ? '#f1f5f9' : '#1e293b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = themeState.resolvedTheme === 'dark' ? '#94a3b8' : '#64748b';
                    }}
                  >
                    ×
                  </Button>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className={`modal-body ${bodyClassName}`} style={{
              padding: '0 1.5rem',
              flex: 1,
              overflow: 'auto',
              color: themeState.resolvedTheme === 'dark' ? '#f1f5f9' : '#1e293b',
            }}>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                children
              )}
            </div>

            {/* Modal Footer */}
            {footer && (
              <div className="modal-footer" style={{
                padding: '1rem 1.5rem 1.5rem 1.5rem',
                borderTop: `1px solid ${themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
                marginTop: '1rem',
              }}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = 'Modal';

export default Modal;
