import api from '../lib/api';
import type { ApiResponse } from '../lib/api';

export interface DashboardSummary {
  stats: {
    totalOutreach: number;
    successRate: number;
    pendingTasks: number;
    activeCampaigns: number;
  };
  performanceHistory: Array<{
    date: string;
    value: number;
  }>;
}

export interface DashboardActivity {
  activities: Array<{
    id: string;
    type: 'OUTREACH' | 'SYSTEM';
    title: string;
    timestamp: string;
    status: string;
  }>;
}

export interface DashboardInsight {
  insights: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'HIGH' | 'LOW';
  }>;
}

export interface NotificationFeed {
  unreadCount: number;
  list: Array<{
    id: string;
    title: string;
    message: string;
    isRead: boolean;
  }>;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
  return (res as any).data;
};

export const getDashboardActivity = async (): Promise<DashboardActivity> => {
  const res = await api.get<ApiResponse<DashboardActivity>>('/dashboard/activity');
  return (res as any).data;
};

export const getDashboardInsights = async (): Promise<DashboardInsight> => {
  const res = await api.get<ApiResponse<DashboardInsight>>('/dashboard/insights');
  return (res as any).data;
};

export const getNotifications = async (): Promise<NotificationFeed> => {
  const res = await api.get<ApiResponse<NotificationFeed>>('/notifications');
  return (res as any).data;
};
