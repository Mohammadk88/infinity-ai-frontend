'use client';

import { useEffect, useRef } from 'react';
import { User } from '@/types/User'; // Adjust the path based on your project structure
import api from '@/app/lib/axios';
import { useUserStore } from '@/store/useUserStore';

export function useSessionLoader() {
  const hasFetched = useRef(false); // نضيفها فوق

  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (!user && !hasFetched.current) {
      hasFetched.current = true;
      api.get('/auth/me', { withCredentials: true })
        .then((res: { data: User }) => setUser(res.data))
        .catch(() => {});
    }
  }, [setUser, user]);
}
