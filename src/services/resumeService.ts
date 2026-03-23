import api from '../lib/api';

export type ResumeStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface ResumeStatusResponse {
  resume_id: string;
  status: ResumeStatus;
  parsed_data: ParsedResume | null;
  fail_reason: string;
  created_at: string;
}

export interface ParsedResume {
  name: string;
  email: string;
  skills: string[];
  experience: {
    company_name: string;
    role: string;
    start_date: string;
    end_date: string;
    work_done: string;
  }[];
  projects: {
    name: string;
    description: string;
    tech_stack: string;
    url: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export interface UploadResumeResponse {
  resume_id: string;
  status: ResumeStatus;
}

export const uploadResume = async (file: File): Promise<UploadResumeResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post<{ data: UploadResumeResponse }>('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const getResumeStatus = async (resumeId: string): Promise<ResumeStatusResponse> => {
  const res = await api.get<{ data: ResumeStatusResponse }>(`/resume/${resumeId}`);
  return res.data.data;
};
