'use client';

import { useUserStore } from '@/store/useUserStore';
import { useState } from 'react';

export function useAuth() {
  const { user } = useUserStore();
  const [loading] = useState(true);

  if (user) {
    return { user: user, loading: false };
  }

  return { user, loading };
}
