import { useState, useCallback } from 'react';
import { getAffiliates, createAffiliate, updateAffiliate, deleteAffiliate } from '../services/affiliateService';
import { Affiliate } from '../model/types';
import { useToast } from '@/shared/components/hooks/use-toast';

export const useAffiliates = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAffiliates = useCallback(async (page = 1, page_size = 10, search = '', status = '') => {
    try {
      setIsLoading(true);
      const res = await getAffiliates({ page, page_size, full_name: search, status });
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
  }, [toast]);

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

  return {
    affiliates,
    totalCount,
    isLoading,
    fetchAffiliates,
    addAffiliate,
    editAffiliate,
    removeAffiliate,
  };
};
