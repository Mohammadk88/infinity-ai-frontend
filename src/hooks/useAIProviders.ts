import { useState, useCallback, useEffect } from 'react';
import { useAIProviderStore } from '@/store/useAIProviderStore';
import { AIProvider, AIProviderCreate, AIProviderUpdate } from '@/types/AIProvider';
import { useToast } from '@/components/ui/use-toast';

export const useAIProviders = () => {
  const { providers, isLoading, error, fetchProviders, addProvider, updateProvider, deleteProvider } = useAIProviderStore();
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleAddProvider = useCallback(async (data: AIProviderCreate) => {
    try {
      await addProvider(data as AIProviderCreate);
      toast({
        title: 'Provider added',
        description: 'Your AI provider has been added successfully.',
      });
      setIsAddingProvider(false);
      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add provider. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [addProvider, toast]);

  const handleUpdateProvider = useCallback(async (data: AIProviderUpdate) => {
    if (!editingProvider) return false;
    
    try {
      setIsUpdatingId(editingProvider.id);
      await updateProvider(editingProvider.id, data);
      toast({
        title: 'Provider updated',
        description: 'Your AI provider has been updated successfully.',
      });
      setEditingProvider(null);
      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update provider. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdatingId(null);
    }
  }, [editingProvider, updateProvider, toast]);

  const handleToggleActive = useCallback(async (id: string, isActive: boolean) => {
    try {
      setIsUpdatingId(id);
      await updateProvider(id, { isActive });
      toast({
        title: 'Status updated',
        description: `Provider is now ${isActive ? 'active' : 'inactive'}.`,
      });
      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update provider status. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdatingId(null);
    }
  }, [updateProvider, toast]);

  const handleDeleteProvider = useCallback(async (id: string) => {
    try {
      setIsDeletingId(id);
      await deleteProvider(id);
      toast({
        title: 'Provider deleted',
        description: 'The AI provider has been deleted successfully.',
      });
      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete provider. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeletingId(null);
    }
  }, [deleteProvider, toast]);

  const handleCancel = useCallback(() => {
    setIsAddingProvider(false);
    setEditingProvider(null);
  }, []);

  return {
    providers,
    isLoading,
    error,
    editingProvider,
    setEditingProvider,
    isAddingProvider,
    setIsAddingProvider,
    isDeletingId,
    isUpdatingId,
    handleAddProvider,
    handleUpdateProvider,
    handleToggleActive,
    handleDeleteProvider,
    handleCancel,
  };
};
