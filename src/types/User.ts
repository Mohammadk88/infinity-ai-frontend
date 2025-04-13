export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown; // لتوسعة النوع مستقبلاً بدون مشاكل
  }
  