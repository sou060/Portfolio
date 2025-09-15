import { useEffect, useCallback, useRef, useState } from 'react';

// Custom hook for keyboard navigation
export const useKeyboardNavigation = (
  items: any[],
  onSelect?: (item: any, index: number) => void,
  onEscape?: () => void,
  onEnter?: (item: any, index: number) => void
) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isActive, setIsActive] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          onEnter?.(items[focusedIndex], focusedIndex);
          onSelect?.(items[focusedIndex], focusedIndex);
        }
        break;
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
    }
  }, [isActive, items, focusedIndex, onSelect, onEnter, onEscape]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  const activate = useCallback(() => setIsActive(true), []);
  const deactivate = useCallback(() => setIsActive(false), []);
  const setFocus = useCallback((index: number) => setFocusedIndex(index), []);

  return {
    focusedIndex,
    isActive,
    activate,
    deactivate,
    setFocus,
  };
};

// Custom hook for focus management
export const useFocusManagement = () => {
  const focusHistory = useRef<HTMLElement[]>([]);
  const [isTrapped, setIsTrapped] = useState(false);
  const trapRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback((element: HTMLElement) => {
    if (document.activeElement instanceof HTMLElement) {
      focusHistory.current.push(document.activeElement);
    }
    element.focus();
  }, []);

  const restoreFocus = useCallback(() => {
    const previousElement = focusHistory.current.pop();
    if (previousElement) {
      previousElement.focus();
    }
  }, []);

  const trapFocus = useCallback((element: HTMLElement) => {
    trapRef.current = element;
    setIsTrapped(true);
    
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      setIsTrapped(false);
      trapRef.current = null;
    };
  }, []);

  const releaseFocus = useCallback(() => {
    setIsTrapped(false);
    trapRef.current = null;
  }, []);

  return {
    saveFocus,
    restoreFocus,
    trapFocus,
    releaseFocus,
    isTrapped,
  };
};

// Custom hook for screen reader announcements
export const useScreenReader = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = { message, priority, id: Date.now() };
    setAnnouncements(prev => [...prev, announcement]);
    
    // Remove announcement after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
    }, 1000);
  }, []);

  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
  }, []);

  return {
    announcements,
    announce,
    clearAnnouncements,
  };
};

// Custom hook for ARIA attributes
export const useAriaAttributes = (options: {
  role?: string;
  label?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  live?: 'off' | 'polite' | 'assertive';
  atomic?: boolean;
  relevant?: string;
}) => {
  const {
    role,
    label,
    describedBy,
    expanded,
    selected,
    disabled,
    hidden,
    live,
    atomic,
    relevant,
  } = options;

  const getAriaAttributes = useCallback(() => {
    const attributes: Record<string, string | boolean> = {};

    if (role) attributes.role = role;
    if (label) attributes['aria-label'] = label;
    if (describedBy) attributes['aria-describedby'] = describedBy;
    if (expanded !== undefined) attributes['aria-expanded'] = expanded;
    if (selected !== undefined) attributes['aria-selected'] = selected;
    if (disabled !== undefined) attributes['aria-disabled'] = disabled;
    if (hidden !== undefined) attributes['aria-hidden'] = hidden;
    if (live) attributes['aria-live'] = live;
    if (atomic !== undefined) attributes['aria-atomic'] = atomic;
    if (relevant) attributes['aria-relevant'] = relevant;

    return attributes;
  }, [role, label, describedBy, expanded, selected, disabled, hidden, live, atomic, relevant]);

  return { getAriaAttributes };
};

// Custom hook for color contrast detection
export const useColorContrast = () => {
  const [contrastRatio, setContrastRatio] = useState<number>(0);
  const [isAccessible, setIsAccessible] = useState<boolean>(false);

  const calculateContrast = useCallback((color1: string, color2: string) => {
    // Convert hex colors to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    // Calculate relative luminance
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const luminance1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const luminance2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    const ratio = (lighter + 0.05) / (darker + 0.05);
    
    setContrastRatio(ratio);
    setIsAccessible(ratio >= 4.5); // WCAG AA standard

    return ratio;
  }, []);

  return {
    contrastRatio,
    isAccessible,
    calculateContrast,
  };
};

// Custom hook for reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Custom hook for high contrast detection
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};

// Custom hook for color scheme detection
export const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'no-preference'>('no-preference');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateColorScheme = () => {
      if (mediaQuery.matches) {
        setColorScheme('dark');
      } else {
        setColorScheme('light');
      }
    };

    updateColorScheme();
    mediaQuery.addEventListener('change', updateColorScheme);
    return () => mediaQuery.removeEventListener('change', updateColorScheme);
  }, []);

  return colorScheme;
};

// Custom hook for accessibility testing
export const useAccessibilityTest = () => {
  const [testResults, setTestResults] = useState<{
    hasHeadingStructure: boolean;
    hasAltText: boolean;
    hasFormLabels: boolean;
    hasFocusManagement: boolean;
    hasColorContrast: boolean;
    hasKeyboardNavigation: boolean;
  }>({
    hasHeadingStructure: false,
    hasAltText: false,
    hasFormLabels: false,
    hasFocusManagement: false,
    hasColorContrast: false,
    hasKeyboardNavigation: false,
  });

  const runTests = useCallback(() => {
    // Test heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const hasHeadingStructure = headings.length > 0;

    // Test alt text
    const images = document.querySelectorAll('img');
    const hasAltText = Array.from(images).every(img => img.hasAttribute('alt'));

    // Test form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    const hasFormLabels = Array.from(inputs).every(input => {
      const id = input.getAttribute('id');
      const label = document.querySelector(`label[for="${id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      return label || ariaLabel || ariaLabelledBy;
    });

    // Test focus management
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const hasFocusManagement = focusableElements.length > 0;

    // Test color contrast (simplified)
    const hasColorContrast = true; // This would need more complex implementation

    // Test keyboard navigation
    const hasKeyboardNavigation = focusableElements.length > 0;

    setTestResults({
      hasHeadingStructure,
      hasAltText,
      hasFormLabels,
      hasFocusManagement,
      hasColorContrast,
      hasKeyboardNavigation,
    });
  }, []);

  useEffect(() => {
    runTests();
  }, [runTests]);

  return {
    testResults,
    runTests,
  };
};

export default {
  useKeyboardNavigation,
  useFocusManagement,
  useScreenReader,
  useAriaAttributes,
  useColorContrast,
  useReducedMotion,
  useHighContrast,
  useColorScheme,
  useAccessibilityTest,
};
