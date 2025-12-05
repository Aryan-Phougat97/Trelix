const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    credentials: 'include', // This sends/receives the HTTP-only cookies
  });

  if (!response.ok) {
    // Try to parse error message from JSON, fallback to status text
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.error || response.statusText);
  }

  return response.json();
}

export const api = {
  auth: {
    me: () => request<{ user: any }>('/me'),
    register: (username: string, password: string) => 
      request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
    login: (username: string, password: string) => 
      request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },
  sync: {
    // The "Vault" endpoints I built in Rust
    load: () => request<any>('/api/store'),
    save: (data: any) => request('/api/store', { method: 'POST', body: JSON.stringify(data) }),
  }
};