import axios from '@/app/lib/axios';
import { AIProvider, AIProviderCreate, AIProviderUpdate } from '@/types/AIProvider';

export const AIProviderService = {
  /**
   * Get all AI providers for the current user
   */
  getProviders: async (): Promise<AIProvider[]> => {
    const response = await axios.get('/ai-provider-config');
    return response.data;
  },

  /**
   * Create a new AI provider
   */
  createProvider: async (data: AIProviderCreate): Promise<AIProvider> => {
    const response = await axios.post('/ai-provider-config', data);
    return response.data;
  },

  /**
   * Update an existing AI provider
   */
  updateProvider: async (id: string, data: AIProviderUpdate): Promise<AIProvider> => {
    const response = await axios.patch(`/ai-provider-config/${id}`, data);
    return response.data;
  },

  /**
   * Delete an AI provider
   */
  deleteProvider: async (id: string): Promise<void> => {
    await axios.delete(`/ai-provider-config/${id}`);
  }
};
