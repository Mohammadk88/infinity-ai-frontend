import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AIProvider, AIProviderCreate, AIProviderUpdate } from '@/types/AIProvider';
import { AIProviderService } from '@/services/api/AIProviderService';

interface AIProviderState {
  providers: AIProvider[];
  isLoading: boolean;
  error: string | null;
  fetchProviders: () => Promise<void>;
  addProvider: (provider: AIProviderCreate) => Promise<void>;
  updateProvider: (id: string, data: AIProviderUpdate) => Promise<void>;
  deleteProvider: (id: string) => Promise<void>;
  reset: () => void;
}

export const useAIProviderStore = create<AIProviderState>()(
  devtools(
    persist(
      (set, get) => ({
        providers: [],
        isLoading: false,
        error: null,

        fetchProviders: async () => {
          set({ isLoading: true, error: null });
          try {
            const providers = await AIProviderService.getProviders();
            set({ providers, isLoading: false });
          } catch (error: any) {
            set({ 
              error: error.response?.data?.message || 'Failed to fetch AI providers', 
              isLoading: false 
            });
          }
        },

        addProvider: async (provider: AIProviderCreate) => {
          set({ isLoading: true, error: null });
          try {
            const newProvider = await AIProviderService.createProvider(provider);
            set((state) => ({ 
              providers: [...state.providers, newProvider], 
              isLoading: false 
            }));
          } catch (error: any) {
            set({ 
              error: error.response?.data?.message || 'Failed to add AI provider', 
              isLoading: false 
            });
          }
        },

        updateProvider: async (id: string, data: AIProviderUpdate) => {
          set({ isLoading: true, error: null });
          try {
            const updatedProvider = await AIProviderService.updateProvider(id, data);
            set((state) => ({
              providers: state.providers.map((provider) => 
                provider.id === id ? { ...provider, ...updatedProvider } : provider
              ),
              isLoading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.response?.data?.message || 'Failed to update AI provider', 
              isLoading: false 
            });
          }
        },

        deleteProvider: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            await AIProviderService.deleteProvider(id);
            set((state) => ({
              providers: state.providers.filter((provider) => provider.id !== id),
              isLoading: false
            }));
          } catch (error: any) {
            set({ 
              error: error.response?.data?.message || 'Failed to delete AI provider', 
              isLoading: false 
            });
          }
        },

        reset: () => {
          set({ providers: [], isLoading: false, error: null });
        }
      }),
      {
        name: 'ai-provider-storage',
        partialize: (state) => ({ providers: state.providers }),
      }
    )
  )
);
