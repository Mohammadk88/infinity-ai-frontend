'use client';

import { useEffect } from 'react';
import { User } from '@/types/User'; // Adjust the path based on your project structure
import api from '@/app/lib/axios';
import { useUserStore } from '@/store/useUserStore';

export function useSessionLoader() {
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (!user) {
      api.get('/auth/me', { withCredentials: true })
        .then((res: { data: User }) => setUser(res.data))
        .catch(() => {});
    }
  }, [setUser, user]);
}
