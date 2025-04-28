export interface Company {
  id: string;
  name: string;
  type: 'COMPANY' | 'AGENCY';
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  coverImage?: string;
  isActive: boolean;
  defaultRoleId?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  countryId?: string;
  createdAt: string;
  updatedAt: string;
}