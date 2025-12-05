const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface User {
  id: string;
  username: string;
  created_at: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as { error?: string };
    throw new ApiError(response.status, errorData.error || response.statusText);
  }

  return response.json();
}

export const api = {
  auth: {
    me: () => request<{ user: User }>('/me'),
    register: (username: string, password: string) => 
      request<{ message: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
    login: (username: string, password: string) => 
      request<{ message: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
    logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  },
  sync: {
    load: () => request<unknown>('/api/store'),
    save: (data: unknown) => request('/api/store', { method: 'POST', body: JSON.stringify(data) }),
  }
};