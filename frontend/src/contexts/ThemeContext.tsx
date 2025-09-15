import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { storage } from '@/utils';

// Theme types
export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

// Theme state interface
interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  isTransitioning: boolean;
}

// Theme actions interface
interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSystemTheme: (theme: ResolvedTheme) => void;
  setTransitioning: (transitioning: boolean) => void;
}

// Initial state
const initialState: ThemeState = {
  theme: 'auto',
  resolvedTheme: 'dark', // Default to dark
  systemTheme: 'dark',
  isTransitioning: false,
};

// Action types
type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_RESOLVED_THEME'; payload: ResolvedTheme }
  | { type: 'SET_SYSTEM_THEME'; payload: ResolvedTheme }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'TOGGLE_THEME' };

// Theme reducer
function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
        resolvedTheme: getResolvedTheme(action.payload, state.systemTheme),
      };
    
    case 'SET_RESOLVED_THEME':
      return {
        ...state,
        resolvedTheme: action.payload,
      };
    
    case 'SET_SYSTEM_THEME':
      return {
        ...state,
        systemTheme: action.payload,
        resolvedTheme: state.theme === 'auto' 
          ? action.payload 
          : getResolvedTheme(state.theme, action.payload),
      };
    
    case 'SET_TRANSITIONING':
      return {
        ...state,
        isTransitioning: action.payload,
      };
    
    case 'TOGGLE_THEME':
      const newTheme = state.resolvedTheme === 'light' ? 'dark' : 'light';
      return {
        ...state,
        theme: newTheme,
        resolvedTheme: newTheme,
      };
    
    default:
      return state;
  }
}

// Helper function to resolve theme
function getResolvedTheme(theme: Theme, systemTheme: ResolvedTheme): ResolvedTheme {
  if (theme === 'auto') {
    return systemTheme;
  }
  return theme;
}

// Create contexts
const ThemeStateContext = createContext<ThemeState | undefined>(undefined);
const ThemeActionsContext = createContext<ThemeActions | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const initializeTheme = () => {
      // Get saved theme from localStorage
      const savedTheme = storage.get<Theme>('theme', 'auto');
      
      // Get system theme preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      
      // Update state
      dispatch({ type: 'SET_SYSTEM_THEME', payload: systemTheme });
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    };

    initializeTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      dispatch({ type: 'SET_SYSTEM_THEME', payload: systemTheme });
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const { resolvedTheme } = state;
      
      // Add transition class for smooth theme changes
      document.documentElement.classList.add('theme-transition');
      
      // Apply theme class to document
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      document.documentElement.classList.toggle('dark-theme', resolvedTheme === 'dark');
      document.documentElement.classList.toggle('light-theme', resolvedTheme === 'light');
      
      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0f172a' : '#ffffff');
      }
      
      // Remove transition class after transition
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 300);
    };

    applyTheme();
  }, [state.resolvedTheme]);

  // Set theme action
  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    storage.set('theme', theme);
  }, []);

  // Toggle theme action
  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
    const newTheme = state.resolvedTheme === 'light' ? 'dark' : 'light';
    storage.set('theme', newTheme);
  }, [state.resolvedTheme]);

  // Set system theme action
  const setSystemTheme = useCallback((theme: ResolvedTheme) => {
    dispatch({ type: 'SET_SYSTEM_THEME', payload: theme });
  }, []);

  // Set transitioning action
  const setTransitioning = useCallback((transitioning: boolean) => {
    dispatch({ type: 'SET_TRANSITIONING', payload: transitioning });
  }, []);

  // Actions object
  const actions: ThemeActions = {
    setTheme,
    toggleTheme,
    setSystemTheme,
    setTransitioning,
  };

  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeActionsContext.Provider value={actions}>
        {children}
      </ThemeActionsContext.Provider>
    </ThemeStateContext.Provider>
  );
};

// Hooks
export const useThemeState = (): ThemeState => {
  const context = useContext(ThemeStateContext);
  if (context === undefined) {
    throw new Error('useThemeState must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeActions = (): ThemeActions => {
  const context = useContext(ThemeActionsContext);
  if (context === undefined) {
    throw new Error('useThemeActions must be used within a ThemeProvider');
  }
  return context;
};

export const useTheme = (): { state: ThemeState; actions: ThemeActions } => {
  return {
    state: useThemeState(),
    actions: useThemeActions(),
  };
};

// Utility hooks
export const useCurrentTheme = (): ResolvedTheme => {
  const { resolvedTheme } = useThemeState();
  return resolvedTheme;
};

export const useIsDarkMode = (): boolean => {
  const { resolvedTheme } = useThemeState();
  return resolvedTheme === 'dark';
};

export const useIsLightMode = (): boolean => {
  const { resolvedTheme } = useThemeState();
  return resolvedTheme === 'light';
};

// Hook for theme-aware styling
export const useThemeStyles = () => {
  const { resolvedTheme } = useThemeState();
  
  return {
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    theme: resolvedTheme,
    colors: {
      primary: resolvedTheme === 'dark' ? '#22c55e' : '#16a34a',
      secondary: resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb',
      background: resolvedTheme === 'dark' ? '#0f172a' : '#ffffff',
      surface: resolvedTheme === 'dark' ? '#1e293b' : '#f8fafc',
      text: resolvedTheme === 'dark' ? '#f1f5f9' : '#1e293b',
      textSecondary: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b',
    },
  };
};

export default ThemeProvider;
