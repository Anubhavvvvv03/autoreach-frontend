import api from '../lib/api';
import type { ApiResponse } from '../lib/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  settings?: {
    notificationsEnabled: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return (res as any).data;
};

export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const res = await api.post<ApiResponse<AuthResponse>>('/auth/signup', data);
  return (res as any).data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<ApiResponse<User>>('/auth/me');
  return (res as any).data;
};
