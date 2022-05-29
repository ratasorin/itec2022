import decode from 'jwt-decode';
import { JwtUser } from '@itec/server/src/auth/interface';
const getUser = () => {
  const jwt = localStorage.getItem('token');
  console.log({ jwt });
  if (!jwt) return null;
  const user = decode(jwt) as JwtUser;
  console.log({ user });
  return user;
};

export default getUser;
