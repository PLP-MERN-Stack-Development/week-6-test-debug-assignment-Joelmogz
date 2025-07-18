const API_URL = 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(response.status, error.error || 'An error occurred');
  }

  return response.json();
};

export const authApi = {
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: () => apiRequest('/auth/me'),
};

export const postsApi = {
  getAllPosts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    return apiRequest(`/posts?${searchParams.toString()}`);
  },

  getPost: (id) => apiRequest(`/posts/${id}`),

  createPost: (postData) =>
    apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  updatePost: (id, postData) =>
    apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),

  deletePost: (id) =>
    apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    }),
};