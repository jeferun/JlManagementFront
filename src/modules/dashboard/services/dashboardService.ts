import { apiClient } from '@/shared/utils/api';

export interface DashboardSummary {
  total_active_affiliates: number;
  total_monthly_contributions: number;
  total_accumulated_contributions: number;
}

export const getGlobalDashboard = () => {
  return apiClient<DashboardSummary>('/affiliates/dashboard-summary/');
};
