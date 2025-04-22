export type CompanyType = 'COMPANY' | 'AGENCY';

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  description?: string;
  type: CompanyType;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}