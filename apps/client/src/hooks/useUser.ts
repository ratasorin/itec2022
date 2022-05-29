import { useEffect, useState } from 'react';
import { JwtUser } from '@itec/server/src/auth/interface';
import decode from 'jwt-decode';
import { useAppSelector } from './redux.hooks';
const useUser = () => {
  const [user, setUser] = useState<JwtUser | null>(null);
  const fetchedUser = useAppSelector(({ user }) => user);

  useEffect(() => {
    setUser(fetchedUser);
  }, [fetchedUser]);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (!jwt) return;
    const user = decode(jwt) as JwtUser;
    setUser(user);
  }, []);
  return user;
};

export default useUser;
