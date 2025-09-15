import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { createBaseReducer, BaseState, BaseActions, useAsyncAction } from './BaseContext';
import { apiService } from '@/services/apiService';
import type { User, LoginRequest, LoginResponse } from '@/types';

// Auth state interface
interface AuthState extends BaseState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: string[];
}

// Auth actions interface
interface AuthActions extends BaseActions {
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateUser: (user: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  permissions: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; permissions: string[] } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET' };

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        permissions: action.payload.permissions,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        permissions: [],
        loading: false,
        error: action.payload,
        lastUpdated: Date.now(),
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        permissions: [],
        error: null,
        lastUpdated: Date.now(),
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
        lastUpdated: Date.now(),
      };
    
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
        isAuthenticated: !!action.payload,
        lastUpdated: Date.now(),
      };
    
    case 'CLEAR_AUTH':
      return {
        ...initialState,
        lastUpdated: Date.now(),
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

// Create contexts
const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthActionsContext = createContext<AuthActions | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        dispatch({ type: 'SET_TOKEN', payload: token });
        await checkAuth();
      }
    };

    initializeAuth();
  }, []);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        dispatch({ type: 'CLEAR_AUTH' });
        return;
      }

      // In a real app, you would validate the token with the server
      // For now, we'll just check if it exists
      dispatch({ type: 'SET_TOKEN', payload: token });
      
      // You could also fetch user data here
      // const userData = await apiService.getCurrentUser();
      // dispatch({ type: 'LOGIN_SUCCESS', payload: { user: userData, token, permissions: [] } });
    } catch (error) {
      dispatch({ type: 'CLEAR_AUTH' });
      localStorage.removeItem('authToken');
    }
  }, []);

  // Login action
  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await apiService.login(credentials);
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.token);

      // Create user object (you might get this from the login response)
      const user: User = {
        id: 1,
        username: credentials.username,
        roles: ['admin'],
      };

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          token: response.token,
          permissions: ['read', 'write', 'admin'], // You might get this from the API
        },
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return false;
    }
  }, []);

  // Logout action
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    apiService.clearAuth();
    dispatch({ type: 'LOGOUT' });
  }, []);

  // Refresh token action
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        dispatch({ type: 'CLEAR_AUTH' });
        return false;
      }

      // In a real app, you would refresh the token with the server
      // For now, we'll just return true if token exists
      dispatch({ type: 'SET_TOKEN', payload: token });
      return true;
    } catch (error) {
      dispatch({ type: 'CLEAR_AUTH' });
      localStorage.removeItem('authToken');
      return false;
    }
  }, []);

  // Update user action
  const updateUser = useCallback((userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, []);

  // Base actions
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Actions object
  const actions: AuthActions = {
    login,
    logout,
    refreshToken,
    updateUser,
    checkAuth,
    setLoading,
    setError,
    clearError,
    reset,
  };

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

// Hooks
export const useAuthState = (): AuthState => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

export const useAuthActions = (): AuthActions => {
  const context = useContext(AuthActionsContext);
  if (context === undefined) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  return context;
};

export const useAuth = (): { state: AuthState; actions: AuthActions } => {
  return {
    state: useAuthState(),
    actions: useAuthActions(),
  };
};

// Utility hooks
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuthState();
  return isAuthenticated;
};

export const useCurrentUser = (): User | null => {
  const { user } = useAuthState();
  return user;
};

export const useHasPermission = (permission: string): boolean => {
  const { permissions } = useAuthState();
  return permissions.includes(permission);
};

export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, loading } = useAuthState();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // In a real app, you would redirect to login
      console.log('Authentication required. Redirect to:', redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo]);

  return { isAuthenticated, loading };
};

export default AuthProvider;
