import { User } from "@/types/User";
import { useEffect, useState } from "react";
import  api  from "@/app/lib/axios";

// This is a mock implementation. You'll want to replace this with your actual implementation.
export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      try {
        const response = await api.get('/auth/me', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading, setUser };
}