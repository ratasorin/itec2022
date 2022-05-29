import { useMemo } from 'react';

interface User {
  name: string;
  admin: boolean;
}

export const useUser = () => {
  const user: User | null = useMemo(() => ({
    name: 'Tudor',
    admin: false,
  }), []);

  return user;
};