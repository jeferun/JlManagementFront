import { useState, useCallback, useEffect } from 'react';
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

  // Local UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    contributionId: number | null;
  }>({
    isOpen: false,
    contributionId: null,
  });

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

  useEffect(() => {
    if (affiliateId) {
      fetchDetail();
    }
  }, [affiliateId, fetchDetail]);

  const addContribution = async (data: Partial<Contribution>) => {
    try {
      setIsLoading(true);
      await createContribution({ ...data, affiliate_id: affiliateId });
      toast({
        title: 'Éxito',
        description: 'Aporte registrado correctamente',
      });
      fetchDetail();
      setIsModalOpen(false);
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
      setConfirmModal({ isOpen: false, contributionId: null });
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

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const openConfirmModal = useCallback((id: number) => {
    setConfirmModal({
      isOpen: true,
      contributionId: id,
    });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal({
      isOpen: false,
      contributionId: null,
    });
  }, []);

  const handleConfirmRemove = useCallback(() => {
    if (confirmModal.contributionId) {
      removeContribution(confirmModal.contributionId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmModal.contributionId]);

  return {
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
  };
};
