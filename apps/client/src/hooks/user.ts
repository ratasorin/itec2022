import { JwtUser } from '@shared';
import jwtDecode from 'jwt-decode';
import { useMemo } from 'react';
import { useLocalStorage } from './local-storage';

export const useUser = () => {
  const { state } = useLocalStorage('token');
  const user: JwtUser | null = useMemo(
    () => (state ? jwtDecode(state) : null),
    [state]
  );
  return user;
};
