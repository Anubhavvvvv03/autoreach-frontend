import api from '../lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await api.post<{ data: AuthResponse }>('/auth/login', data);
  return res.data.data;
};

export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  const res = await api.post<{ data: AuthResponse }>('/auth/signup', data);
  return res.data.data;
};
