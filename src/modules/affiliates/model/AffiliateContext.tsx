'use client';

import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { getAffiliates, createAffiliate, updateAffiliate, deleteAffiliate } from '../services/affiliateService';
import { Affiliate } from '../model/types';
import { useToast } from '@/shared/components/hooks/use-toast';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface AffiliateContextProps {
  affiliates: Affiliate[];
  totalCount: number;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  fetchAffiliates: () => Promise<void>;
  addAffiliate: (data: Partial<Affiliate>) => Promise<boolean>;
  editAffiliate: (id: number, data: Partial<Affiliate>) => Promise<boolean>;
  removeAffiliate: (id: number) => Promise<boolean>;
}

export const AffiliateContext = createContext<AffiliateContextProps | undefined>(undefined);

export const AffiliateProvider = ({ children }: { children: ReactNode }) => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Global filters
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchAffiliates = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAffiliates({ page, page_size: pageSize, full_name: debouncedSearch, status: statusFilter });
      setAffiliates(res.results);
      setTotalCount(res.total_count);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast({
        title: 'Error cargando afiliados',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch, statusFilter, toast]);

  // Effect to refetch when filters change
  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const addAffiliate = async (data: Partial<Affiliate>) => {
    try {
      setIsLoading(true);
      await createAffiliate(data);
      toast({
        title: 'Éxito',
        description: 'Afiliado registrado correctamente',
      });
      fetchAffiliates();
      return true;
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast({
        title: 'Error registrando afiliado',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const editAffiliate = async (id: number, data: Partial<Affiliate>) => {
    try {
      setIsLoading(true);
      await updateAffiliate(id, data);
      toast({
        title: 'Éxito',
        description: 'Afiliado actualizado correctamente',
      });
      fetchAffiliates();
      return true;
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast({
        title: 'Error actualizando afiliado',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeAffiliate = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteAffiliate(id);
      toast({
        title: 'Éxito',
        description: 'Afiliado eliminado lógicamente',
      });
      fetchAffiliates();
      return true;
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast({
        title: 'Error eliminando afiliado',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AffiliateContext.Provider value={{
      affiliates,
      totalCount,
      isLoading,
      page,
      setPage,
      pageSize,
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
      fetchAffiliates,
      addAffiliate,
      editAffiliate,
      removeAffiliate
    }}>
      {children}
    </AffiliateContext.Provider>
  );
};
