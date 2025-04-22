import { create } from 'zustand'

type RegistrationType = 'COMPANY' | 'PERSONAL'
type CompanyType = 'COMPANY' | 'AGENCY'

interface RegistrationState {
  activeTab: 'company' | 'personal'
  companyForm: {
    name: string
    email: string
    phone: string
    address: string
    country: string
    city: string
    website: string
    description: string
    type: CompanyType
    ownerName: string
    ownerEmail: string
    password: string
    confirmPassword: string
  }
  personalForm: {
    fullName: string
    email: string
    password: string
    confirmPassword: string
  }
  setActiveTab: (tab: 'company' | 'personal') => void
  updateCompanyForm: (data: Partial<RegistrationState['companyForm']>) => void
  updatePersonalForm: (data: Partial<RegistrationState['personalForm']>) => void
  resetForms: () => void
}

const initialCompanyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  country: '',
  city: '',
  website: '',
  description: '',
  type: 'COMPANY' as CompanyType,
  ownerName: '',
  ownerEmail: '',
  password: '',
  confirmPassword: '',
}

const initialPersonalForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  activeTab: 'personal',
  companyForm: initialCompanyForm,
  personalForm: initialPersonalForm,
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateCompanyForm: (data) => 
    set((state) => ({ 
      companyForm: { ...state.companyForm, ...data }
    })),
  updatePersonalForm: (data) =>
    set((state) => ({
      personalForm: { ...state.personalForm, ...data }
    })),
  resetForms: () => set({
    companyForm: initialCompanyForm,
    personalForm: initialPersonalForm,
  }),
}))