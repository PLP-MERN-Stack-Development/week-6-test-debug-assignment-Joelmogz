import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../utils/api';

// Mock the API
vi.mock('../../utils/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('initializes with no user when no token exists', async () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs in user successfully', async () => {
    const mockUser = { _id: '1', username: 'testuser', email: 'test@example.com', role: 'user' };
    const mockToken = 'mock-token';

    authApi.login.mockResolvedValue({
      token: mockToken,
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.login('testuser', 'password');
      expect(loginResult.success).toBe(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);
  });

  it('handles login failure', async () => {
    const mockError = new Error('Invalid credentials');
    mockError.message = 'Invalid credentials';

    authApi.login.mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.login('testuser', 'wrongpassword');
      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('Invalid credentials');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('registers user successfully', async () => {
    const mockUser = { _id: '1', username: 'newuser', email: 'new@example.com', role: 'user' };
    const mockToken = 'mock-token';

    authApi.register.mockResolvedValue({
      token: mockToken,
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const registerResult = await result.current.register('newuser', 'new@example.com', 'password');
      expect(registerResult.success).toBe(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);
  });

  it('logs out user', async () => {
    const mockUser = { _id: '1', username: 'testuser', email: 'test@example.com', role: 'user' };
    const mockToken = 'mock-token';

    authApi.login.mockResolvedValue({
      token: mockToken,
      user: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    // First login
    await act(async () => {
      await result.current.login('testuser', 'password');
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
  });
});