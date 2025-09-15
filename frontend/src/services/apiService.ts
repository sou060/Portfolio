import api from '@/api/axios';
import type { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest,
  ContactMessage,
  ContactRequest,
  LoginRequest,
  LoginResponse,
  AnalyticsSummary,
  ApiResponse 
} from '@/types';
import { getErrorMessage } from '@/utils';

// API Service class with comprehensive error handling
class ApiService {
  private async handleRequest<T>(request: () => Promise<T>): Promise<T> {
    try {
      return await request();
    } catch (error) {
      const message = getErrorMessage(error);
      throw new Error(message);
    }
  }

  // Project API endpoints
  async getProjects(): Promise<Project[]> {
    return this.handleRequest(async () => {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    });
  }

  async getProjectById(id: number): Promise<Project> {
    return this.handleRequest(async () => {
      const response = await api.get<Project>(`/projects/${id}`);
      return response.data;
    });
  }

  async createProject(project: CreateProjectRequest): Promise<Project> {
    return this.handleRequest(async () => {
      const response = await api.post<Project>('/projects', project);
      return response.data;
    });
  }

  async updateProject(id: number, project: UpdateProjectRequest): Promise<Project> {
    return this.handleRequest(async () => {
      const response = await api.put<Project>(`/projects/${id}`, project);
      return response.data;
    });
  }

  async deleteProject(id: number): Promise<void> {
    return this.handleRequest(async () => {
      await api.delete(`/projects/${id}`);
    });
  }

  async getProjectCount(): Promise<number> {
    return this.handleRequest(async () => {
      const response = await api.get<{ count: number }>('/projects/count');
      return response.data.count;
    });
  }

  // Contact API endpoints
  async sendContactMessage(message: ContactRequest): Promise<ContactMessage> {
    return this.handleRequest(async () => {
      const response = await api.post<ContactMessage>('/contact', message);
      return response.data;
    });
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return this.handleRequest(async () => {
      const response = await api.get<ContactMessage[]>('/admin/contact');
      return response.data;
    });
  }

  async updateMessageStatus(id: number, status: 'READ' | 'REPLIED'): Promise<ContactMessage> {
    return this.handleRequest(async () => {
      const response = await api.put<ContactMessage>(`/admin/contact/${id}/status`, { status });
      return response.data;
    });
  }

  // Authentication API endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.handleRequest(async () => {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    });
  }

  async logout(): Promise<void> {
    return this.handleRequest(async () => {
      localStorage.removeItem('authToken');
      // Optionally call logout endpoint if it exists
      // await api.post('/auth/logout');
    });
  }

  // Analytics API endpoints
  async getAnalytics(): Promise<AnalyticsSummary> {
    return this.handleRequest(async () => {
      const response = await api.get<AnalyticsSummary>('/admin/analytics');
      return response.data;
    });
  }

  // Resume API endpoints
  async downloadResume(): Promise<Blob> {
    return this.handleRequest(async () => {
      const response = await api.get('/resume/download', {
        responseType: 'blob',
      });
      return response.data;
    });
  }

  async uploadResume(file: File): Promise<void> {
    return this.handleRequest(async () => {
      const formData = new FormData();
      formData.append('file', file);
      
      await api.post('/admin/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.handleRequest(async () => {
      const response = await api.get<{ status: string }>('/actuator/health');
      return response.data;
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearAuth(): void {
    localStorage.removeItem('authToken');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
