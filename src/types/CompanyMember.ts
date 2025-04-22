export interface CompanyMember {
  id: string;
  userId: string;
  roleId: string;
  companyId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: {
    id: string;
    name: string;
  };
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRole {
  id: string;
  name: string;
  description: string;
}