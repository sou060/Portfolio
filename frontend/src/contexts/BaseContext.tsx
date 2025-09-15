import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

// Generic state management utilities
export interface BaseState {
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface BaseActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// Base reducer for common state patterns
export function createBaseReducer<T extends BaseState>(
  initialState: T
): (state: T, action: BaseAction) => T {
  return (state: T, action: BaseAction): T => {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload, loading: false };
      case 'CLEAR_ERROR':
        return { ...state, error: null };
      case 'RESET':
        return { ...initialState };
      case 'UPDATE_LAST_UPDATED':
        return { ...state, lastUpdated: Date.now() };
      default:
        return state;
    }
  };
}

// Base action types
export interface BaseAction {
  type: 'SET_LOADING' | 'SET_ERROR' | 'CLEAR_ERROR' | 'RESET' | 'UPDATE_LAST_UPDATED';
  payload?: any;
}

// Generic context provider factory
export function createContextProvider<T, A>(
  reducer: (state: T, action: any) => T,
  initialState: T,
  actionsFactory: (dispatch: React.Dispatch<any>) => A,
  contextName: string
) {
  const StateContext = createContext<T | undefined>(undefined);
  const DispatchContext = createContext<A | undefined>(undefined);

  const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const actions = actionsFactory(dispatch);

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={actions}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  };

  const useContextState = (): T => {
    const context = useContext(StateContext);
    if (context === undefined) {
      throw new Error(`use${contextName}State must be used within a ${contextName}Provider`);
    }
    return context;
  };

  const useContextActions = (): A => {
    const context = useContext(DispatchContext);
    if (context === undefined) {
      throw new Error(`use${contextName}Actions must be used within a ${contextName}Provider`);
    }
    return context;
  };

  const useContext = (): { state: T; actions: A } => {
    return {
      state: useContextState(),
      actions: useContextActions(),
    };
  };

  return {
    Provider,
    useContextState,
    useContextActions,
    useContext,
  };
}

// Utility hook for async actions
export function useAsyncAction<T extends BaseState, A extends BaseActions>(
  state: T,
  actions: A
) {
  const executeAsync = useCallback(async <R>(
    asyncFn: () => Promise<R>,
    options: {
      onSuccess?: (result: R) => void;
      onError?: (error: Error) => void;
      showLoading?: boolean;
    } = {}
  ): Promise<R | null> => {
    const { onSuccess, onError, showLoading = true } = options;

    try {
      if (showLoading) {
        actions.setLoading(true);
      }
      actions.clearError();

      const result = await asyncFn();
      
      if (showLoading) {
        actions.setLoading(false);
      }

      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      actions.setError(errorMessage);
      actions.setLoading(false);
      
      onError?.(error as Error);
      return null;
    }
  }, [actions]);

  return { executeAsync };
}

// Hook for managing form state
export function useFormState<T extends Record<string, any>>(
  initialState: T
): {
  formData: T;
  setFormData: (data: Partial<T>) => void;
  updateField: (field: keyof T, value: any) => void;
  resetForm: () => void;
  hasChanges: boolean;
} {
  const [formData, setFormData] = React.useState<T>(initialState);
  const [originalData] = React.useState<T>(initialState);

  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(originalData);
  }, [originalData]);

  const hasChanges = React.useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  return {
    formData,
    setFormData: updateFormData,
    updateField,
    resetForm,
    hasChanges,
  };
}

export default createContextProvider;
