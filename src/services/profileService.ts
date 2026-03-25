import api from '../lib/api';
import type { ApiResponse } from '../lib/api';

export interface Experience {
  company_name: string;
  start_date: string;
  end_date: string;
  work_done: string;
}

export interface Project {
  name: string;
  tech_stack: string;
  description: string;
  url: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
}

export interface Profile {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  location: string;
  socialLinks: SocialLinks;
  skills: string[];
  experience: Experience[];
  projects: Project[];
}

export interface SyncStatus {
  items: {
    id: string;
    label: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
  }[];
}

export const getProfile = async (): Promise<Profile> => {
  const res = await api.get<ApiResponse<Profile>>('/profile');
  return (res as any).data;
};

export const updateProfile = async (data: Partial<Profile>): Promise<Profile> => {
  const res = await api.put<ApiResponse<Profile>>('/profile', data);
  return (res as any).data;
};

export const getProfileSyncStatus = async (): Promise<SyncStatus> => {
  const res = await api.get<ApiResponse<SyncStatus>>('/profile/sync-status');
  return (res as any).data;
};
