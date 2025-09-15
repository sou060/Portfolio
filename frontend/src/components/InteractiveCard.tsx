import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts';
import { useHoverAnimation, useClickAnimation } from '@/hooks/useAnimation';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  interactive?: boolean;
  glowEffect?: boolean;
  tiltEffect?: boolean;
  scaleOnHover?: boolean;
  borderGlow?: boolean;
  shadowIntensity?: 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  background?: 'solid' | 'gradient' | 'transparent';
  gradient?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const InteractiveCard: React.FC<InteractiveCardProps> = memo(({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hoverable = true,
  clickable = false,
  onClick,
  onHover,
  disabled = false,
  loading = false,
  interactive = true,
  glowEffect = false,
  tiltEffect = false,
  scaleOnHover = true,
  borderGlow = false,
  shadowIntensity = 'md',
  borderRadius = 'lg',
  background = 'solid',
  gradient,
  padding = 'md',
}) => {
  const { state: themeState } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { controls: hoverControls, handleHover, handleHoverEnd } = useHoverAnimation();
  const { controls: clickControls, handleClick } = useClickAnimation();

  // Handle mouse movement for tilt effect
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEffect || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;
    
    const rotateX = (mouseY / rect.height) * 10;
    const rotateY = (mouseX / rect.width) * -10;
    
    setMousePosition({ x: rotateY, y: rotateX });
  }, [tiltEffect, disabled]);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
    if (onHover) onHover(false);
    setIsHovered(false);
    if (hoverable) handleHoverEnd();
  }, [onHover, hoverable, handleHoverEnd]);

  const handleMouseEnter = useCallback(() => {
    if (onHover) onHover(true);
    setIsHovered(true);
    if (hoverable) handleHover();
  }, [onHover, hoverable, handleHover]);

  const handleCardClick = useCallback(() => {
    if (disabled || loading) return;
    
    if (clickable) {
      handleClick();
    }
    
    if (onClick) {
      onClick();
    }
  }, [disabled, loading, clickable, handleClick, onClick]);

  // Get variant styles
  const getVariantStyles = () => {
    const baseStyles = {
      backgroundColor: themeState.resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
      border: `1px solid ${themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        };
      case 'glass':
        return {
          backgroundColor: themeState.resolvedTheme === 'dark' 
            ? 'rgba(30, 41, 59, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${themeState.resolvedTheme === 'dark' 
            ? 'rgba(51, 65, 85, 0.3)' 
            : 'rgba(226, 232, 240, 0.3)'}`,
        };
      case 'bordered':
        return {
          ...baseStyles,
          border: `2px solid ${themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'}`,
        };
      default:
        return baseStyles;
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { minHeight: '120px' };
      case 'md': return { minHeight: '200px' };
      case 'lg': return { minHeight: '300px' };
      default: return { minHeight: '200px' };
    }
  };

  // Get padding styles
  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm': return { padding: '0.75rem' };
      case 'md': return { padding: '1rem' };
      case 'lg': return { padding: '1.5rem' };
      case 'xl': return { padding: '2rem' };
      case 'none': return { padding: '0' };
      default: return { padding: '1rem' };
    }
  };

  // Get border radius
  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'sm': return '0.375rem';
      case 'md': return '0.5rem';
      case 'lg': return '0.75rem';
      case 'xl': return '1rem';
      case 'full': return '9999px';
      default: return '0.75rem';
    }
  };

  // Get shadow styles
  const getShadowStyles = () => {
    if (variant === 'glass') return {};

    switch (shadowIntensity) {
      case 'sm': return { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' };
      case 'md': return { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' };
      case 'lg': return { boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' };
      case 'xl': return { boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)' };
      default: return { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' };
    }
  };

  // Get background styles
  const getBackgroundStyles = () => {
    switch (background) {
      case 'gradient':
        return {
          background: gradient || 'linear-gradient(135deg, #22c55e, #3b82f6)',
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {};
    }
  };

  // Combine all styles
  const cardStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...getPaddingStyles(),
    ...getShadowStyles(),
    ...getBackgroundStyles(),
    borderRadius: getBorderRadius(),
    cursor: (clickable || interactive) && !disabled ? 'pointer' : 'default',
    opacity: disabled ? 0.6 : 1,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    transition: 'all 0.3s ease',
    transform: tiltEffect 
      ? `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)` 
      : undefined,
  };

  // Hover effects
  const hoverEffects = {
    scale: scaleOnHover && hoverable ? 1.02 : 1,
    boxShadow: isHovered && hoverable 
      ? '0 20px 40px rgba(0, 0, 0, 0.15)' 
      : getShadowStyles().boxShadow,
    borderColor: borderGlow && isHovered 
      ? '#22c55e' 
      : themeState.resolvedTheme === 'dark' ? '#334155' : '#e2e8f0',
  };

  return (
    <motion.div
      className={`interactive-card ${className}`}
      style={cardStyles}
      animate={hoverable ? hoverControls : {}}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      whileHover={hoverable && !disabled ? hoverEffects : {}}
      whileTap={clickable && !disabled ? clickControls : {}}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300,
      }}
    >
      {/* Glow Effect */}
      {glowEffect && isHovered && (
        <motion.div
          className="card-glow"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
            borderRadius: getBorderRadius(),
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <motion.div
          className="card-loading"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: getBorderRadius(),
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="card-content" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
});

InteractiveCard.displayName = 'InteractiveCard';

export default InteractiveCard;
