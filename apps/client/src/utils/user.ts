import decode from 'jwt-decode';
import { JwtUser } from '@shared';
const getUser = () => {
  const jwt = localStorage.getItem('token');
  if (!jwt) return null;
  const user = decode(jwt) as JwtUser;
  return user;
};

export default getUser;
