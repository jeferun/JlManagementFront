import { useState, useEffect, useCallback } from 'react';
import { getGlobalDashboard, DashboardSummary } from '../services/dashboardService';
import { useToast } from '@/shared/components/hooks/use-toast';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getGlobalDashboard();
      setData(res);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast({
        title: 'Error loading dashboard',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    refetch: fetchDashboard,
  };
};
