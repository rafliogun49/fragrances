import type { Product, QuizAnswers, RecommendResponse } from '../../../server/src/types';

export type { Product, QuizAnswers, RecommendResponse };

const BASE = '/api';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string };
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Public
export const api = {
  getProducts: () => request<Product[]>('/products'),

  recommend: (body: { email: string; consent: boolean; answers: QuizAnswers; lang?: 'en' | 'id' }) =>
    request<RecommendResponse>('/recommend', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

// Admin
export const adminApi = {
  login: (username: string, password: string) =>
    request<{ ok: boolean; username: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    request<{ ok: boolean }>('/admin/logout', { method: 'POST' }),

  getLeads: (page = 1, pageSize = 50) =>
    request<{
      leads: import('../../../server/src/types').Lead[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>(`/admin/leads?page=${page}&pageSize=${pageSize}`),

  exportLeads: () => {
    window.open(`${BASE}/admin/leads/export.csv`, '_blank');
  },

  getProducts: () => request<Product[]>('/admin/products'),

  createProduct: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
    request<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: number, data: Partial<Product>) =>
    request<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: number) =>
    request<{ ok: boolean }>(`/admin/products/${id}`, { method: 'DELETE' }),
};
