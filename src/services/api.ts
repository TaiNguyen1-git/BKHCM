import { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Generic fetch function with error handling
 */
async function fetchData<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API error:', error);
    return {
      data: null as unknown as T,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false,
    };
  }
}

export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string) => fetchData<T>(endpoint),

  /**
   * POST request
   */
  post: <T>(endpoint: string, data: any) =>
    fetchData<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data: any) =>
    fetchData<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string) =>
    fetchData<T>(endpoint, {
      method: 'DELETE',
    }),
}; 