import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { createBaseReducer, BaseState, BaseActions, useAsyncAction } from './BaseContext';
import { apiService } from '@/services/apiService';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '@/types';

// Project state interface
interface ProjectState extends BaseState {
  projects: Project[];
  selectedProject: Project | null;
  filteredProjects: Project[];
  searchQuery: string;
  sortBy: 'title' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  filterBy: string[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

// Project actions interface
interface ProjectActions extends BaseActions {
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: number) => Promise<void>;
  createProject: (project: CreateProjectRequest) => Promise<Project | null>;
  updateProject: (id: number, project: UpdateProjectRequest) => Promise<Project | null>;
  deleteProject: (id: number) => Promise<boolean>;
  setSelectedProject: (project: Project | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'title' | 'createdAt' | 'updatedAt') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setFilterBy: (filters: string[]) => void;
  setPagination: (pagination: Partial<ProjectState['pagination']>) => void;
  clearFilters: () => void;
}

// Initial state
const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  filteredProjects: [],
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  filterBy: [],
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

// Action types
type ProjectAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: number }
  | { type: 'SET_SELECTED_PROJECT'; payload: Project | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SORT_BY'; payload: 'title' | 'createdAt' | 'updatedAt' }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' }
  | { type: 'SET_FILTER_BY'; payload: string[] }
  | { type: 'SET_PAGINATION'; payload: Partial<ProjectState['pagination']> }
  | { type: 'SET_FILTERED_PROJECTS'; payload: Project[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET' };

// Project reducer
function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
        pagination: {
          ...state.pagination,
          totalItems: action.payload.length,
          totalPages: Math.ceil(action.payload.length / state.pagination.itemsPerPage),
        },
        lastUpdated: Date.now(),
      };
    
    case 'ADD_PROJECT':
      const newProjects = [...state.projects, action.payload];
      return {
        ...state,
        projects: newProjects,
        pagination: {
          ...state.pagination,
          totalItems: newProjects.length,
          totalPages: Math.ceil(newProjects.length / state.pagination.itemsPerPage),
        },
        lastUpdated: Date.now(),
      };
    
    case 'UPDATE_PROJECT':
      const updatedProjects = state.projects.map(project =>
        project.id === action.payload.id ? action.payload : project
      );
      return {
        ...state,
        projects: updatedProjects,
        selectedProject: state.selectedProject?.id === action.payload.id ? action.payload : state.selectedProject,
        lastUpdated: Date.now(),
      };
    
    case 'REMOVE_PROJECT':
      const filteredProjects = state.projects.filter(project => project.id !== action.payload);
      return {
        ...state,
        projects: filteredProjects,
        selectedProject: state.selectedProject?.id === action.payload ? null : state.selectedProject,
        pagination: {
          ...state.pagination,
          totalItems: filteredProjects.length,
          totalPages: Math.ceil(filteredProjects.length / state.pagination.itemsPerPage),
        },
        lastUpdated: Date.now(),
      };
    
    case 'SET_SELECTED_PROJECT':
      return {
        ...state,
        selectedProject: action.payload,
      };
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    
    case 'SET_SORT_BY':
      return {
        ...state,
        sortBy: action.payload,
      };
    
    case 'SET_SORT_ORDER':
      return {
        ...state,
        sortOrder: action.payload,
      };
    
    case 'SET_FILTER_BY':
      return {
        ...state,
        filterBy: action.payload,
      };
    
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    
    case 'SET_FILTERED_PROJECTS':
      return {
        ...state,
        filteredProjects: action.payload,
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
const ProjectStateContext = createContext<ProjectState | undefined>(undefined);
const ProjectActionsContext = createContext<ProjectActions | undefined>(undefined);

// Project provider component
export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Apply filters and sorting whenever projects, search, or filters change
  useEffect(() => {
    const applyFiltersAndSort = () => {
      let filtered = [...state.projects];

      // Apply search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(project =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some(tech => tech.toLowerCase().includes(query))
        );
      }

      // Apply technology filter
      if (state.filterBy.length > 0) {
        filtered = filtered.filter(project =>
          state.filterBy.every(filter => project.technologies.includes(filter))
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (state.sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'updatedAt':
            aValue = new Date(a.updatedAt).getTime();
            bValue = new Date(b.updatedAt).getTime();
            break;
          default:
            return 0;
        }

        if (state.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
      const endIndex = startIndex + state.pagination.itemsPerPage;
      const paginatedProjects = filtered.slice(startIndex, endIndex);

      dispatch({ type: 'SET_FILTERED_PROJECTS', payload: paginatedProjects });
    };

    applyFiltersAndSort();
  }, [state.projects, state.searchQuery, state.filterBy, state.sortBy, state.sortOrder, state.pagination.currentPage, state.pagination.itemsPerPage]);

  // Fetch projects action
  const fetchProjects = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const projects = await apiService.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  // Fetch project by ID action
  const fetchProjectById = useCallback(async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const project = await apiService.getProjectById(id);
      dispatch({ type: 'SET_SELECTED_PROJECT', payload: project });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, []);

  // Create project action
  const createProject = useCallback(async (projectData: CreateProjectRequest): Promise<Project | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const newProject = await apiService.createProject(projectData);
      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      return newProject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    }
  }, []);

  // Update project action
  const updateProject = useCallback(async (id: number, projectData: UpdateProjectRequest): Promise<Project | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const updatedProject = await apiService.updateProject(id, projectData);
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
      return updatedProject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return null;
    }
  }, []);

  // Delete project action
  const deleteProject = useCallback(async (id: number): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      await apiService.deleteProject(id);
      dispatch({ type: 'REMOVE_PROJECT', payload: id });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    }
  }, []);

  // Set selected project action
  const setSelectedProject = useCallback((project: Project | null) => {
    dispatch({ type: 'SET_SELECTED_PROJECT', payload: project });
  }, []);

  // Set search query action
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  // Set sort by action
  const setSortBy = useCallback((sortBy: 'title' | 'createdAt' | 'updatedAt') => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  }, []);

  // Set sort order action
  const setSortOrder = useCallback((order: 'asc' | 'desc') => {
    dispatch({ type: 'SET_SORT_ORDER', payload: order });
  }, []);

  // Set filter by action
  const setFilterBy = useCallback((filters: string[]) => {
    dispatch({ type: 'SET_FILTER_BY', payload: filters });
  }, []);

  // Set pagination action
  const setPagination = useCallback((pagination: Partial<ProjectState['pagination']>) => {
    dispatch({ type: 'SET_PAGINATION', payload: pagination });
  }, []);

  // Clear filters action
  const clearFilters = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    dispatch({ type: 'SET_FILTER_BY', payload: [] });
    dispatch({ type: 'SET_SORT_BY', payload: 'createdAt' });
    dispatch({ type: 'SET_SORT_ORDER', payload: 'desc' });
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
  const actions: ProjectActions = {
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    setSelectedProject,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setFilterBy,
    setPagination,
    clearFilters,
    setLoading,
    setError,
    clearError,
    reset,
  };

  return (
    <ProjectStateContext.Provider value={state}>
      <ProjectActionsContext.Provider value={actions}>
        {children}
      </ProjectActionsContext.Provider>
    </ProjectStateContext.Provider>
  );
};

// Hooks
export const useProjectState = (): ProjectState => {
  const context = useContext(ProjectStateContext);
  if (context === undefined) {
    throw new Error('useProjectState must be used within a ProjectProvider');
  }
  return context;
};

export const useProjectActions = (): ProjectActions => {
  const context = useContext(ProjectActionsContext);
  if (context === undefined) {
    throw new Error('useProjectActions must be used within a ProjectProvider');
  }
  return context;
};

export const useProject = (): { state: ProjectState; actions: ProjectActions } => {
  return {
    state: useProjectState(),
    actions: useProjectActions(),
  };
};

// Utility hooks
export const useProjects = (): Project[] => {
  const { projects } = useProjectState();
  return projects;
};

export const useFilteredProjects = (): Project[] => {
  const { filteredProjects } = useProjectState();
  return filteredProjects;
};

export const useSelectedProject = (): Project | null => {
  const { selectedProject } = useProjectState();
  return selectedProject;
};

export const useProjectFilters = () => {
  const { searchQuery, sortBy, sortOrder, filterBy, pagination } = useProjectState();
  const { setSearchQuery, setSortBy, setSortOrder, setFilterBy, setPagination, clearFilters } = useProjectActions();

  return {
    searchQuery,
    sortBy,
    sortOrder,
    filterBy,
    pagination,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setFilterBy,
    setPagination,
    clearFilters,
  };
};

export default ProjectProvider;
