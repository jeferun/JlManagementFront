import { apiClient } from '@/shared/utils/api';
import { Contribution } from '../model/types';

export const createContribution = (data: Partial<Contribution>) => {
  return apiClient<Contribution>('/contributions/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const deleteContribution = (id: number) => {
  return apiClient<void>(`/contributions/${id}/`, {
    method: 'DELETE',
  });
};
