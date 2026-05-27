'use client';

import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getGlobalDashboard, DashboardSummary } from '../services/dashboardService';
import { useToast } from '@/shared/components/hooks/use-toast';

interface DashboardContextProps {
  data: DashboardSummary | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
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
        title: 'Error cargando dashboard',
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

  return (
    <DashboardContext.Provider value={{
      data,
      isLoading,
      refetch: fetchDashboard,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
