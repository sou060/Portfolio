import React, { memo } from 'react';
import { Button } from 'react-bootstrap';
import { useTheme } from '@/contexts';

interface ThemeToggleProps {
  variant?: 'button' | 'switch' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = memo(({
  variant = 'button',
  size = 'md',
  className = '',
  showLabel = true,
}) => {
  const { state, actions } = useTheme();
  const { theme, resolvedTheme } = state;
  const { toggleTheme } = actions;

  const getIcon = () => {
    if (theme === 'auto') {
      return 'bi-circle-half';
    }
    return resolvedTheme === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill';
  };

  const getLabel = () => {
    if (theme === 'auto') {
      return 'Auto';
    }
    return resolvedTheme === 'dark' ? 'Dark' : 'Light';
  };

  const getNextTheme = () => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'auto';
    return 'light';
  };

  if (variant === 'icon') {
    return (
      <Button
        variant="outline-secondary"
        size={size}
        className={`theme-toggle-icon ${className}`}
        onClick={toggleTheme}
        title={`Switch to ${getNextTheme()} theme`}
      >
        <i className={`bi ${getIcon()}`}></i>
      </Button>
    );
  }

  if (variant === 'switch') {
    return (
      <div className={`theme-toggle-switch ${className}`}>
        <Button
          variant={resolvedTheme === 'dark' ? 'dark' : 'light'}
          size={size}
          className="d-flex align-items-center gap-2"
          onClick={toggleTheme}
        >
          <i className={`bi ${getIcon()}`}></i>
          {showLabel && <span>{getLabel()}</span>}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline-secondary"
      size={size}
      className={`theme-toggle-button d-flex align-items-center gap-2 ${className}`}
      onClick={toggleTheme}
    >
      <i className={`bi ${getIcon()}`}></i>
      {showLabel && <span>{getLabel()}</span>}
    </Button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
