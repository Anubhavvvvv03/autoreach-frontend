import api from '../lib/api';

export interface GenerateMessageRequest {
  poster: string;
  job_title: string;
  skills?: string[];
}

export interface GenerateMessageResponse {
  message: string;
}

export const generateMessage = async (data: GenerateMessageRequest): Promise<GenerateMessageResponse> => {
  const res = await api.post<{ data: GenerateMessageResponse }>('/generate-message', data);
  return res.data.data;
};
