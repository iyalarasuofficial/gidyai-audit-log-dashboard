import axios from "axios";
import type { AxiosInstance } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export interface AuditLog {
  _id?: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  resourceType: string;
  ipAddress: string;
  region: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'Resolved' | 'Unresolved' | 'Investigating';
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FetchLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  query: {
    filter: Record<string, unknown>;
    sort: string;
    order: string;
  };
}

export interface UploadResponse {
  message: string;
  uploaded: number;
  failed: number;
  errors?: Array<{
    index: number;
    error: string;
  }>;
}

export const uploadLogs = async (logs: AuditLog[]): Promise<UploadResponse> => {
  const response = await apiClient.post<UploadResponse>('/logs/upload', { logs });
  return response.data;
};

export const fetchLogs = async (
  page = 1,
  limit = 50,
  filter: Record<string, unknown> = {},
  search = '',
  sort = 'timestamp',
  order: 'asc' | 'desc' = 'desc'
): Promise<FetchLogsResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (Object.keys(filter).length > 0) {
    params.append('filter', JSON.stringify(filter));
  }

  if (search.trim()) {
    params.append('search', search.trim());
  }

  params.append('sort', sort);
  params.append('order', order);

  const response = await apiClient.get<FetchLogsResponse>(`/logs?${params.toString()}`);
  return response.data;
};
