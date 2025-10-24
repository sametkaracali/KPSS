const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'TEACHER';
}

interface LoginData {
  email: string;
  password: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData) {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (typeof window !== 'undefined' && response.token) {
      localStorage.setItem('token', response.token);
    }

    return response;
  }

  async getProfile() {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Questions endpoints
  async getQuestions(params?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/questions${queryString}`, {
      method: 'GET',
    });
  }

  async getQuestion(id: string) {
    return this.request(`/questions/${id}`, {
      method: 'GET',
    });
  }

  // Exams endpoints
  async getExams() {
    return this.request('/exams', {
      method: 'GET',
    });
  }

  async startExam(examId: string) {
    return this.request(`/exams/${examId}/start`, {
      method: 'POST',
    });
  }

  async submitExam(examId: string, answers: any) {
    return this.request(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  // Payments endpoints
  async getPlans() {
    return this.request('/payments/plans', {
      method: 'GET',
    });
  }

  async subscribe(planId: string, paymentMethod: any) {
    return this.request('/payments/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId, paymentMethod }),
    });
  }
}

export const api = new ApiClient(API_URL);
