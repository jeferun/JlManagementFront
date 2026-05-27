import { useState, useContext, useCallback } from 'react';
import { AffiliateContext } from '../model/AffiliateContext';
import { Affiliate } from '../model/types';

export const useAffiliates = () => {
  const context = useContext(AffiliateContext);
  
  if (!context) {
    throw new Error('useAffiliates must be used within an AffiliateProvider');
  }

  const {
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
    addAffiliate,
    editAffiliate,
    removeAffiliate
  } = context;

  // Local UI State for the view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

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
    onConfirm: () => { },
  });

  // Action handlers
  const handleOpenModal = useCallback((affiliate?: Affiliate) => {
    setSelectedAffiliate(affiliate || null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAffiliate(null);
  }, []);

  const handleSubmit = useCallback(async (data: Partial<Affiliate>) => {
    if (selectedAffiliate) {
      const success = await editAffiliate(selectedAffiliate.id, data);
      if (success) handleCloseModal();
      return success;
    }
    const success = await addAffiliate(data);
    if (success) handleCloseModal();
    return success;
  }, [selectedAffiliate, editAffiliate, addAffiliate, handleCloseModal]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, [setSearchTerm, setPage]);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status === 'ALL' ? '' : status);
    setPage(1);
  }, [setStatusFilter, setPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, [setPage]);

  const openConfirmModal = useCallback((title: string, description: string, onConfirm: () => void, isDestructive = true, confirmText = 'Confirmar') => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      confirmText,
      isDestructive,
      onConfirm: async () => {
        await onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    // Global State
    affiliates,
    isLoading,
    page,
    totalPages,
    searchTerm,
    statusFilter,
    
    // UI State
    isModalOpen,
    selectedAffiliate,
    confirmModal,
    
    // Actions
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleSearch,
    handleStatusFilter,
    handlePageChange,
    openConfirmModal,
    closeConfirmModal,
    
    // Raw actions from context if needed
    removeAffiliate,
    editAffiliate
  };
};
