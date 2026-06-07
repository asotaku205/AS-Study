import api from "./api";

export interface AdminOverviewStats {
  users: { total: number; newThisWeek: number; banned: number };
  documents: {
    total: number;
    newThisWeek: number;
    pending: number;
    reported: number;
    published: number;
  };
  quizzes: { total: number; weeklyCount: number; growth: number };
  lectures: { total: number; weeklyCount: number };
  alerts: number;
}

export interface AdminActivityItem {
  id: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
  source: string;
  time: string;
  createdAt: string;
  category: "user" | "document" | "quiz" | "lecture" | "system";
}

export interface AdminActivityChartItem {
  name: string;
  documents: number;
  quizzes: number;
  users: number;
}

export interface PaginatedActivityResponse {
  items: AdminActivityItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SystemSettings {
  id: number;
  siteName: string;
  adminEmail: string;
  seoDesc: string;
  allowRegister: boolean;
  maintenanceMode: boolean;
  autoPublish: boolean;
  emailNotify: boolean;
  twoFactor: boolean;
  updatedAt: string;
}

export type ActivityLogLevel = "all" | "INFO" | "WARN" | "ERROR";

export const getAdminOverview = async (): Promise<AdminOverviewStats> => {
  const response = await api.get("/admin/overview");
  return response.data;
};

export const getAdminActivity = async (params?: {
  page?: number;
  limit?: number;
  level?: ActivityLogLevel;
}): Promise<PaginatedActivityResponse> => {
  const response = await api.get("/admin/activity", { params });
  return response.data;
};

export const getAdminActivityChart = async (): Promise<
  AdminActivityChartItem[]
> => {
  const response = await api.get("/admin/activity-chart");
  return response.data;
};

export const getAdminSettings = async (): Promise<SystemSettings> => {
  const response = await api.get("/admin/settings");
  return response.data;
};

export const updateAdminSettings = async (
  data: Partial<SystemSettings>,
): Promise<SystemSettings> => {
  const response = await api.patch("/admin/settings", data);
  return response.data;
};

export const resetAdminSettings = async (): Promise<SystemSettings> => {
  const response = await api.post("/admin/settings/reset");
  return response.data;
};

export const sendAdminTestEmail = async (): Promise<{ message: string }> => {
  const response = await api.post("/admin/settings/test-email");
  return response.data;
};
