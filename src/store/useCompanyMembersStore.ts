import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '@/app/lib/axios';
import { CompanyMember, CompanyRole } from '@/types/CompanyMember';
import { ApiError } from '@/types/ApiError';

interface CompanyMembersState {
  members: CompanyMember[];
  roles: CompanyRole[];
  isLoading: boolean;
  error: string | null;
  selectedMember: CompanyMember | null;
  
  // Actions
  fetchMembers: (companyId: string) => Promise<void>;
  fetchRoles: (companyId: string) => Promise<void>;
  addMember: (companyId: string, data: { userId: string; roleId: string }) => Promise<void>;
  updateMember: (memberId: string, data: { roleId?: string; status?: 'active' | 'suspended' }) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  setSelectedMember: (member: CompanyMember | null) => void;
}

const useCompanyMembersStore = create<CompanyMembersState>()(
  devtools((set, get) => ({
    members: [],
    roles: [],
    isLoading: false,
    error: null,
    selectedMember: null,

    fetchMembers: async (companyId) => {
      set({ isLoading: true });
      try {
        const response = await api.get(`/company-members?companyId=${companyId}`);
        set({ members: response.data, isLoading: false, error: null });
      } catch (error) {
        const apiError = error as ApiError;
        set({ 
          error: apiError.response?.data?.message || 'Failed to fetch company members', 
          isLoading: false 
        });
      }
    },

    fetchRoles: async (companyId) => {
      try {
        const response = await api.get(`/company-roles?companyId=${companyId}`);
        set({ roles: response.data, error: null });
      } catch (error) {
        const apiError = error as ApiError;
        set({ 
          error: apiError.response?.data?.message || 'Failed to fetch company roles'
        });
      }
    },

    addMember: async (companyId, data) => {
      set({ isLoading: true });
      try {
        const response = await api.post('/company-members', {
          ...data,
          companyId
        });
        const { members } = get();
        set({
          members: [...members, response.data],
          isLoading: false,
          error: null
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ 
          error: apiError.response?.data?.message || 'Failed to add member',
          isLoading: false 
        });
        throw apiError;
      }
    },

    updateMember: async (memberId, data) => {
      set({ isLoading: true });
      try {
        const response = await api.patch(`/company-members/${memberId}`, data);
        const { members } = get();
        set({
          members: members.map(member => 
            member.id === memberId ? { ...member, ...response.data } : member
          ),
          isLoading: false,
          error: null
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ 
          error: apiError.response?.data?.message || 'Failed to update member',
          isLoading: false 
        });
        throw apiError;
      }
    },

    removeMember: async (memberId) => {
      set({ isLoading: true });
      try {
        await api.delete(`/company-members/${memberId}`);
        const { members } = get();
        set({
          members: members.filter(member => member.id !== memberId),
          isLoading: false,
          error: null
        });
      } catch (error) {
        const apiError = error as ApiError;
        set({ 
          error: apiError.response?.data?.message || 'Failed to remove member',
          isLoading: false 
        });
        throw apiError;
      }
    },

    setSelectedMember: (member) => {
      set({ selectedMember: member });
    }
  }))
);

export default useCompanyMembersStore;