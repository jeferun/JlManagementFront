'use client';

import { useEffect, useState } from 'react';

import { useAffiliates } from '../viewModel/useAffiliates';
import { AffiliateFormModal } from './AffiliateFormModal';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Plus, Search, Trash2, Pencil, Play } from 'lucide-react';
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { Affiliate } from '../model/types';

export const AffiliateListPage = () => {
  const { affiliates, isLoading, fetchAffiliates, addAffiliate, editAffiliate, removeAffiliate } = useAffiliates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const router = useRouter();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const handleOpenModal = (affiliate?: Affiliate) => {
    setSelectedAffiliate(affiliate || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAffiliate(null);
  };

  const handleSubmit = async (data: Partial<Affiliate>) => {
    if (selectedAffiliate) {
      return editAffiliate(selectedAffiliate.id, data);
    }
    return addAffiliate(data);
  };

  useEffect(() => {
    fetchAffiliates(1, 10, debouncedSearch);
  }, [debouncedSearch, fetchAffiliates]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Afiliados</h1>
          <p className="text-sm text-slate-500 mt-1">Gestiona los miembros de la cooperativa.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Afiliado
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && affiliates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : affiliates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No se encontraron afiliados.
                </TableCell>
              </TableRow>
            ) : (
              affiliates.map((affiliate) => (
                <TableRow 
                  key={affiliate.id} 
                  className={`transition-colors ${affiliate.status === 'ACTIVE' ? 'cursor-pointer hover:bg-slate-50' : 'opacity-75'}`}
                  onClick={() => {
                    if (affiliate.status === 'ACTIVE') {
                      router.push(`/affiliates/${affiliate.id}`);
                    }
                  }}
                >
                  <TableCell className="font-medium text-slate-900">{affiliate.full_name}</TableCell>
                  <TableCell>{affiliate.document_type} {affiliate.document_number}</TableCell>
                  <TableCell>{affiliate.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        affiliate.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {affiliate.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {affiliate.status === 'ACTIVE' ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Editar"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(affiliate);
                          }}
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Eliminar"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmModal({
                              isOpen: true,
                              title: 'Eliminar Afiliado',
                              description: '¿Está seguro de eliminar al afiliado? Posiblemente tenga aportes pendientes.',
                              confirmText: 'Eliminar',
                              isDestructive: true,
                              onConfirm: () => removeAffiliate(affiliate.id),
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Activar"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmModal({
                            isOpen: true,
                            title: 'Activar Afiliado',
                            description: 'El afiliado puede tener aportes pendientes. ¿Está seguro de activar de nuevo a este afiliado?',
                            confirmText: 'Activar',
                            isDestructive: false,
                            onConfirm: () => editAffiliate(affiliate.id, { status: 'ACTIVE' }),
                          });
                        }}
                      >
                        <Play className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AffiliateFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        initialData={selectedAffiliate ? {
          full_name: selectedAffiliate.full_name,
          document_type: selectedAffiliate.document_type,
          document_number: selectedAffiliate.document_number,
          email: selectedAffiliate.email,
        } : undefined}
      />

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
};
