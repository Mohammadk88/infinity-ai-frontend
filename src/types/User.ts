import { Id } from './../../node_modules/@types/react-beautiful-dnd/index.d';
export interface User {
  avatar: any;
  id: string;
  name: string;
  email: string;
  role?: string;
  referralCode?: string;
  affiliateId?: string;
  affiliate?: {
    Id: Id;
    status: string;
    commission: string;
    isActive: boolean;
    tierId: string;
  };
}
