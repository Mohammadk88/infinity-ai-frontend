import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios from '@/app/lib/axios';
import { AxiosError } from 'axios';

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  logoUrl?: string;
  coverImage?: string;
  isActive: boolean;
  defaultRole: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiErrorResponse {
  message: string;
}

interface CompanyState {
  companies: Company[];
  currentCompany: Company | null;
  isLoading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  fetchCompany: (id: string) => Promise<void>;
  updateCompany: (id: string, data: FormData) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  setCurrentCompany: (company: Company) => void;
  reset: () => void;
}

export const useCompanyStore = create<CompanyState>()(
  devtools(
    persist(
      (set) => ({
        companies: [],
        currentCompany: null,
        isLoading: false,
        error: null,

        fetchCompanies: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get('/companies');
            set({ companies: response.data });
            // Set first company as current if none selected
            const state = useCompanyStore.getState();
            if (!state.currentCompany && response.data.length > 0) {
              set({ currentCompany: response.data[0] });
            }
          } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({ error: err.response?.data?.message || 'Failed to fetch companies' });
          } finally {
            set({ isLoading: false });
          }
        },

        fetchCompany: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.get(`/companies/${id}`);
            // Update company in companies array
            set((state) => ({
              companies: state.companies.map((c) => 
                c.id === id ? response.data : c
              ),
              currentCompany: state.currentCompany?.id === id ? response.data : state.currentCompany
            }));
          } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({ error: err.response?.data?.message || 'Failed to fetch company' });
          } finally {
            set({ isLoading: false });
          }
        },
        updateCompany: async (id: string, formData: FormData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.put(`/companies/${id}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Update company in companies array and current company if needed
            set((state) => ({
              companies: state.companies.map((c) => 
                c.id === id ? response.data : c
              ),
              currentCompany: state.currentCompany?.id === id ? response.data : state.currentCompany
            }));
            
            return response.data;
          } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({ error: err.response?.data?.message || 'Failed to update company' });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        deleteCompany: async (id: string) => {
          set({ isLoading: true, error: null });
          try {
            await axios.delete(`/companies/${id}`);
            // Remove company from companies array and clear current if needed
            set((state) => ({
              companies: state.companies.filter((c) => c.id !== id),
              currentCompany: state.currentCompany?.id === id ? null : state.currentCompany
            }));
          } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({ error: err.response?.data?.message || 'Failed to delete company' });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        setCurrentCompany: (company: Company) => {
          set({ currentCompany: company });
        },

        reset: () => {
          set({ companies: [], currentCompany: null, isLoading: false, error: null });
        },
      }),
      {
        name: 'company-storage',
        partialize: (state) => ({ 
          companies: state.companies,
          currentCompany: state.currentCompany 
        }),
      }
    )
  )
);