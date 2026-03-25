import api from '../lib/api';
import type { ApiResponse } from '../lib/api';

export type ParsingStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ResumeJobResponse {
  jobId: string;
  status: ParsingStatus;
  progress?: number;
  results?: {
    skills: Record<string, any>;
    experienceSummary: string;
  };
}

export interface UploadResumeResponse {
  jobId: string;
  status: 'PROCESSING';
}

export const uploadResume = async (file: File): Promise<UploadResumeResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post<ApiResponse<UploadResumeResponse>>('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return (res as any).data;
};

export const getResumeJobStatus = async (jobId: string): Promise<ResumeJobResponse> => {
  const res = await api.get<ApiResponse<ResumeJobResponse>>(`/resume/jobs/${jobId}`);
  return (res as any).data;
};
