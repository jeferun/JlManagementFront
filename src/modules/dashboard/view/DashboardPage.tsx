'use client';

import { useDashboard } from '../viewModel/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Users, DollarSign, Wallet } from 'lucide-react';

export const DashboardPage = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hola, Bienvenido de nuevo 👋</h1>
        <p className="text-slate-500 mt-2">Aquí tienes un resumen del estado de la cooperativa.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Afiliados Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total_active_affiliates || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Total de afiliados en el sistema</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aportes del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.total_monthly_contributions || 0)}</div>
            <p className="text-xs text-slate-500 mt-1">Recaudado este mes</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fondo Acumulado</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data?.total_accumulated_contributions || 0)}</div>
            <p className="text-xs text-slate-500 mt-1">Total histórico de la cooperativa</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
