import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: number;
}

// Notification state interface
interface NotificationState {
  notifications: Notification[];
  settings: {
    position: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
    duration: number;
    maxNotifications: number;
    enableSounds: boolean;
  };
}

// Notification actions interface
interface NotificationActions {
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  showSuccess: (title: string, message?: string, options?: Partial<Notification>) => string;
  showError: (title: string, message?: string, options?: Partial<Notification>) => string;
  showWarning: (title: string, message?: string, options?: Partial<Notification>) => string;
  showInfo: (title: string, message?: string, options?: Partial<Notification>) => string;
  dismissNotification: (id: string) => void;
  dismissAll: () => void;
  updateSettings: (settings: Partial<NotificationState['settings']>) => void;
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  settings: {
    position: 'top-right',
    duration: 4000,
    maxNotifications: 5,
    enableSounds: true,
  },
};

// Action types
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<NotificationState['settings']> };

// Notification reducer
function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      // Keep only the most recent notifications
      const limitedNotifications = newNotifications.slice(0, state.settings.maxNotifications);
      return {
        ...state,
        notifications: limitedNotifications,
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };
    
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    
    default:
      return state;
  }
}

// Create contexts
const NotificationStateContext = createContext<NotificationState | undefined>(undefined);
const NotificationActionsContext = createContext<NotificationActions | undefined>(undefined);

// Notification provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Generate unique ID
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Show notification action
  const showNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>): string => {
    const id = generateId();
    const fullNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? state.settings.duration,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification });

    // Show toast notification
    const toastOptions = {
      duration: fullNotification.duration,
      position: state.settings.position,
      id,
      style: {
        background: getNotificationColor(fullNotification.type),
        color: '#ffffff',
        border: `1px solid ${getNotificationBorderColor(fullNotification.type)}`,
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      },
    };

    if (fullNotification.action) {
      toast.custom((t) => (
        <div className="notification-toast">
          <div className="notification-content">
            <div className="notification-title">{fullNotification.title}</div>
            {fullNotification.message && (
              <div className="notification-message">{fullNotification.message}</div>
            )}
            <button
              className="notification-action"
              onClick={() => {
                fullNotification.action?.onClick();
                toast.dismiss(t.id);
              }}
            >
              {fullNotification.action.label}
            </button>
          </div>
          <button
            className="notification-dismiss"
            onClick={() => toast.dismiss(t.id)}
          >
            ×
          </button>
        </div>
      ), toastOptions);
    } else {
      toast[fullNotification.type](fullNotification.message || fullNotification.title, toastOptions);
    }

    // Auto-dismiss after duration
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, fullNotification.duration);

    return id;
  }, [generateId, state.settings.duration, state.settings.position]);

  // Show success notification
  const showSuccess = useCallback((title: string, message?: string, options?: Partial<Notification>): string => {
    return showNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  // Show error notification
  const showError = useCallback((title: string, message?: string, options?: Partial<Notification>): string => {
    return showNotification({
      type: 'error',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  // Show warning notification
  const showWarning = useCallback((title: string, message?: string, options?: Partial<Notification>): string => {
    return showNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  // Show info notification
  const showInfo = useCallback((title: string, message?: string, options?: Partial<Notification>): string => {
    return showNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  // Dismiss notification action
  const dismissNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    toast.dismiss(id);
  }, []);

  // Dismiss all notifications action
  const dismissAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    toast.dismiss();
  }, []);

  // Update settings action
  const updateSettings = useCallback((settings: Partial<NotificationState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  // Actions object
  const actions: NotificationActions = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissNotification,
    dismissAll,
    updateSettings,
  };

  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationActionsContext.Provider value={actions}>
        {children}
      </NotificationActionsContext.Provider>
    </NotificationStateContext.Provider>
  );
};

// Helper functions for notification colors
function getNotificationColor(type: NotificationType): string {
  switch (type) {
    case 'success':
      return '#22c55e';
    case 'error':
      return '#ef4444';
    case 'warning':
      return '#f59e0b';
    case 'info':
      return '#3b82f6';
    default:
      return '#6b7280';
  }
}

function getNotificationBorderColor(type: NotificationType): string {
  switch (type) {
    case 'success':
      return '#16a34a';
    case 'error':
      return '#dc2626';
    case 'warning':
      return '#d97706';
    case 'info':
      return '#2563eb';
    default:
      return '#4b5563';
  }
}

// Hooks
export const useNotificationState = (): NotificationState => {
  const context = useContext(NotificationStateContext);
  if (context === undefined) {
    throw new Error('useNotificationState must be used within a NotificationProvider');
  }
  return context;
};

export const useNotificationActions = (): NotificationActions => {
  const context = useContext(NotificationActionsContext);
  if (context === undefined) {
    throw new Error('useNotificationActions must be used within a NotificationProvider');
  }
  return context;
};

export const useNotification = (): { state: NotificationState; actions: NotificationActions } => {
  return {
    state: useNotificationState(),
    actions: useNotificationActions(),
  };
};

// Utility hooks
export const useNotifications = (): Notification[] => {
  const { notifications } = useNotificationState();
  return notifications;
};

export const useNotify = (): NotificationActions => {
  const { actions } = useNotification();
  return actions;
};

export default NotificationProvider;
