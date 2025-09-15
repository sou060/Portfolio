import React, { memo, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  delay?: number;
  maxWidth?: string;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  showArrow?: boolean;
  interactive?: boolean;
  offset?: number;
  zIndex?: number;
  onShow?: () => void;
  onHide?: () => void;
}

const Tooltip: React.FC<TooltipProps> = memo(({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  delay = 300,
  maxWidth = '200px',
  className = '',
  contentClassName = '',
  disabled = false,
  showArrow = true,
  interactive = false,
  offset = 8,
  zIndex = 9999,
  onShow,
  onHide,
}) => {
  const { state: themeState } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Calculate tooltip position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;

    // Calculate base position based on placement
    switch (placement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + offset;
        break;
      case 'left':
      case 'left-start':
      case 'left-end':
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
      case 'right-start':
      case 'right-end':
        x = triggerRect.right + offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Adjust for start/end placements
    if (placement.includes('-start')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        x = triggerRect.left;
      } else {
        y = triggerRect.top;
      }
    } else if (placement.includes('-end')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        x = triggerRect.right - tooltipRect.width;
      } else {
        y = triggerRect.bottom - tooltipRect.height;
      }
    }

    // Keep tooltip within viewport
    if (x < 8) x = 8;
    if (x + tooltipRect.width > viewport.width - 8) {
      x = viewport.width - tooltipRect.width - 8;
    }
    if (y < 8) y = 8;
    if (y + tooltipRect.height > viewport.height - 8) {
      y = viewport.height - tooltipRect.height - 8;
    }

    setPosition({ x, y });
  }, [placement, offset]);

  // Show tooltip
  const showTooltip = useCallback(() => {
    if (disabled || isVisible) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      onShow?.();
    }, delay);
  }, [disabled, isVisible, delay, onShow]);

  // Hide tooltip
  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsVisible(false);
    onHide?.();
  }, [onHide]);

  // Handle mouse events
  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover') {
      showTooltip();
    }
  }, [trigger, showTooltip]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover' && !interactive) {
      hideTooltip();
    }
  }, [trigger, hideTooltip, interactive]);

  const handleClick = useCallback(() => {
    if (trigger === 'click') {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  }, [trigger, isVisible, showTooltip, hideTooltip]);

  const handleFocus = useCallback(() => {
    if (trigger === 'focus') {
      showTooltip();
    }
  }, [trigger, showTooltip]);

  const handleBlur = useCallback(() => {
    if (trigger === 'focus') {
      hideTooltip();
    }
  }, [trigger, hideTooltip]);

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, calculatePosition]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible, calculatePosition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: placement.startsWith('top') ? 10 : placement.startsWith('bottom') ? -10 : 0,
      x: placement.startsWith('left') ? 10 : placement.startsWith('right') ? -10 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.2,
      }
    }
  };

  // Arrow styles
  const getArrowStyles = () => {
    const arrowSize = 8;
    const arrowOffset = 12;

    switch (placement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        return {
          bottom: -arrowSize,
          left: placement === 'top-start' ? arrowOffset : placement === 'top-end' ? 'auto' : '50%',
          right: placement === 'top-end' ? arrowOffset : 'auto',
          transform: placement === 'top' ? 'translateX(-50%)' : 'none',
          borderTopColor: themeState.resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
        };
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        return {
          top: -arrowSize,
          left: placement === 'bottom-start' ? arrowOffset : placement === 'bottom-end' ? 'auto' : '50%',
          right: placement === 'bottom-end' ? arrowOffset : 'auto',
          transform: placement === 'bottom' ? 'translateX(-50%)' : 'none',
          borderBottomColor: themeState.resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: 'transparent',
        };
      case 'left':
      case 'left-start':
      case 'left-end':
        return {
          right: -arrowSize,
          top: placement === 'left-start' ? arrowOffset : placement === 'left-end' ? 'auto' : '50%',
          bottom: placement === 'left-end' ? arrowOffset : 'auto',
          transform: placement === 'left' ? 'translateY(-50%)' : 'none',
          borderLeftColor: themeState.resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: 'transparent',
        };
      case 'right':
      case 'right-start':
      case 'right-end':
        return {
          left: -arrowSize,
          top: placement === 'right-start' ? arrowOffset : placement === 'right-end' ? 'auto' : '50%',
          bottom: placement === 'right-end' ? arrowOffset : 'auto',
          transform: placement === 'right' ? 'translateY(-50%)' : 'none',
          borderRightColor: themeState.resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
        };
      default:
        return {};
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`tooltip-trigger ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`tooltip-content ${contentClassName}`}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onMouseEnter={interactive ? handleMouseEnter : undefined}
            onMouseLeave={interactive ? handleMouseLeave : undefined}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex,
              maxWidth,
              backgroundColor: themeState.resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
              color: themeState.resolvedTheme === 'dark' ? '#f1f5f9' : '#1e293b',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: 1.4,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              border: `1px solid ${themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
              pointerEvents: interactive ? 'auto' : 'none',
            }}
          >
            {content}
            {showArrow && (
              <div
                className="tooltip-arrow"
                style={{
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  borderWidth: '8px',
                  borderStyle: 'solid',
                  ...getArrowStyles(),
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
