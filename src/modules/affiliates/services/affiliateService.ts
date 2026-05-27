import { apiClient } from '@/shared/utils/api';
import { Affiliate, AffiliateListResponse, AffiliateSummary } from '../model/types';
import { Contribution } from '@/modules/contributions/model/types';

export const getAffiliates = (params?: { page?: number; page_size?: number; full_name?: string; status?: string }) => {
  const urlParams = new URLSearchParams();
  if (params?.page) urlParams.append('page', params.page.toString());
  if (params?.page_size) urlParams.append('page_size', params.page_size.toString());
  if (params?.full_name) urlParams.append('full_name', params.full_name);
  if (params?.status) urlParams.append('status', params.status);

  const query = urlParams.toString();
  return apiClient<AffiliateListResponse>(`/affiliates/${query ? `?${query}` : ''}`);
};

export const getAffiliate = (id: number) => {
  return apiClient<Affiliate>(`/affiliates/${id}/`);
};

export const createAffiliate = (data: Partial<Affiliate>) => {
  return apiClient<Affiliate>('/affiliates/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAffiliate = (id: number, data: Partial<Affiliate>) => {
  return apiClient<Affiliate>(`/affiliates/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteAffiliate = (id: number) => {
  return apiClient<void>(`/affiliates/${id}/`, {
    method: 'DELETE',
  });
};

export const getAffiliateSummary = (id: number) => {
  return apiClient<AffiliateSummary>(`/affiliates/${id}/summary/`);
};

export const getAffiliateContributions = (id: number) => {
  return apiClient<Contribution[]>(`/affiliates/${id}/contributions/`);
};
