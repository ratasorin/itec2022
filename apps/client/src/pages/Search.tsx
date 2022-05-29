import { JwtUser } from '@shared';
import jwtDecode from 'jwt-decode';
import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import getUser from '../utils/user';
import SearchBar from 'material-ui-search-bar';
import { url } from '../constants/server';
import { Building } from '@shared';

function SearchPage(): ReactElement {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);

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
    const getAllBuildings = async () => {
      const response = await fetch(url('buildings'));
      const buildings = (await response.json()) as Building[];
      console.log({ buildings });
      setBuildings(buildings);
    };

    getAllBuildings();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center p-10">
      <div className="text-3xl font-mono font-light pb-5">
        Cauta un loc liber
      </div>
      <div className="w-3/5">
        <SearchBar className="border-4" />
        {buildings.map(({ name, id, floors }) => (
          <div
            key={name}
            onClick={() =>
              navigate({ pathname: `buildings/${id}` }, { state: floors })
            }
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
