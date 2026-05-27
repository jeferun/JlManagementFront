import { useState, useCallback } from 'react';
import { getAffiliate, getAffiliateSummary, getAffiliateContributions } from '../services/affiliateService';
import { createContribution, deleteContribution } from '@/modules/contributions/services/contributionService';
import { Affiliate, AffiliateSummary } from '../model/types';
import { Contribution } from '@/modules/contributions/model/types';
import { useToast } from '@/shared/components/hooks/use-toast';

export const useAffiliateDetail = (affiliateId: number) => {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [summary, setSummary] = useState<AffiliateSummary | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const [affData, sumData, contData] = await Promise.all([
        getAffiliate(affiliateId),
        getAffiliateSummary(affiliateId),
        getAffiliateContributions(affiliateId),
      ]);
      setAffiliate(affData);
      setSummary(sumData);
      setContributions(contData);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast({
        title: 'Error cargando detalles del afiliado',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [affiliateId, toast]);

  const addContribution = async (data: Partial<Contribution>) => {
    try {
      setIsLoading(true);
      await createContribution({ ...data, affiliate_id: affiliateId });
      toast({
        title: 'Éxito',
        description: 'Aporte registrado correctamente',
      });
      fetchDetail();
      return true;
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast({
        title: 'Error registrando aporte',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeContribution = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteContribution(id);
      toast({
        title: 'Éxito',
        description: 'Aporte eliminado (anulado)',
      });
      fetchDetail();
      return true;
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast({
        title: 'Error eliminando aporte',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    affiliate,
    summary,
    contributions,
    isLoading,
    fetchDetail,
    addContribution,
    removeContribution,
  };
};
