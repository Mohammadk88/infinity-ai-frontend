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
  // Enhanced functionality for better UI integration
  getActiveProvider: () => AIProvider | null;
  setActiveProvider: (id: string) => Promise<void>;
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
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch AI providers';
            set({ 
              error: errorMessage, 
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
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add AI provider';
            set({ 
              error: errorMessage, 
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
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update AI provider';
            set({ 
              error: errorMessage, 
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
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete AI provider';
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
          }
        },

        reset: () => {
          set({ providers: [], isLoading: false, error: null });
        },

        // Enhanced functionality for better UI integration
        getActiveProvider: () => {
          const { providers } = get();
          return providers.find(p => p.isActive) || null;
        },

        setActiveProvider: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            // First, deactivate all providers
            const { providers } = get();
            const updates = providers.map(async (provider) => {
              if (provider.id === id) {
                return AIProviderService.updateProvider(id, { isActive: true });
              } else if (provider.isActive) {
                return AIProviderService.updateProvider(provider.id, { isActive: false });
              }
              return provider;
            });
            
            await Promise.all(updates);
            
            // Refresh the providers list
            await get().fetchProviders();
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to set active provider';
            set({ error: errorMessage, isLoading: false });
          }
        }
      }),
      {
        name: 'ai-provider-storage',
        partialize: (state) => ({ providers: state.providers }),
      }
    )
  )
);
