import api from '../lib/api';
import type { ApiResponse } from '../lib/api';

export interface GenerateMessageRequest {
  company: string;
  role: string;
  recruiter: string;
  tone: string;
  context?: string;
}

export interface GenerateMessageResponse {
  messageId: string;
  text: string;
  generatedAt: string;
}

export interface GenerationHistory {
  messages: Array<{
    messageId: string;
    company: string;
    role: string;
    text: string;
    status: string;
  }>;
}

export const generateMessage = async (data: GenerateMessageRequest): Promise<GenerateMessageResponse> => {
  const res = await api.post<ApiResponse<GenerateMessageResponse>>('/generate/message', data);
  return (res as any).data;
};

export const getGenerationHistory = async (): Promise<GenerationHistory> => {
  const res = await api.get<ApiResponse<GenerationHistory>>('/generate/history');
  return (res as any).data;
};
