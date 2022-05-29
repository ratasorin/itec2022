import { JwtUser } from '@itec/server/src/auth/interface';
import jwtDecode from 'jwt-decode';
import { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router';
import getUser from '../utils/user';
import SearchBar from 'material-ui-search-bar';
import { url } from '../constants/server';

function SearchPage(): ReactElement {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user) navigate({ pathname: '/auth' });
  }, [navigate]);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    console.log({ jwt });
    if (!jwt) return;
    const user = jwtDecode(jwt) as JwtUser;
    console.log({ user });
  }, []);

  useEffect(() => {
    const response = fetch(url('buildings'));
  });

  return (
    <div className="w-screen h-screen flex flex-col items-center p-10">
      <div className="text-3xl font-mono font-light pb-5">
        {' '}
        Cauta un loc liber
      </div>
      <div className="w-3/5">
        <SearchBar className="border-4" />
      </div>
    </div>
  );
}

export default SearchPage;
