import { useContext, useEffect } from 'react';
import { DashboardContext } from '../model/DashboardContext';

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  // Refresca la data cada vez que el usuario ingresa a la vista del Dashboard
  useEffect(() => {
    context.refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return context;
};
