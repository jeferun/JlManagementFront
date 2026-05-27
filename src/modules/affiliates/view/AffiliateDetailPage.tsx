'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAffiliateDetail } from '../viewModel/useAffiliateDetail';
import { ContributionFormModal } from '@/modules/contributions/view/ContributionFormModal';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { ArrowLeft, Plus, DollarSign, Activity, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';

export const AffiliateDetailPage = () => {
  const params = useParams();
  const affiliateId = Number(params.id);
  const {
    affiliate,
    summary,
    contributions,
    isLoading,
    isModalOpen,
    confirmModal,
    handleOpenModal,
    handleCloseModal,
    openConfirmModal,
    closeConfirmModal,
    addContribution,
    handleConfirmRemove,
  } = useAffiliateDetail(affiliateId);

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(Number(amount));
  };

  const translateMethod = (method: string) => {
    const methods: Record<string, string> = {
      'CASH': 'Efectivo',
      'TRANSFER': 'Transferencia',
      'CARD': 'Tarjeta'
    };
    return methods[method] || method;
  };

  if (isLoading && !affiliate) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Afiliado no encontrado</h2>
        <Link href="/affiliates" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/affiliates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{affiliate.full_name}</h1>
          <p className="text-sm text-slate-500">
            {affiliate.document_type} {affiliate.document_number} | {affiliate.email}
          </p>
        </div>
        <div className="ml-auto">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              affiliate.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            {affiliate.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aportado</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.total_contributed || 0)}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cantidad de Aportes</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.contribution_count || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">Historial de Aportes</h2>
          {affiliate.status === 'ACTIVE' && (
            <Button onClick={handleOpenModal}>
              <Plus className="mr-2 h-4 w-4" /> Registrar Aporte
            </Button>
          )}
        </div>

        <div className="border border-slate-200/80 rounded-lg bg-white overflow-hidden shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                    No hay aportes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                contributions.map((contribution) => (
                  <TableRow key={contribution.id}>
                    <TableCell>{contribution.contribution_date}</TableCell>
                    <TableCell className="font-medium text-slate-900">{formatCurrency(contribution.amount)}</TableCell>
                    <TableCell>{translateMethod(contribution.payment_method)}</TableCell>
                    <TableCell className="text-right">
                      {contribution.status === 'ACTIVE' && affiliate.status === 'ACTIVE' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Anular Aporte"
                          onClick={() => openConfirmModal(contribution.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ContributionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={addContribution}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        title="Anular Aporte"
        description="¿Está seguro de anular este aporte? Esta acción no se puede deshacer."
        confirmText="Anular"
        isDestructive={true}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
};
