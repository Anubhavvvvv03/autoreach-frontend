import api from '../lib/api';

export interface Experience {
  company_name: string;
  role: string;
  start_date: string;
  end_date: string;
  work_done: string;
}

export interface Project {
  name: string;
  description: string;
  tech_stack: string;
  url: string;
}

export interface Profile {
  id: string;
  user_id: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  meta: string;
}

export interface UpsertProfileRequest {
  skills: string[];
  experience: Experience[];
  projects: Project[];
  meta?: string;
}

export const getProfile = async (): Promise<Profile> => {
  const res = await api.get<{ data: Profile }>('/profile');
  return res.data.data;
};

export const createProfile = async (data: UpsertProfileRequest): Promise<Profile> => {
  const res = await api.post<{ data: Profile }>('/profile', data);
  return res.data.data;
};

export const updateProfile = async (data: UpsertProfileRequest): Promise<Profile> => {
  const res = await api.put<{ data: Profile }>('/profile', data);
  return res.data.data;
};
