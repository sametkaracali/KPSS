import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;
  private socket: Socket | null = null;

  constructor() {
    this.baseURL = API_URL;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('access_token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry original request
        return this.fetchWithAuth(url, options);
      } else {
        // Redirect to login
        window.location.href = '/auth/login';
        throw new Error('Unauthorized');
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json());

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return data;
  }

  async register(data: { name: string; email: string; password: string }) {
    return fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json());
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const data = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).then(res => res.json());

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        return true;
      }
    } catch {
      return false;
    }

    return false;
  }

  async getProfile() {
    return this.fetchWithAuth('/auth/profile');
  }

  // Questions
  async getQuestions(params?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.fetchWithAuth(`/questions?${queryParams}`);
  }

  async getQuestion(id: string) {
    return this.fetchWithAuth(`/questions/${id}`);
  }

  async submitAnswer(questionId: string, answerIndex: number) {
    return this.fetchWithAuth(`/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ answerIndex }),
    });
  }

  // Exams
  async getExams(params?: { type?: string; status?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    return this.fetchWithAuth(`/exams?${queryParams}`);
  }

  async getExam(id: string) {
    return this.fetchWithAuth(`/exams/${id}`);
  }

  async startExam(examId: string) {
    return this.fetchWithAuth(`/exams/${examId}/start`, {
      method: 'POST',
    });
  }

  async submitExam(sessionId: string, answers: any[]) {
    return this.fetchWithAuth(`/exams/sessions/${sessionId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async getExamResults(userId?: string) {
    const url = userId ? `/exams/results?userId=${userId}` : '/exams/results';
    return this.fetchWithAuth(url);
  }

  // Analytics
  async getPerformanceReport(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' = 'MONTHLY') {
    return this.fetchWithAuth(`/analytics/performance?period=${period}`);
  }

  async getLearningPath() {
    return this.fetchWithAuth('/ai/learning-path');
  }

  async getRecommendations() {
    return this.fetchWithAuth('/ai/recommendations');
  }

  // Payments
  async getSubscriptionPlans() {
    return this.fetchWithAuth('/payments/plans');
  }

  async createCheckout(planId: string) {
    return this.fetchWithAuth('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }

  async getUserSubscription() {
    return this.fetchWithAuth('/payments/subscription');
  }

  async cancelSubscription() {
    return this.fetchWithAuth('/payments/subscription/cancel', {
      method: 'POST',
    });
  }

  // Subjects & Topics
  async getSubjects() {
    return this.fetchWithAuth('/subjects');
  }

  async getTopics(subjectId?: string) {
    const url = subjectId ? `/topics?subjectId=${subjectId}` : '/topics';
    return this.fetchWithAuth(url);
  }

  // WebSocket
  connectSocket(token?: string) {
    const authToken = token || localStorage.getItem('access_token');
    
    if (!authToken) {
      console.warn('No auth token for WebSocket connection');
      return;
    }

    this.socket = io(`${this.baseURL}/notifications`, {
      auth: { token: authToken },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Admin APIs
  admin = {
    getDashboardStats: () => this.fetchWithAuth('/admin/dashboard/stats'),
    
    getUsers: (params: any) => {
      const queryParams = new URLSearchParams(params).toString();
      return this.fetchWithAuth(`/admin/users?${queryParams}`);
    },
    
    getUserDetails: (id: string) => this.fetchWithAuth(`/admin/users/${id}`),
    
    updateUser: (id: string, data: any) => this.fetchWithAuth(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    banUser: (id: string, reason: string, duration?: number) => 
      this.fetchWithAuth(`/admin/users/${id}/ban`, {
        method: 'POST',
        body: JSON.stringify({ reason, duration }),
      }),
    
    getQuestions: (params: any) => {
      const queryParams = new URLSearchParams(params).toString();
      return this.fetchWithAuth(`/admin/questions?${queryParams}`);
    },
    
    createQuestion: (data: any) => this.fetchWithAuth('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    updateQuestion: (id: string, data: any) => this.fetchWithAuth(`/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    deleteQuestion: (id: string) => this.fetchWithAuth(`/admin/questions/${id}`, {
      method: 'DELETE',
    }),
    
    getPayments: (params: any) => {
      const queryParams = new URLSearchParams(params).toString();
      return this.fetchWithAuth(`/admin/payments?${queryParams}`);
    },
  };
}

export const apiClient = new ApiClient();
export default apiClient;
