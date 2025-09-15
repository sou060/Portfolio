// Export all contexts and providers
export { default as AuthProvider, useAuth, useAuthState, useAuthActions, useIsAuthenticated, useCurrentUser, useHasPermission, useRequireAuth } from './AuthContext';
export { default as ThemeProvider, useTheme, useThemeState, useThemeActions, useCurrentTheme, useIsDarkMode, useIsLightMode, useThemeStyles } from './ThemeContext';
export { default as ProjectProvider, useProject, useProjectState, useProjectActions, useProjects, useFilteredProjects, useSelectedProject, useProjectFilters } from './ProjectContext';
export { default as NotificationProvider, useNotification, useNotificationState, useNotificationActions, useNotifications, useNotify } from './NotificationContext';
export { default as ErrorBoundaryProvider, useError } from '../components/ErrorBoundaryProvider';

// Re-export base context utilities
export { createBaseReducer, createContextProvider, useAsyncAction, useFormState } from './BaseContext';
export type { BaseState, BaseActions, BaseAction } from './BaseContext';

// Combined provider component
import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { ProjectProvider } from './ProjectContext';
import { NotificationProvider } from './NotificationContext';
import { ErrorBoundaryProvider } from '../components/ErrorBoundaryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundaryProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <ProjectProvider>
              {children}
            </ProjectProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundaryProvider>
  );
};

export default AppProviders;
