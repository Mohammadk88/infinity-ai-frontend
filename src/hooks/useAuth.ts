'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';

export function useAuth(protect: boolean = false) {
  interface User {
    id: string;
    name: string;
    email: string;
    // Add other fields as needed
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me', { withCredentials: true });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setUser(null);
        setLoading(false);
        console.error(err);
        if (protect) router.push('/auth/login');
      }
    };
    checkAuth();
  }, [protect, router]);

  return { user, loading };
}
